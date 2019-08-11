import React from 'react';

import * as Utils from '../utils.js';

import WordCard from './word_card.js';

class FreshWords extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      freshWords: props.freshWords
    };

    this.learnWordUrl = props.learnWordUrl;
    this.ignoreWordUrl = props.ignoreWordUrl;
    this.setFreshWordsEmpty = props.setFreshWordsEmpty;
    this.notifyError = props.notifyError;

    this.learnWord = this.learnWord.bind(this);
    this.ignoreWord = this.ignoreWord.bind(this);
  }

  learnWord(event) {
    event.preventDefault();

    let learnedWordId = event.target.id;
    let learnWordUrl = `${this.learnWordUrl}/${learnedWordId}`

    Utils.post(learnWordUrl, {}, {
      success: (response) => {
        let newFreshWords = this.state.freshWords.filter((freshWord) => {
          return freshWord._id !== learnedWordId;
        });

        this.updateFreshWords(newFreshWords);
      },
      failure: (errorMessage) => {
        this.notifyError(errorMessage, 'learning a word');
      }
    });
  }

  ignoreWord(event) {
    event.preventDefault();

    let ignoredWordId = event.target.id;
    let ignoreWordUrl = `${this.ignoreWordUrl}/${ignoredWordId}`

    Utils.post(ignoreWordUrl, {}, {
      success: (response) => {
        let newFreshWords = this.state.freshWords.filter((freshWord) => {
          return freshWord._id !== ignoredWordId;
        });

        this.updateFreshWords(newFreshWords);
      },
      failure: (errorMessage) => {
        this.notifyError(errorMessage, 'ignoring a word');
      }
    });
  }

  updateFreshWords(newFreshWords) {
    if (newFreshWords.length > 0) {
      this.setState({
        freshWords: newFreshWords,
      });
    } else {
      this.setFreshWordsEmpty();
    }
  }

  render() {
    let freshWordCards = this.state.freshWords.map((freshWord) => {
      return <WordCard
          word={freshWord}
          learnWord={this.learnWord}
          ignoreWord={this.ignoreWord}
          key={freshWord._id} />;
    });

    return (
      <div>
        <h1>Fresh Words</h1>

        <div className="row mt-2">
          {freshWordCards}
        </div>
      </div>
    );
  }
}

export default FreshWords;
