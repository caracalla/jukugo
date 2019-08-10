// Kanji structure:
// {
//   _id: BSON id
//   character: char (the kanji itself)
//   on: array of strings
//   kun: array of strings
//   meaning: array of strings?
// }

const kanjiByGrade = require('../data/kanji_by_grade.json');

exports.getForGrade = (grade) => {
  let gradeString = `grade${grade}`;

  return kanjiByGrade[gradeString];
};
