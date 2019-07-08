const Base = require('./base.js');

// Word structure:
// {
//   nextReview: Unix timestamp
//   level: integer
// }

exports.getIdsForGrade = async (db, gradeLevel) {
  // is there a way to just get the ids?
  let kanji = await db.collection('kanji').find({gradeLevel: gradeLevel}).toArray();

  return kanji.map((kanji) => {
    return kanji._id;
  });
}
