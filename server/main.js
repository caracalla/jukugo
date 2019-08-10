const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

const User = require('./models/user.js');

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
    response.json({ user: user });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }
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
