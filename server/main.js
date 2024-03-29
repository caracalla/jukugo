const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/jukugo';
var db;

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const User = require('./models/user.js');
const Entry = require('./models/entry.js');

// Set up Express
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


// test endpoint
app.get('/', async (request, response) => {
  console.log(`just saying hi :)\n`);
  console.log(`headers: ${JSON.stringify(request.headers, null, 2)}\n`);
  response.json({ message: 'hi' });
});


// view all words a user has learned, in table format
app.get('/user/:name', async (request, response) => {
  let username = request.params.name;

  // we're going to build the page's HTML in this array
  let content = [];

  try {
    let user = await User.findByName(db, username);
    let entries = await Entry.findByIds(db, Object.keys(user.words.learned));

    content.push(`<h1>${user.name}</h1>`);

    content.push(`<p>user ${user.name} has learned ${entries.length} words</p>`);
    content.push('<table>');
    content.push('<thead>');
    content.push('<tr>');
    content.push('<th>writing</th> <th>level</th> <th>reading</th> <th>meaning</th>');
    content.push('</tr>');
    content.push('</thead>');

    content.push('<tbody>');

    let word_table_rows = [];

    entries.forEach((entry) => {
      let learned = user.words.learned[entry._id];
      let level = learned.level;
      let writing = entry['writings'] ? entry['writings'][0]['kanji'] : '';
      let reading = entry['readings'] ? entry['readings'][0]['kana'] : '';
      let meaning = entry['senses'][0]['translations'][0]['glossaries'].join(', ');

      word_table_rows.push({
        writing: writing,
        reading: reading,
        meaning: meaning,
        level: level
      });

    });

    word_table_rows.sort((row1, row2) => {
      if (row1.level > row2.level) {
        return -1;
      }

      if (row1.level < row2.level) {
        return 1;
      }

      return 0;
    });

    word_table_rows.forEach((row) => {
      content.push(`<tr><td>${row.writing}</td> <td>${row.level}</td> <td>${row.reading}</td> <td>${row.meaning}</td></tr>`);
    });
  } catch (err) {
    content.push(`<p>got an error: ${err}</p>`);
  }

  content.push('</tbody>');
  content.push('</table>');

  response.set('Content-Type', 'text/html');

  let page_html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${username}</title>

    <style>
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 4px 10px;
      }
    </style>
  </head>

  <body>
    ${content.join('')}
  </body>
</html>
`;

  response.send(page_html);
});


// Session stuff
let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

let generateSessionToken = function() {
  let result = '';

  for (let i = 8; i > 0; i--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

let sessionStore = {};

// authentication
let authenticate = function(username, token, response) {
  if (sessionStore[username] && sessionStore[username] === token) {
    return true;
  }

  console.log(`unauthorized access by user ${username}!`);

  response.status(401).send('Unauthorized Access');
  return false;
}


// *****************************************************************************
// * Kyoushi Endpoints
// *****************************************************************************
// create a user
app.post('/users', async (request, response) => {
  let username = request.body.username;
  let password = request.body.password;

  console.log(`creating user ${username}`);

  let hashPassword = (password) => {
    return new Promise((result, reject) => {
      if (!User.validatePassword(password)) {
        reject('Password is not valid!');
      }

      bcrypt.hash(password, SALT_ROUNDS, async (err, hashedPassword) => {
        if (err) {
          reject(`bcrypt error: ${err}`);
        }

        result(hashedPassword);
      });
    })
  }

  hashPassword(password).then(async (hashedPassword) => {
    let user = await User.create(db, {
      name: username,
      password: hashedPassword
    });

    // I used this to reset my password
    // let user = await User.findByName(db, username);
    //
    // await db.collection('users').updateOne(
    //   { name: username },
    //   {
    //     $set: {
    //       password: hashedPassword
    //     }
    //   }
    // );

    let sessionToken = generateSessionToken();
    sessionStore[user.name] = sessionToken;

    response.json({ sessionToken: sessionToken });
  }).catch((err) => {
    console.log(err);
    response.json({ error: err });
  }).finally(() => {
    console.log('\n');
  });
});


app.post('/log_in', async (request, response) => {
  let username = request.body.username;
  let password = request.body.password;

  console.log(`logging in ${username}`);

  let checkPassword = (username, password) => {
    return new Promise(async (result, reject) => {
      // ideally we could do this check before we get the user
      if (password.length === 0) {
        reject('no password entered');
        return;
      }

      try {
        let user = await User.findByName(db, username);

        bcrypt.compare(password, user.password, async (err, isValid) => {
          if (err) {
            reject(`bcrypt error: ${err}`);
            return;
          }

          result(isValid);
        });
      } catch (err) {
        reject(err);
        return;
      }
    })
  }

  checkPassword(username, password).then(async (isValid) => {
    if (!isValid) {
      throw 'invalid password supplied';
    }

    let sessionToken = generateSessionToken();
    sessionStore[username] = sessionToken;

    response.json({ sessionToken: sessionToken });
  }).catch((err) => {
    console.log(err);
    response.json({ error: err });
  }).finally(() => {
    console.log('\n');
  });
});


app.post('/log_out', async (request, response) => {
  let username = request.body.username;
  let token = request.header('X-Auth-Token');

  console.log(`logging out ${username}`);

  if (authenticate(username, token, response)) {
    try {
      // make a new token so no one can match it
      sessionStore[username] = generateSessionToken();

      response.json({ result: 'success' });
    } catch (err) {
      console.log(err);
      response.json({ error: err });
    }
  }

  console.log('\n');
});


// get a user
app.get('/users/:name', async (request, response) => {
  let username = request.params.name;
  let token = request.header('X-Auth-Token');

  console.log(`fetching user with name ${username}`);

  if (authenticate(username, token, response)) {
    try {
      let user = await User.findByName(db, username);

      response.json({ user: user.formatForClient() });
    } catch (err) {
      console.log(err);
      response.json({ error: err });
    }
  }

  console.log('\n');
});


// reset a user
// TODO: remove
app.post('/users/:name/reset', async (request, response) => {
  let username = request.params.name;
  let token = request.header('X-Auth-Token');

  console.log(`resetting user ${username}`);

  if (authenticate(username, token, response)) {
    try {
      let user = await User.findByName(db, username);

      await User.reset(db, username);
      response.json({ result: 'success' });
    } catch (err) {
      console.log(err);
      response.json({ error: err });
    }
  }

  console.log('\n');
});


// learn a kanji
app.post('/users/:name/kanji', async (request, response) => {
  let username = request.params.name;
  let token = request.header('X-Auth-Token');
  let learnedKanji = request.body.kanji;

  console.log(`user ${username} learning kanji ${learnedKanji}`);

  if (authenticate(username, token, response)) {
    try {
      let user = await User.findByName(db, username);
      await user.learnKanji(db, learnedKanji);

      response.json({ result: 'success' });
    } catch (err) {
      console.log(err);
      response.json({ error: err });
    }
  }

  console.log('\n');
});


// get a user's fresh words
app.get('/users/:name/words/fresh', async (request, response) => {
  let username = request.params.name;
  let token = request.header('X-Auth-Token');

  console.log(`getting fresh words for user ${username}`);

  if (authenticate(username, token, response)) {
    try {
      let user = await User.findByName(db, username);
      let entries = await Entry.findByIds(db, user.words.fresh);

      response.json({ entries: entries });
    } catch (err) {
      console.log(err);
      response.json({ error: err });
    }
  }

  console.log('\n');
});


// learn a fresh word
app.post('/users/:name/words/learn/:wordId', async (request, response) => {
  let username = request.params.name;
  let token = request.header('X-Auth-Token');
  let learnedWordId = request.params.wordId;

  console.log(`user ${username} is learning word ${learnedWordId}`);

  if (authenticate(username, token, response)) {
    try {
      let user = await User.findByName(db, username);
      user.learnWord(db, learnedWordId);

      response.json({ result: 'success' });
    } catch (err) {
      console.log(err);
      response.json({ error: err });
    }
  }

  console.log('\n');
});


// ignore a fresh word
app.post('/users/:name/words/ignore/:wordId', async (request, response) => {
  let username = request.params.name;
  let token = request.header('X-Auth-Token');
  let ignoredWordId = request.params.wordId;

  console.log(`user ${username} is ignoring word ${ignoredWordId}`);

  if (authenticate(username, token, response)) {
    try {
      let user = await User.findByName(db, username);
      user.ignoreWord(db, ignoredWordId);

      response.json({ result: 'success' });
    } catch (err) {
      console.log(err);
      response.json({ error: err });
    }
  }

  console.log('\n');
});


// get a user's review words
app.get('/users/:name/words/review', async (request, response) => {
  let username = request.params.name;
  let token = request.header('X-Auth-Token');

  console.log(`getting words to review for ${username}`);

  if (authenticate(username, token, response)) {
    try {
      let user = await User.findByName(db, username);
      let entries = await Entry.findByIds(db, user.getReviewWords(), { maintainOrder: true });

      response.json({ entries: entries });
    } catch (err) {
      console.log(err);
      response.json({ error: err });
    }
  }

  console.log('\n');
});


// review a learned word
app.post('/users/:name/words/review/:wordId/:status', async (request, response) => {
  let reviewSuccess = request.params.status === 'pass';

  let username = request.params.name;
  let token = request.header('X-Auth-Token');
  let reviewedWordId = request.params.wordId;

  let status = reviewSuccess ? 'successfully' : 'unsuccessfully';
  console.log(`user ${username} reviewed word ${reviewedWordId} ${status}`);

  try {
    let user = await User.findByName(db, username);
    await user.reviewWord(
      db,
      reviewedWordId,
      reviewSuccess
    );

    response.json({ result: 'success' });
  } catch (err) {
    console.log(err);
    response.json({ error: err });
  }

  console.log('\n');
});



// *****************************************************************************
// * Sagasu Endpoints
// *****************************************************************************
app.get('/entries', async (request, response) => {
  console.log(`Fetching entries for query: ${JSON.stringify(request.query)}`);

  try {
    let sagasuResponse = await Entry.findForSagasu(db, request.query);
    response.json(sagasuResponse);
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
