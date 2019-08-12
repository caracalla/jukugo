# 熟語 - jukugo

A tool for learning Japanese.  Select words made up of kanji of various kyōiku grade levels, hiragana, katakana, and romaji.  For instance, if you are learning grades 1 and 2 of the kyōiku kanji, you can select words made up only of the kanji from those grades (as well as kana).

## Structure
* server - Express and Mongo backend
* client - React frontend

## TODO

* On the server:
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

* Longer term:
    * Futures and crap
    * Rewrite the frontend (again)
