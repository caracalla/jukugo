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

## Running the client

```sh
npx babel-cli --watch src --out-dir . --presets react-app/prod
open index.html
```
