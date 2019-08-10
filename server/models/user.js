// User structure:
// {
//   _id: BSON id
//   name: string
//   password: string (hashed)
//   sessionToken: string
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

class User {
  constructor(attributes) {
    this.name = attributes.name;
    this.password = attributes.password;
    this.sessionToken = attributes.sessionToken;
    this.gradeLevel = attributes.gradeLevel;
    this.kanjiLearned = attributes.kanjiLearned;
    this.kanjiToLearn = attributes.kanjiToLearn;
    this.words = attributes.words;
  }

  static buildNew(attributes) {
    // potential validations:
    // * ensure name is alphanumeric
    // * ensure password is reasonable

    // things to do:
    // * hash password
    // * create session token?

    return new User({
      name: attributes.name,
      password: attributes.password,
      sessionToken: "", // TODO: how to handle session tokens? in the user class?
      gradeLevel: 1,
      kanjiLearned: [],
      kanjiToLearn: Kanji.getForGrade(1),
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

  static async findByName(db, name) {
    let dbUser = await db.collection('users').findOne({ name: name });

    if (!dbUser) {
      throw `user with name ${name} not found!`;
    }

    return new User(dbUser);
  }

  async save(db) {
    await db.collection('users').updateOne(
      { name: this.name },
      {
        $set: {
          // password: this.password,
          sessionToken: this.sessionToken,
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

    this.kanjiToLearn.filter((learnedKanji) => {
      return kanji !== learnedKanji;
    });

    if (this.kanjiToLearn.length === 0) {
      // bump grade level
      // populate kanjiToLearn with new grade kanji
    }

    this.kanjiLearned.push(kanji);

    // find new words based on learned kanji
    // add words to fresh

    this.save(db);
  }

  async learnWord(db, entryId) {
    if (wordNotFresh(entryId)) {
      return;
    }

    this.words.fresh.filter((freshWordId) => {
      return entryId !== freshWordId;
    });

    this.words.learned[entryId] = Word.buildNewlyLearned();

    this.save(db);
  }

  async reviewWord(db, entryId, success) {
    let word = this.words.learned[entryId];

    if (!word) {
      return;
    }

    this.words.learned[entryId] = Word.review(word, success);

    this.save(db);
  }

  async ignoreWord(db, entryId) {
    if (wordNotFresh(entryId)) {
      return;
    }

    this.words.fresh.filter((freshWordId) => {
      return entryId !== freshWordId;
    });

    this.words.ignored.push(entryId);

    this.save(db);
  }

  static wordNotFresh(entryId) {
    return !this.words.fresh.includes(entryId) ||
        this.words.learned[entryId] ||
        this.words.ignoredincludes(entryId);
  }
};

module.exports = User;
