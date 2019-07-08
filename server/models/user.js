const Base = require('./base.js');
const Kanji = require('./kanji.js');
const Word = require('./word.js');

// User structure:
// {
//   _id: BSON id
//   name: string
//   email: string
//   sessionToken: string
//   gradeLevel: integer
//   kanjiLearned: array of BSON ids
//   kanjiToLearn: array of BSON ids
//   words: {
//     fresh: JMDict entry id => Word
//     learned: JMDict entry id => Word
//     ignored: JMDict entry id => Word
//   }
// }

let findUser = async (db, name) => {
  let user = await db.collection('users').findOne({ name: name });

  if (!user) {
    throw `user with name ${name} not found!`;
  }

  return user;
};

let buildUser = (attributes) => {
  Base.validate(attributes, 'name');
  Base.validate(attributes, 'email');
  Base.validate(attributes, 'gradeLevel');
  Base.validate(attributes, 'kanjiToLearn');

  return {
    name: attributes.name,
    email: attributes.email,
    sessionToken: "",
    gradeLevel: attributes.gradeLevel,
    kanjiLearned: [],
    kanjiToLearn: attributes.kanjiToLearn,
    words: {
      fresh: {},
      learned: {},
      ignored: {}
    }
  }
}

exports.create = async (db, attributes) => {
  attributes.gradeLevel = 1;
  attributes.kanjiToLearn = await Kanji.getIdsForGrade(db, attributes.gradeLevel);

  let user = buildUser(attributes);

  let result = await db.collection('users').insertOne(user)
};

exports.find = async (db, name) => {
  return await findUser(db, name);
};

exports.learnKanji = async (db, name, learnedKanjiId) => {
  let user = await findUser(db, name);

  if (user.kanjiLearned.includes(learnedKanjiId)) {
    return;
  }

  if (user.kanjiToLearn.includes(learnedKanjiId)) {
    // Remove the kanji from the user's kanjiToLearn
    user.kanjiToLearn = user.kanjiToLearn.filter((kanjiId) => {
      return kanjiId !== learnedKanjiId;
    });
  }

  user.kanjiLearned.push(learnedKanjiId);

  // TODO: get the words and add them to the user

  let result = await db.collection('users').updateOne(
    { name: name },
    {
      $set: {
        kanjiLearned: user.kanjiLearned,
        kanjiToLearn: user.kanjiToLearn,
        "words.fresh": user.words.fresh
      }
    }
  );
};

exports.learnWord = async (db, name, learnedWordId) => {
  let user = await getUser(db, name);

  if (!user.words.fresh[learnedWordId] ||
      user.words.learned[learnedWordId] ||
      user.words.ignored[learnedWordId]) {
    return;
  }

  let learnedWord = Word.buildLearned();

  let result = await db.collection('users').updateOne(
    { name: name },
    {
      $set: {
        'words.fresh': user.words.fresh,
        `words.learned.${learnedWordId}`: learnedWord
      }
    }
  );
};
