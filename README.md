# 熟語 - jukugo

A tool for learning Japanese.  Select words made up of kanji of various kyōiku grade levels, hiragana, katakana, and romaji.  For instance, if you are learning grades 1 and 2 of the kyōiku kanji, you can select words made up only of the kanji from those grades (as well as kana).

## Setup

1. Download and unzip JMdict_e.gz from the [Monash Nihongo ftp Archive][monash-ftp]
2. Run `./sanitize_jmdict.sh` (should take around 10 minutes (there's definitely a better way to do this))
3. With MongoDB running, run `node populate_database.js` (requires at least 1 GB of RAM)
4. Run `yarn start` in the top level directory to start the server
5. Run `yarn start` in the client directory to start the client

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
  * Integrate stroke order font (tooltips? modals?)

[monash-ftp]: http://ftp.monash.edu.au/pub/nihongo/JMdict_e.gz
