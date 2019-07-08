const Base = require('./base.js');

// Kanji structure:
// {
//   _id: BSON id
//   character: char (the kanji itself)
//   on: array of strings
//   kun: array of strings
//   meaning: array of strings?
// }

exports.getIdsForGrade = async (db, gradeLevel) {
  // is there a way to just get the ids?
  let kanji = await db.collection('kanji').find({gradeLevel: gradeLevel}).toArray();

  return kanji.map((kanji) => {
    return kanji._id;
  });
};
