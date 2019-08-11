const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

const User = require('./models/user.js');
const Entry = require('./models/entry.js');

// Set up Express
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());



app.get('/', async (request, response) => {
  console.log('just saying hi :)\n');
  response.json({ message: 'hi' });
});



app.get('/users/:name', async (request, response) => {
  console.log(`fetching user with name ${request.params.name}`);

  try {
    let user = await User.findByName(db, request.params.name);
    response.json({ user: user.formatForClient() });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});



app.post('/users/:name/reset', async (request, response) => {
  console.log(`resetting user ${request.params.name}\n`);

  try {
    await User.reset(db, request.params.name);
    response.json({ result: 'success' });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});



app.post('/users/:name/kanji', async (request, response) => {
  console.log(`user ${request.params.name} learning kanji ${request.body.kanji}`);

  try {
    let user = await User.findByName(db, request.params.name);
    await user.learnKanji(db, request.body.kanji);

    response.json({ result: 'success' });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});



app.get('/users/:name/words/fresh', async (request, response) => {
  console.log(`getting fresh words for user ${request.params.name}\n`);

  try {
    let user = await User.findByName(db, request.params.name);
    let entries = await Entry.findByIds(db, user.words.fresh);

    response.json({ entries: entries });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});



(async () => {
  const client = new MongoClient(mongoURL, { useNewUrlParser: true });

  await client.connect();
  // This is gross, is there another way?
  db = client.db();

  await app.listen(port, async () => {
    console.log(`Jukugo server is listening on port ${port}\n`);
  });
})().catch((e) => { console.log(e) });
