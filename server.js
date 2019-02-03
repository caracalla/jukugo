var express = require('express');
var app = express();
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

// Set up Express
app.use(cors());

app.get('/', function (request, response) {
  response.json({message: 'hi'});
});

app.get('/entries', function (request, response) {
  var pageSize = 20;
  var page = parseInt(request.query.page);

  if (page < 1) {
    page = 1;
  }

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
    findQuery['writings.kanji'] = new RegExp(request.query.writing);
  }

  if (request.query.reading) {
    findQuery['readings.kana'] = new RegExp(request.query.reading, "i");
  }

  if (request.query.translation) {
    findQuery['senses.translations.glossaries'] = new RegExp(request.query.translation, "i");
  }

  console.log('client query: ' + JSON.stringify(request.query));
  console.log('mongo query: ' + JSON.stringify(findQuery));

  db.collection('entries', function (err, collection) {
    if (err) { throw err; }

    collection.
        find(findQuery).
        sort(sortQuery).
        skip(pageSize * (page - 1)).
        limit(pageSize).
        toArray(function (err, entries) {
      if (err) { throw err; }

      var response_obj = {entries: entries};

      collection.count(findQuery, function (err, total) {
        if (err) { throw err; }
        response_obj.total_count = total;
        console.log('results in page: ' + entries.length);
        console.log('total results: ' + total + '\n');
        response.json(response_obj);
      });
    });
  });

  console.log(request.ip);
});


// Set up Mongo and kick things off
MongoClient.connect(mongoURL, function (err, database) {
  if (err) { throw err; }
  db = database;

  var port = 3000;

  app.listen(port, function () {
    console.log('listening on ' + port);
  });
});
