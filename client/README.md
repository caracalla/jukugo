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
* user authentication
* prevent flicker when loading Kyoushi with words to learn/review
* build real error handling
* routing
