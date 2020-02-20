# Jukugo Client Setup

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
1. Point the client at your Jukugo server by changing `baseUrl` in `src/index.js`

## Running the client

```sh
open index.html
yarn watch
```

## TODO
* get cookies working for login and sign up
    * set up local dev server so cookies actually work
    * make cookies last longer
* user authentication
    * actually set a password, and check it when logging in
    * automatically downcase username
        * limit username characters to ascii?
* prevent flicker when loading Kyoushi with words to learn/review
* Kyoushi should always do the following:
    1. if there are new words, display new words to learn
    2. else if there are review words, display words to review
    3. else show kanji picker
* build real error handling
    * show login failure
    * use bootstrap toasts?
* more robust routing
* use `fetch`, remove jQuery entirely
* allow "forgetting" of learned words
    * set them to ignored?
