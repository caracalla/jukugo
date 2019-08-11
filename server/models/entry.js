// Entry structure:
// {
//   real complicated
// }

exports.findForKanji = async (db, kanji) => {
  let findQuery = {
    primaryKanji: {
      $elemMatch: { $eq: kanji }
    },
    writings: {
      $elemMatch: {
        priority: { $gte: 1 },
        kanjiCount: { $gte: 2 }
      }
    }
  };

  let entries = await db.collection('entries').find(findQuery);

  return entries.toArray();
}

exports.findByIds = async (db, entryIds) => {
  let entries = await db.collection('entries').find({ _id: { $in: entryIds } });

  return entries.toArray();
}
