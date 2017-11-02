var express = require('express');
var app = express();
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

app.use(cors());

app.get('/entries', function (request, response) {
  var grades = [1];

  if (request.query.grades) {
    grades = request.query.grades.split(",").map(function (string) {
      return parseInt(string);
    });
  }

  var page = request.query.page || 1;
  var pageSize = 50;
  var findQuery = { "writings.grade": { $exists: true, $in: grades }, "writings.frequencyRating": { $exists: true } };
  var sortQuery = { "writings.priority": -1 };


  if (request.query.writing) {
    findQuery["writings.kanji"] = new RegExp(request.query.writing);
  }

  if (request.query.reading) {
    findQuery["readings.kana"] = new RegExp(request.query.reading, "i");
  }

  if (request.query.translation) {
    findQuery["senses.translations.glossaries"] = new RegExp(request.query.translation, "i");
  }

  console.log(JSON.stringify(request.query));
  console.log(JSON.stringify(findQuery))

  // db.entries.find({"writings.grade": {$exists: true, $eq: grade}}).skip(pagesize * (page - 1)).limit(pagesize);
  // result = db.entries.find({"writings.grade": {$exists: true, $eq: grade}}).limit(50);
  db.collection('entries', function (err, entries) {
    if (err) { throw err; }

    entries.find(findQuery).sort(sortQuery).skip(pageSize * (page - 1)).limit(pageSize).toArray(function (err, entries) {
    // entries.find(findQuery).sort(sortQuery).limit(pageSize).toArray(function (err, entries) {
      if (err) { throw err; }

      response.json(entries);
    })
  })

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
