fs = require('fs');
parser = require('xml2js').parseString;
// var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://localhost:27017/myproject';
xmlFileName = "smaller_dict.xml";

storeEntry = function (entry) {
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

parseKanjiElement = function (kanjiElement) {
  writingObject = { kanji: kanjiElement.keb[0] };

  if (Array.isArray(kanjiElement.ke_pri)) {
    writingObject.priorities = kanjiElement.ke_pri;
  }
  if (Array.isArray(kanjiElement.ke_inf)) {
    writingObject.info = kanjiElement.ke_inf;
  }

  return writingObject;
};

parseReadingElement = function (readingElement) {
  readingObject = { kana: readingElement.reb[0] };

  if (Array.isArray(readingElement.re_pri)) {
    readingObject.priorities = readingElement.re_pri;
  }
  if (Array.isArray(readingElement.re_inf)) {
    readingObject.info = readingElement.re_inf;
  }

  return readingObject;
};

parseSenseElement = function (senseElement) {
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

parseData = function () {
  var database = []

  fs.readFile(xmlFileName, 'utf8', function (err, data) {
    if (err) { throw err; }

    parser(data, function (err, result) {
      if (err) { throw err; }

      database = result.JMdict.entry.map(storeEntry)
      console.log("done!");
    });
  })
}

parseData();

// fs.readFile('json/object1.json', 'utf8', function (err, data) {
//   if (err) throw err;
//   console.log(data);
//   var json = JSON.parse(data);
//
//   db.configurations.insert(json, function(err, doc) {
//     console.log(data);
//     if(err) throw err;
//   });
// })
