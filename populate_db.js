var fs = require('fs');
var parser = new require("xml2js").Parser({ ignoreAttrs: true });
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var xmlFileName = "JMdict_e";
var sleep = require('sleep');

var parseKanjiElement = function (kanjiElement) {
  writingObject = { kanji: kanjiElement.keb[0] };

  if (Array.isArray(kanjiElement.ke_pri)) {
    writingObject.priorities = kanjiElement.ke_pri;
  }
  if (Array.isArray(kanjiElement.ke_inf)) {
    writingObject.info = kanjiElement.ke_inf;
  }

  return writingObject;
};

var parseReadingElement = function (readingElement) {
  readingObject = { kana: readingElement.reb[0] };

  if (Array.isArray(readingElement.re_pri)) {
    readingObject.priorities = readingElement.re_pri;
  }
  if (Array.isArray(readingElement.re_inf)) {
    readingObject.info = readingElement.re_inf;
  }

  return readingObject;
};

var parseSenseElement = function (senseElement) {
  senseObject = {};

  if (Array.isArray(senseElement.pos)) {
    senseObject.partsOfSpeech = senseElement.pos;
  }
  if (Array.isArray(senseElement.gloss)) {
    senseObject.translations = senseElement.gloss;
  }
  if (Array.isArray(senseElement.s_inf)) {
    senseObject.info = senseElement.s_inf;
  }
  if (Array.isArray(senseElement.field)) {
    senseObject.fields = senseElement.field;
  }
  if (Array.isArray(senseElement.xref)) {
    senseObject.similar = senseElement.xref;
  }
  if (Array.isArray(senseElement.ant)) {
    senseObject.antonyms = senseElement.ant;
  }
  if (Array.isArray(senseElement.misc)) {
    senseObject.misc = senseElement.misc;
  }
  if (Array.isArray(senseElement.lsource)) {
    senseObject.loanwords = senseElement.lsource;
  }
  if (Array.isArray(senseElement.dial)) {
    senseObject.dialects = senseElement.dial;
  }
  if (Array.isArray(senseElement.stagr)) {
    senseObject.associatedReadings = senseElement.stagk;
  }
  if (Array.isArray(senseElement.stagk)) {
    senseObject.associatedWritings = senseElement.stagk;
  }

  return senseObject;
};

var storeEntry = function (entry) {
  entryObject = { entryId: entry.ent_seq[0] };

  if (Array.isArray(entry.k_ele)) {
    entryObject.writings = entry.k_ele.map(parseKanjiElement);
  }
  if (Array.isArray(entry.r_ele)) {
    entryObject.readings = entry.r_ele.map(parseReadingElement);
  }
  if (Array.isArray(entry.sense)) {
    entryObject.senses = entry.sense.map(parseSenseElement);
  }

  return entryObject;
};

var parseData = function (db, callback) {
  fs.readFile(xmlFileName, 'utf8', function (err, data) {
    if (err) { throw err; }

    parser.parseString(data, function (err, result) {
      if (err) { throw err; }

      parsedData = result.JMdict.entry.map(storeEntry);

      db.collection('entries').insertMany(parsedData, callback)
    });
  })
}

MongoClient.connect(mongoURL, function(err, db) {
  if (err) { throw err; }

  parseData(db, function(err, result) {
    if (err) { throw err; }

    console.log("done!");
    console.log(result.result.n);
    db.close();
  });
});
