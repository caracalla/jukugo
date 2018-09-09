# 熟語 - jukugo (this name is not the word I thought it was, so it will be changing)

A tool for learning Japanese.  Select words made up of kanji of various kyōiku grade levels, hiragana, katakana, and romaji.  For instance, if you are learning grades 1 and 2 of the kyōiku kanji, you can select words made up only of the kanji from those grades (as well as kana).

## Setup

This guide assumes you're using a Debian machine with at least 1 GB of RAM.

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
1. `cd jukugo/db`
1. Download JMdict_e.gz from the [Monash Nihongo ftp Archive][monash-ftp]
    ```sh
    curl -O http://ftp.monash.edu.au/pub/nihongo/JMdict_e.gz
    gunzip JMdict_e.gz
    ```
1. Run `./sanitize_jmdict.sh`
    * This currently takes up to an hour.  There's definitely a better way to do this.
1. `node populate_database.js`
1. Run `yarn start` in the root directory of this repository to start the server
1. Change `basURL` of the server in `client/src/index.js` to the address of the server
1. Run `yarn start` in the `client` directory to start the client

## TODO
* Spin up api server and live public client

* On the server:
    * Replace `sanitize_jmdict` with a real sed or awk script and improve performance
    * Handle valid query strings and pagination
    * Figure out a better way to sort the data such that the most commonly used and/or relevant terms are delivered first
        * Sort by frequency, or by "priority"?
        * Sort by grade level?
        * Take flags such as "obsolete term" and "word containing out-dated kanji" into account?
        * A word being in a grade should mean it only has kanji from that grade

* On the client:
    * Use custom CSS for readings and writings instead of jury-rigging Bootstrap classes
        * I've got a better solution in place now but I'd still like to use a mostly-custom solution instead of relying so heavily on Bootstrap.

[monash-ftp]: http://ftp.monash.edu.au/pub/nihongo/JMdict_e.gz
