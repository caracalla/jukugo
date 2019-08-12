# Jukugo Server Setup

This guide assumes you're using a Debian machine with at least 1 GB of RAM.

## Setting up the environment
1. Install nvm - https://github.com/creationix/nvm#git-install
1. Install node LTS:
    ```sh
    nvm install --lts
    ```
    * **NOTE:** `yarn install` won't work with Node 10 for some reason, so I've been using Node 8 LTS.
1. Install Yarn - https://yarnpkg.com/en/docs/install#debian-stable
    * This may be necessary https://askubuntu.com/questions/104160/
1. Install MongoDB - https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/
1. `service mongod start`

## Setting up the database
1. Within this `server` directory, `yarn install`
1. `cd db`
1. Download JMdict_e.gz from the [Monash Nihongo ftp Archive][monash-ftp]
    ```sh
    curl -O http://ftp.monash.edu.au/pub/nihongo/JMdict_e.gz
    gunzip JMdict_e.gz
    ```
1. `sed -f sanitize_jmdict.sed JMdict_e > JMdict_san`
1. Populate the database:
    * If your machine is pretty beefy, just run `node populate_db.js JMdict_san`
    * If your machine is resource constrained, run `perl chunked_populate_db.pl`.  This will process one tenth of JMdict_san at a time.
        * If that's still too much to handle, just change the `entries_per_file` variable in `chunked_populate_db.pl` to something smaller.

## Running the server
1. `yarn start`


## TODO
* user authentication
    * session tokens? sent through headers?
* implement real logging
* indexes on the db
