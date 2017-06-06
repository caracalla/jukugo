var express = require('express');
var app = express();
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

app.use(cors());

app.get('/entries', function (request, response) {
  // Replace these with request parameters
  var grade = 1;
  var page = request.query.page || 1;
  var pageSize = 50;
  var findQuery = { "writings.grade": { $exists: true, $eq: grade }, "writings.frequencyRating": { $exists: true } };
  var sortQuery = { "writings.priority": -1 };
  
  var writing = request.query.writing;
  var reading = request.query.reading;
  var translation = request.query.translation;

  if (translation) {
    findQuery["senses.translations.glossaries"] = translation;
  }

  console.log(JSON.stringify(request.query));

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
