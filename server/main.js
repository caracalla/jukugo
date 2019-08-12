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


// create a user
app.post('/users', async (request, response) => {
  console.log(`creating user ${request.body.username}`);

  try {
    let user = await User.create(db, {
      name: request.body.username,
      password: request.body.password
    });

    // TODO: change this to return session token and stuff
    response.json({ result: 'success' });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});


app.post('/log_in', async (request, response) => {
  console.log(`logging in ${request.body.username}`);

  try {
    let user = await User.findByName(db, request.body.username);

    // TODO: change this to return session token and stuff
    response.json({ result: 'success' });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});


// get a user
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


// reset a user
// TODO: remove
app.post('/users/:name/reset', async (request, response) => {
  console.log(`resetting user ${request.params.name}`);

  try {
    await User.reset(db, request.params.name);
    response.json({ result: 'success' });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});


// learn a kanji
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


// get a user's fresh words
app.get('/users/:name/words/fresh', async (request, response) => {
  console.log(`getting fresh words for user ${request.params.name}`);

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


// learn a fresh word
app.post('/users/:name/words/learn/:wordId', async (request, response) => {
  console.log(`user ${request.params.name} is learning word ${request.params.wordId}`);

  try {
    let user = await User.findByName(db, request.params.name);
    user.learnWord(db, request.params.wordId);

    response.json({ result: 'success' });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});


// ignore a fresh word
app.post('/users/:name/words/ignore/:wordId', async (request, response) => {
  console.log(`user ${request.params.name} is ignoring word ${request.params.wordId}`);

  try {
    let user = await User.findByName(db, request.params.name);
    user.ignoreWord(db, request.params.wordId);

    response.json({ result: 'success' });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});


// get a user's review words
app.get('/users/:name/words/review', async (request, response) => {
  console.log(`getting words to review for ${request.params.name}`);

  try {
    let user = await User.findByName(db, request.params.name);
    let entries = await Entry.findByIds(db, user.getReviewWords());

    response.json({ entries: entries });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});


// review a learned word
app.post('/users/:name/words/review/:wordId/:status', async (request, response) => {
  console.log(`user ${request.params.name} is reviewing word ${request.params.wordId}`);

  try {
    let user = await User.findByName(db, request.params.name);
    await user.reviewWord(
      db,
      request.params.wordId,
      request.params.status == "pass"
    );

    response.json({ result: 'success' });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});


// start the server
(async () => {
  const client = new MongoClient(mongoURL, { useNewUrlParser: true });

  await client.connect();
  // This is gross, is there another way?
  db = client.db();

  await app.listen(port, async () => {
    console.log(`Jukugo server is listening on port ${port}\n`);
  });
})().catch((e) => { console.log(e) });
