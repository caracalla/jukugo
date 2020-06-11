// User structure:
// {
//   _id: BSON id
//   name: string
//   password: string (hashed)
//   gradeLevel: integer
//   kanjiLearned: array of kanji (of all time learned)
//   kanjiToLearn: array of kanji (only of grade level)
//   words: {
//     fresh: array of JMDict entry ids
//     learned: {
//       JMDict entry id => {
//         status
//         timestamp
//         level
//       }
//     }
//     ignored: array of JMDict entry ids
//   }
// }

const Kanji = require('./kanji.js');
const Word = require('./word.js');
const Entry = require('./entry.js');


class User {
  constructor(attributes) {
    this.name = attributes.name;
    this.password = attributes.password;
    this.gradeLevel = attributes.gradeLevel;
    this.kanjiLearned = attributes.kanjiLearned;
    this.kanjiToLearn = attributes.kanjiToLearn;
    this.words = attributes.words;
  }

  static buildNew(attributes) {
    let nameRegex = /^[a-z0-9]+$/i;

    if (!nameRegex.test(attributes.name)) {
      throw `"${attributes.name}" is not a valid username!`;
    }

    return new User({
      name: attributes.name,
      password: attributes.password,
      gradeLevel: 1,
      kanjiLearned: [],
      kanjiToLearn: Kanji.getForGrade(1),
      // kanjiToLearn: [Kanji.getForGrade(1)[0]], // for testing advancing grades
      words: {
        fresh: [],
        learned: {},
        ignored: []
      }
    });
  }

  static async create(db, attributes) {
    let existingUser = await db.collection('users').findOne({ name: attributes.name });

    if (existingUser) {
      throw `user with name ${attributes.name} already exists!`;
    }

    let user = this.buildNew(attributes);

    let result = await db.collection('users').insertOne(user);

    return user;
  }

  // TODO: remove
  static async reset(db, name) {
    await db.collection('users').deleteOne({ name: name });
    return await this.create(db, { name: name });
  }

  static async findByName(db, name) {
    let dbUser = await db.collection('users').findOne({ name: name });

    if (!dbUser) {
      throw `user with name ${name} not found!`;
    }

    return new User(dbUser);
  }

  // make sure the password is sane (longer than 8 chars, etc)
  static validatePassword(password) {
    if (password.length < 8) {
      return false;
    }

    return true;
  }

  async save(db) {
    await db.collection('users').updateOne(
      { name: this.name },
      {
        $set: {
          // password: this.password,
          gradeLevel: this.gradeLevel,
          kanjiLearned: this.kanjiLearned,
          kanjiToLearn: this.kanjiToLearn,
          words: this.words
        }
      }
    );
  }

  async learnKanji(db, kanji) {
    if (this.kanjiLearned.includes(kanji)) {
      return;
    }

    // update kanji to learn
    this.kanjiToLearn = this.kanjiToLearn.filter((learnedKanji) => {
      return kanji !== learnedKanji;
    });

    if (this.kanjiToLearn.length === 0) {
      this.gradeLevel += 1;
      this.kanjiToLearn = Kanji.getForGrade(this.gradeLevel);
    }

    // update learned kanji
    this.kanjiLearned.push(kanji);

    // add fresh words based on newly learned kanji
    let candidateEntries = await Entry.findForKanji(db, kanji);

    // why didn't this work?
    // for (let entry of candidateEntries) {
    //   // only select entries with more than one primary kanji, and that
    //   // the user doesn't already know
    //   if (entry.primaryKanji.length < 2
    //       || this.words.learned[entry._id]
    //       || this.words.fresh.includes(entry._id)
    //       || this.words.ignored.includes(entry._id)) {
    //     console.log('avoiding invalid entry');
    //     continue;
    //   }

    //   // only select entries that the user knows kanji for
    //   for (let kanji of entry.primaryKanji) {
    //     if (!this.kanjiLearned.includes(kanji)) {
    //       console.log('avoiding invalid entry 2');
    //       continue;
    //     }
    //   }

    //   this.words.fresh.push(entry._id);
    // }

    let entriesToLearn = candidateEntries.filter((entry) => {
      // only select entries with more than one primary kanji, and that
      // the user doesn't already know
      if (entry.primaryKanji.length < 2
          || this.words.learned[entry._id]
          || this.words.fresh.includes(entry._id)
          || this.words.ignored.includes(entry._id)) {
        return false;
      }

      // only select entries that the user knows kanji for
      for (let kanji of entry.primaryKanji) {
        if (!this.kanjiLearned.includes(kanji)) {
          return false;
        }
      }

      return true;
    });

    for (let entry of entriesToLearn) {
      this.words.fresh.push(entry._id);
    }

    await this.save(db);
  }

  async learnWord(db, entryId) {
    if (this.wordNotFresh(entryId)) {
      return;
    }

    this.words.fresh = this.words.fresh.filter((freshWordId) => {
      return entryId !== freshWordId;
    });

    this.words.learned[entryId] = Word.buildNewlyLearned();

    this.save(db);
  }

  async ignoreWord(db, entryId) {
    if (this.wordNotFresh(entryId)) {
      return;
    }

    this.words.fresh = this.words.fresh.filter((freshWordId) => {
      return entryId !== freshWordId;
    });

    this.words.ignored.push(entryId);

    this.save(db);
  }

  wordNotFresh(entryId) {
    return !this.words.fresh.includes(entryId) ||
        this.words.learned[entryId] ||
        this.words.ignored.includes(entryId);
  }

  async reviewWord(db, entryId, success) {
    let word = this.words.learned[entryId];

    if (!word) {
      return;
    }

    this.words.learned[entryId] = Word.review(word, success);

    this.save(db);
  }

  formatForClient() {
    return {
      name: this.name,
      kanjiToLearn: this.kanjiToLearn,
      freshWordsCount: this.words.fresh.length,
      reviewWordsCount: this.getReviewWords().length
    };
  }

  getReviewWords() {
    let now = Date.now();

    let reviewWords = Object.keys(this.words.learned).filter((wordId) => {
      return this.words.learned[wordId].nextReview < now;
    });

    // order the review words by next review, with the oldest review words first
    reviewWords.sort((wordId1, wordId2) => {
      let ts1 = this.words.learned[wordId1].nextReview;
      let ts2 = this.words.learned[wordId2].nextReview;

      return ts1 - ts2;
    });

    return reviewWords;
  }
}

module.exports = User;
