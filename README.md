# 熟語 - jukugo

A tool for learning Japanese.  Select words made up of kanji of various kyōiku grade levels, hiragana, katakana, and romaji.  For instance, if you are learning grades 1 and 2 of the kyōiku kanji, you can select words made up only of the kanji from those grades (as well as kana).

## Setup

1. Download and unzip JMdict_e.gz from the [Monash Nihongo ftp Archive][monash-ftp]
2. Run `./sanitize_jmdict.sh` (should take around 10 minutes (there's definitely a better way to do this))
3. With MongoDB running, run `node populate_database.js` (requires at least 1 GB of RAM)
4. Run `yarn start` in the top level directory to start the server
5. Run `yarn start` in the client directory to start the client

## TODO
* Implement form to select grade and other parameters

[monash-ftp]: http://ftp.monash.edu.au/pub/nihongo/JMdict_e.gz
