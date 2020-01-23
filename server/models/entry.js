// Entry structure:
// {
//   real complicated
// }

const pageSize = 20;

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

  return await db.collection('entries').find(findQuery).toArray();
};

exports.findByIds = async (db, entryIds, options = {}) => {
  let result = await db.collection('entries').
      find({ _id: { $in: entryIds } }).
      toArray();

  if (options.maintainOrder) {
    result.sort((entry1, entry2) => {
      return entryIds.indexOf(entry1._id) - entryIds.indexOf(entry2._id);
    });
  }

  return result;
};

exports.findForSagasu = async (db, query) => {
  let page = parseInt(query.page);

  if (page < 1) {
    page = 1;
  }

  let findQuery = {
    writings: {
      $elemMatch: {
        priority: { $gte: 1 },
        kanjiCount: { $gte: 2 }
      }
    }
  };

  let sortQuery = { "writing.priority": -1, "writings.frequencyRating": 1 };

  if (query.grade) {
    findQuery.writings.$elemMatch.grade = {
      $exists: true,
      $lte: parseInt(query.grade)
    };
  }

  if (query.onlyKanji) {
    findQuery.writings.$elemMatch.onlyKanji = true;
  }

  if (query.writing) {
    findQuery['writings.kanji'] = new RegExp(query.writing);
  }

  if (query.reading) {
    findQuery['readings.kana'] = new RegExp(query.reading, "i");
  }

  if (query.translation) {
    findQuery['senses.translations.glossaries'] = new RegExp(query.translation, "i");
  }

  let entriesCount = await db.collection('entries').countDocuments(findQuery);

  let response = {
    total_count: entriesCount,
    entries: []
  };

  if (entriesCount === 0) {
    return response;
  }

  response.entries = await db.collection('entries').
      find(findQuery).
      sort(sortQuery).
      skip(pageSize * (page - 1)).
      limit(pageSize).
      toArray();

  return response;
};
