var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

// Set up Express
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', function (request, response) {
  console.log('just saying hi :)\n');
  response.json({message: 'hi'});
});

app.post('/users/:name/kanji', function (request, response) {
  db.collection('users', function (err, users) {
    if (err) { throw err; }

    users.findOne({ name: request.params.name }, function (err, user) {
      if (err) { throw err; }

      if (user.kanji) {
        user.kanji.push(request.body.kanji);
      } else {
        user.kanji = [request.body.kanji];
      }

      if (!user.words || !user.words.fresh) {
        user.words = {
          fresh: {},
          learned: {},
          ignored: {}
        };
      }

      db.collection('entries', function (err, entries) {
        if (err) { throw err; }

        var findQuery = {
          primaryKanji: {
            $elemMatch: { $eq: request.body.kanji }
          },
          writings: {
            $elemMatch: {
              priority: { $gte: 1 },
              kanjiCount: { $gte: 2 }
            }
          }
        };

        entries.find(findQuery).toArray(function (err, matchingEntries) {
          var entriesToLearn = matchingEntries.filter(function (entry) {
            // only select entries with more than one primary kanji, and that
            // the user doesn't already know
            if (entry.primaryKanji.length < 2
                || user.words.fresh[entry._id]
                || user.words.learned[entry._id]
                || user.words.ignored[entry._id]) {
              return false;
            }

            // only select entries that the user knows kanji for
            for (var kanji of entry.primaryKanji) {
              if (!user.kanji.includes(kanji)) { return false; }
            }

            return true;
          });

          console.log(`found ${entriesToLearn.length} raw matching entries`);

          for (var entry of entriesToLearn) {
            user.words.fresh[entry._id] = {};
          }

          users.updateOne(
            { name: user.name },
            { $set: { words: user.words, kanji: user.kanji } },
            function (err, result) {
              if (err) { throw err; }

              console.log(`updated kanji for user ${request.params.name} with request.body.kanji\n`);

              response.json({ result: 'success' });
            }
          );
        });
      });
    });
  });
});

app.post('/users/:name/resetUser', function (request, response) {
  db.collection('users', function (err, users) {
    if (err) { throw err; }

    users.updateOne(
      { name: request.params.name },
      { $set: { kanji: [], words: { fresh: {}, learned: {}, ignored: {} } } },
      function (err, result) {
        if (err) { throw err; }

        console.log(`reset user ${request.params.name}\n`);
        response.json({ result: 'success' });
      }
    );
  });
});

app.get('/users/:name', function (request, response) {
  db.collection('users', function (err, users) {
    if (err) { throw err; }

    console.log(`fetching user for name ${request.params.name}\n`);

    users.findOne({ name: request.params.name }, function (err, user) {
      if (err) { throw err; }

      response.json({ user: user });
    });
  });
});

app.get('/users/:name/words/:status', function (request, response) {
  var validStatuses = ["fresh", "learned", "ignored"];

  if (!validStatuses.includes(request.params.status)) {
    // does throwing kill the server?
    throw "status is not valid!";
  }

  db.collection('users', function (err, users) {
    if (err) { throw err; }

    users.findOne({ name: request.params.name }, function (err, user) {
      if (err) { throw err; }

      db.collection('entries', function (err, entries) {
        if (err) { throw err; }

        var wordIds = Object.keys(user.words[request.params.status]);

        entries.find({ _id: { $in: wordIds } }).toArray(function (err, entries) {
          response.json({ entries: entries });
        });
      });
    });
  });
});

app.post('/users/:name/words/learn/:wordId', function (request, response) {
  db.collection('users', function (err, users) {
    if (err) { throw err; }

    users.findOne({ name: request.params.name }, function (err, user) {
      if (err) { throw err; }

      if (user.words.fresh[request.params.wordId]) {
        user.words.learned[request.params.wordId] = { nextReview: Date.now() };
        delete user.words.fresh[request.params.wordId];

        users.updateOne({ name: user.name }, { $set: { words: user.words } }, function (err, result) {
          if (err) { throw err; }

          console.log(`user ${user.name} learned word ${request.params.wordId}\n`);

          response.json({ result: 'success' });
        });
      } else {
        response.json({ result: 'noop' });
      }
    });
  });
});

app.post('/users/:name/words/ignore/:wordId', function (request, response) {
  db.collection('users', function (err, users) {
    if (err) { throw err; }

    users.findOne({ name: request.params.name }, function (err, user) {
      if (err) { throw err; }

      if (user.words.fresh[request.params.wordId]) {
        user.words.ignored[request.params.wordId] = {};
        delete user.words.fresh[request.params.wordId];

        users.updateOne({ name: user.name }, { $set: { words: user.words } }, function (err, result) {
          if (err) { throw err; }

          console.log(`user ${user.name} ignored word ${request.params.wordId}\n`);

          response.json({ result: 'success' });
        });
      } else {
        response.json({ result: 'noop' });
      }
    });
  });
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

  console.log('Fetching entries for query: ' + JSON.stringify(request.query));
  console.log('mongo query: ' + JSON.stringify(findQuery));

  db.collection('entries', function (err, entries) {
    if (err) { throw err; }

    entries.
        find(findQuery).
        sort(sortQuery).
        skip(pageSize * (page - 1)).
        limit(pageSize).
        toArray(function (err, matchingEntries) {
      if (err) { throw err; }

      var response_obj = {entries: matchingEntries};

      entries.count(findQuery, function (err, total) {
        if (err) { throw err; }
        response_obj.total_count = total;
        console.log('results in page: ' + matchingEntries.length);
        console.log('total results: ' + total + '\n');
        response.json(response_obj);
      });
    });
  });
});


// Set up Mongo and kick things off
MongoClient.connect(mongoURL, function (err, database) {
  if (err) { throw err; }
  db = database;

  var port = 3000;

  app.listen(port, function () {
    console.log(`listening on port ${port}\n`);
  });
});
