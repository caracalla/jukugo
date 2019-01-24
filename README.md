# 熟語 - jukugo

A tool for learning Japanese.  Select words made up of kanji of various kyōiku grade levels, hiragana, katakana, and romaji.  For instance, if you are learning grades 1 and 2 of the kyōiku kanji, you can select words made up only of the kanji from those grades (as well as kana).

## Setup

This guide assumes you're using a Debian machine with at least 1 GB of RAM.

### Setting up the environment
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

### Setting up the server
1. `cd jukugo/db`
1. Download JMdict_e.gz from the [Monash Nihongo ftp Archive][monash-ftp]
    ```sh
    curl -O http://ftp.monash.edu.au/pub/nihongo/JMdict_e.gz
    gunzip JMdict_e.gz
    ```
1. Run `./sanitize_jmdict.sh`
    * This currently takes up to an hour.  There's definitely a better way to do this.
1. Run `yarn install` in the root directory of this repository
1. `node populate_database.js`
1. `yarn start`

### Setting up the client
1. Run `yarn install` in the `client` directory
1. Change `basURL` of the server in `client/src/index.js` to the address of the server
1. `yarn start`

## TODO
* Spin up api server and live public client

* On the server:
    * Replace `sanitize_jmdict` with a real sed or awk script and improve performance
    * Handle pagination
    * Figure out a better way to sort the data such that the most commonly used and/or relevant terms are delivered first
        * Take flags such as "obsolete term" and "word containing out-dated kanji" into account?

* On the client:
    * Add "kanji only" checkbox
    * Add ability to find words with X number of kanji, with two options:
        * Minimum X number of kanji
        * ONLY find words with X number of kanji
    * Reduce page clutter
        * Collapsible entries?
    * Server communication error indicator

[monash-ftp]: http://ftp.monash.edu.au/pub/nihongo/JMdict_e.gz
