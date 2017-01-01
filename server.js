var express = require('express');
var app = express();
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

app.use(cors());

app.get('/', function (req, res) {
  // Replace these with request parameters
  var grade = 1;
  var page = 1;
  var pageSize = 50;
  var findQuery = { "writings.grade": { $exists: true, $eq: grade } };
  var sortQuery = { "writings.priority": -1 }

  // db.entries.find({"writings.grade": {$exists: true, $eq: grade}}).skip(pagesize * (page - 1)).limit(pagesize);
  // result = db.entries.find({"writings.grade": {$exists: true, $eq: grade}}).limit(50);
  db.collection('entries', function (err, entries) {
    if (err) { throw err; }

    // entries.find(query).skip(pageSize * (page - 1)).limit(pageSize).toArray(function (err, entries) {
    entries.find(findQuery).sort(sortQuery).limit(pageSize).toArray(function (err, entries) {
      if (err) { throw err; }

      res.json(entries);
    })
  })

  console.log(req.ip);
})

MongoClient.connect(mongoURL, function (err, database) {
  if (err) { throw err; }
  db = database;

  var port = 3000;

  app.listen(port, function () {
    console.log('listening on ' + port)
  })
})
