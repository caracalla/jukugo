import React from 'react';

import { contexts } from './contexts.js';

class Splash extends React.Component {
  constructor(props) {
    super(props);

    console.log(props.username);

    this.username = props.username;
    this.notifyContextChange = props.notifyContextChange;
  }

  actionButton() {
    return (
      <div className="row justify-content-center">
        <div className="col-6 col-sm-4">
          <button
              className="btn btn-lg btn-danger btn-block"
              onClick={(event) => {
                let context = this.username ? contexts.KYOUSHI : contexts.SIGN_UP;

                this.notifyContextChange(context);
              }}>
            { this.username ? 'Get Started' : 'Sign Up' }
          </button>
        </div>
      </div>
    );
  }

  render() {
    let welcomeText = this.username ?
        `Welcome back, ${this.username}` : 'Welcome to Jukugo!';

    return (
      <div>
        <h1 className="display-4 text-center">{ welcomeText }</h1>

        <p>
          Jukugo is a collection of tools to assist with learning Japanese words.  As of yet, it does not offer a method of learning kanji; sites like WaniKani have that pretty well covered.  Instead, Jukugo is meant to build on one's study of kanji by providing a way to find the words that can be built with any given kanji.
        </p>

        <hr />

        <p>Currently, Jukugo consists of the following tools:</p>

        <ul>
          <li>
            <strong>Sagasu</strong>:
            A fairly simple search tool.  Words can be searched by kanji, kana reading, meaning in English, maximum Kyouiku kanji grade level, or any combination of those attributes.  Intended mainly for reference.
          </li>

          <li>
            <strong>Kyoushi</strong>:
            A guided learning tool.  As kanji are learned, words based on those kanji can be added to a spaced repetition review queue.  Intended as a long term learning tool.
          </li>
        </ul>

        { this.actionButton() }
      </div>
    );
  }
}

export default Splash;
