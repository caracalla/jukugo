var fs = require('fs');
var parser = new require("xml2js").Parser({ ignoreAttrs: true });
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var JMdictFile = "JMdict_san";

var kanjiByGrade = JSON.parse(fs.readFileSync('kanji_by_grade.json', 'utf8'));
var kanjiByGradeMap = (function () {
  var map = {};

  kanjiByGrade.grade1.forEach((kanji) => { map[kanji] = 1 });
  kanjiByGrade.grade2.forEach((kanji) => { map[kanji] = 2 });
  kanjiByGrade.grade3.forEach((kanji) => { map[kanji] = 3 });
  kanjiByGrade.grade4.forEach((kanji) => { map[kanji] = 4 });
  kanjiByGrade.grade5.forEach((kanji) => { map[kanji] = 5 });
  kanjiByGrade.grade6.forEach((kanji) => { map[kanji] = 6 });

  return map;
})();

var frequencyList = JSON.parse(fs.readFileSync('frequency_list.json', 'utf8'));
var frequencyListKeys = Object.keys(frequencyList);

var isKanji = function (character) {
  var lowKanjiCodePoint = 19968;    // 4E00
  var highKanjiCodePoint =  40895;  // 9FBF
  var codePoint = character.codePointAt(0);

  return (codePoint >= lowKanjiCodePoint && codePoint <= highKanjiCodePoint);
};

var determineGradeLevel = function (writing) {
  var onlyKanji = true;
  var gradeLevel = null;
  var kanjiCount = 0;
  var characters = writing.kanji.split('');

  characters.forEach(function (character) {
    if (isKanji(character)) {
      kanjiCount += 1;

      var kanjiGrade = kanjiByGradeMap[character];

      if (kanjiGrade) {
        if (!gradeLevel || kanjiGrade > gradeLevel) {
          gradeLevel = kanjiGrade;
        }
      } else {
        // the kanji isn't within the six kyouiku grade levels
        gradeLevel = 99;
      }
    } else {
      onlyKanji = false;
    }
  })

  if (onlyKanji) {
    writing.onlyKanji = true;
  }

  if (gradeLevel && gradeLevel <= 6) {
    writing.grade = gradeLevel;
  }

  if (kanjiCount > 0) {
    writing.kanjiCount = kanjiCount;
  }
};

var parseKanjiElement = function (kanjiElement) {
  var writing = { kanji: kanjiElement.keb[0] };
  determineGradeLevel(writing);

  if (frequencyListKeys.includes(writing.kanji)) {
    writing.frequencyRating = frequencyList[writing.kanji];
  } else {
    writing.frequencyRating = 99999;
  }

  if (Array.isArray(kanjiElement.ke_pri)) {
    writing.priority = kanjiElement.ke_pri.length;
  }

  if (Array.isArray(kanjiElement.ke_inf)) {
    writing.info = kanjiElement.ke_inf;
  }

  return writing;
};

var parseReadingElement = function (readingElement) {
  var reading = { kana: readingElement.reb[0] };

  if (Array.isArray(readingElement.re_pri)) {
    reading.priority = readingElement.re_pri.length;
  }

  if (Array.isArray(readingElement.re_inf)) {
    reading.info = readingElement.re_inf;
  }

  return reading;
};

var parseSenses = function (senses) {
  var output = [];
  var currentSense;
  var currentTranslation;

  senses.forEach(function (sense) {
    currentTranslation = {};

    if (Array.isArray(sense.pos)) {
      if (currentSense) { output.push(currentSense) }

      currentSense = { partsOfSpeech: sense.pos, translations: [] }
    }

    if (Array.isArray(sense.gloss)) { currentTranslation.glossaries = sense.gloss }
    if (Array.isArray(sense.s_inf)) { currentTranslation.info = sense.s_inf }
    if (Array.isArray(sense.field)) { currentTranslation.fields = sense.field }
    if (Array.isArray(sense.xref)) { currentTranslation.similar = sense.xref }
    if (Array.isArray(sense.ant)) { currentTranslation.antonyms = sense.ant }
    if (Array.isArray(sense.misc)) { currentTranslation.misc = sense.misc }
    if (Array.isArray(sense.lsource)) { currentTranslation.loanwords = sense.lsource }
    if (Array.isArray(sense.dial)) { currentTranslation.dialects = sense.dial }
    if (Array.isArray(sense.stagr)) { currentTranslation.associatedReadings = sense.stagr }
    if (Array.isArray(sense.stagk)) { currentTranslation.associatedWritings = sense.stagk }

    currentSense.translations.push(currentTranslation);
  });

  output.push(currentSense);

  return output;
};

var parseEntry = function (entry) {
  var entryObject = { _id: entry.ent_seq[0] };

  if (Array.isArray(entry.k_ele)) {
    entryObject.writings = entry.k_ele.map(parseKanjiElement);
  }

  if (Array.isArray(entry.r_ele)) {
    entryObject.readings = entry.r_ele.map(parseReadingElement);
  }

  if (Array.isArray(entry.sense)) {
    entryObject.senses = parseSenses(entry.sense);
  }

  return entryObject;
};

var parseData = function (db, callback) {
  fs.readFile(JMdictFile, 'utf8', function (err, XMLData) {
    if (err) { throw err; }

    console.log('about to parse the xml');

    parser.parseString(XMLData, function (err, result) {
      if (err) { throw err; }

      console.log('parsed the xml');

      // db.collection('entries').drop(function (err, result) {
      // });

      console.log('parsing entries');
      // parse each entry
      parsedEntries = result.JMdict.entry.map(parseEntry);

      console.log('about to write');
      db.collection('entries').insertMany(parsedEntries, callback);
    });
  });
};

MongoClient.connect(mongoURL, function (err, db) {
  if (err) { throw err; }

  console.log('connected!');

  parseData(db, function(err, dbResult) {
    if (err) { throw err; }

    console.log("done!");
    console.log(dbResult.result.n + " records inserted");
    db.close();
  });
});
