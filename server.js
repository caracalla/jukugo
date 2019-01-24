var express = require('express');
var app = express();
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

app.use(cors());

app.get('/entries', function (request, response) {
  var page = request.query.page || 1;
  var pageSize = 50;

  var findQuery = {
    writings: {
      $elemMatch: {
        priority: {
          $gte: 1
        },
        kanjiCount: {
          $gte: 2
        }
      }
    }
  };

  var sortQuery = { "writing.priority": -1, "writings.frequencyRating": 1 };

  if (request.query.grade) {
    findQuery.writings.$elemMatch.grade = {
      $exists: true,
      $lte: parseInt(request.query.grade)
    };
  }

  if (request.query.onlyKanji) {
    findQuery.writings.$elemMatch.onlyKanji = true;
  }

  if (request.query.writing) {
    findQuery.writings.kanji = new RegExp(request.query.writing);
  }

  if (request.query.reading) {
    findQuery.readings.kana = new RegExp(request.query.reading, "i");
  }

  if (request.query.translation) {
    findQuery.senses.translations.glossaries = new RegExp(request.query.translation, "i");
  }

  console.log(JSON.stringify(request.query));
  console.log(JSON.stringify(findQuery));

  // db.entries.find({"writings.grade": {$exists: true, $eq: grade}}).skip(pagesize * (page - 1)).limit(pagesize);
  // result = db.entries.find({"writings.grade": {$exists: true, $eq: grade}}).limit(50);
  db.collection('entries', function (err, collection) {
    if (err) { throw err; }

    collection.count(findQuery, function (err, count) {
      if (err) { throw err; }
      entry_count = count;
    });

    // I don't remember why this is even here
    // collection.find(findQuery).sort(sortQuery).skip(pageSize * (page - 1)).limit(pageSize).toArray(function (err, entries) {
    collection.find(findQuery).sort(sortQuery).limit(pageSize).toArray(function (err, entries) {
      if (err) { throw err; }

      var response_obj = {entries: entries};

      collection.count(findQuery, function (err, count) {
        if (err) { throw err; }
        response_obj.count = count;
        response.json(response_obj);
      });
    });
  });

  console.log(request.ip);
})

MongoClient.connect(mongoURL, function (err, database) {
  if (err) { throw err; }
  db = database;

  var port = 3000;

  app.listen(port, function () {
    console.log('listening on ' + port)
  })
})
