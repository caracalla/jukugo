var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

var fs = require('fs');
var kanjiByGrade = JSON.parse(fs.readFileSync('db/kanji_by_grade.json', 'utf8'));

// This is the basic unit of waiting between reviews
var baseDelayMinutes = 90;
var baseDelayMilliseconds = baseDelayMinutes * 60 * 1000;

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

      // Remove the kanji from the user's to-learn list
      user.kanjiToLearn = user.kanjiToLearn.filter(function(kanji) {
        return kanji !== request.body.kanji;
      });

      if (!user.kanjiLearned) {
        user.kanjiLearned = [request.body.kanji];
      } else {
        user.kanjiLearned.push(request.body.kanji);
      }

      if (!user.words) {
        user.words = {
          fresh: {},
          learned: {},
          ignored: {}
        };
      } else if (!user.words.fresh) {
        user.words.fresh = {};
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
              if (!user.kanjiLearned.includes(kanji)) {
                return false;
              }
            }

            return true;
          });

          console.log(`found ${entriesToLearn.length} fresh words for user ${request.params.name}`);

          for (var entry of entriesToLearn) {
            // empty for now, we might add some metadata later
            user.words.fresh[entry._id] = {};
          }

          users.updateOne(
            { name: user.name },
            {
              $set:{
                words: user.words,
                kanjiToLearn: user.kanjiToLearn,
                kanjiLearned: user.kanjiLearned
              }
            },
            function (err, result) {
              if (err) { throw err; }

              console.log(`updated kanji for user ${request.params.name} with ${request.body.kanji}\n`);

              response.json({ result: 'success' });
            }
          );
        });
      });
    });
  });
});

app.post('/users/:name/reset', function (request, response) {
  db.collection('users', function (err, users) {
    if (err) { throw err; }

    users.updateOne(
      { name: request.params.name },
      { $set:
        {
          kanjiToLearn: kanjiByGrade.grade1,
          kanjiLearned: [],
          gradeLevel: 1, // TODO: make this matter
          words: { fresh: {}, learned: {}, ignored: {} }
        }
      },
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

      var reviewWordsCount = user.words.learned;

      response.json({
        user: {
          name: user.name,
          kanjiToLearn: user.kanjiToLearn,
          freshWordsCount: Object.keys(user.words.fresh).length,
          reviewWordsCount: 5
        }
      });
    });
  });
});

// reconcile this with the other endpoint below it
app.get('/users/:name/words/review', function (request, response) {
  console.log('getting review words for ', request.params.name);
  db.collection('users', function (err, users) {
    if (err) { throw err; }

    users.findOne({ name: request.params.name }, function (err, user) {
      if (err) { throw err; }

      db.collection('entries', function (err, entries) {
        if (err) { throw err; }

        var now = Date.now();

        var dueWordIds = Object.keys(user.words.learned).filter(function (wordId) {
          return user.words.learned[wordId].nextReview < now;
        });

        entries.find({ _id: { $in: dueWordIds } }).toArray(function (err, entries) {
          response.json({ entries: entries });
        });
      });
    });
  });
});

app.get('/users/:name/words/:status', function (request, response) {
  var validStatuses = ["fresh", "learned", "ignored"];

  if (!validStatuses.includes(request.params.status)) {
    // does throwing kill the server?  guess not?
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
        user.words.learned[request.params.wordId] = {
          nextReview: Date.now() + baseDelayMilliseconds,
          level: 1
        };

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

app.post('/users/:name/words/review/:wordId/:status', function (request, response) {
  db.collection('users', function (err, users) {
    if (err) { throw err; }

    users.findOne({ name: request.params.name }, function (err, user) {
      if (err) { throw err; }

      var reviewedWord = user.words.learned[request.params.wordId];

      if (reviewedWord) {
        if (request.params.status === "pass") {
          reviewedWord.level = reviewedWord.level + 1;
        } else {
          // TODO: tune this
          reviewedWord.level = Math.floor(reviewedWord.level / 3) + 1;
        }

        reviewedWord.nextReview = Date.now() + (baseDelayMilliseconds * reviewedWord.level);

        user.words.learned[request.params.wordId] = reviewedWord;

        users.updateOne({ name: user.name }, { $set: { words: user.words } }, function (err, result) {
          if (err) { throw err; }

          console.log(`user ${user.name} ${request.params.status}ed a review of word ${request.params.wordId}\n`);

          response.json({ result: 'success' });
        });
      } else {
        response.json({ result: 'noop' });
      }
    });
  });
});

// This drives legacy Jukugo, AKA Sagasu
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
