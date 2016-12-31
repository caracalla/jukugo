console.log("今日は！");

var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

// Connection URL
var mongoURL = 'mongodb://localhost:27017/jukugo';

// Use connect method to connect to the server
MongoClient.connect(mongoURL, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});
