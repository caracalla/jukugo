import React from 'react';

import * as Utils from '../utils.js';

import FreshWords from './fresh_words.js';
import ReviewWords from './review_words.js';

class Kyoushi extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.username,
      kanjiToLearn: props.kanjiToLearn,
      freshWordsCount: props.freshWordsCount,
      reviewWordsCount: props.reviewWordsCount,
      freshWords: [],
      reviewWords: []
    }

    // get routes
    this.getFreshWordsUrl = `${props.baseUrl}/users/${this.state.username}/words/fresh`;
    this.getReviewWordsUrl = `${props.baseUrl}/users/${this.state.username}/words/review`;

    // post routes
    this.learnKanjiUrl = `${props.baseUrl}/users/${this.state.username}/kanji`;
    this.learnWordUrl = `${props.baseUrl}/users/${this.state.username}/words/learn`;
    this.ignoreWordUrl = `${props.baseUrl}/users/${this.state.username}/words/ignore`;
    this.submitReviewUrl = `${props.baseUrl}/users/${this.state.username}/words/review`;

    this.selectKanji = this.selectKanji.bind(this);
    this.setFreshWordsEmpty = this.setFreshWordsEmpty.bind(this);
    this.setReviewWordsEmpty = this.setReviewWordsEmpty.bind(this);

    this.notifyError = props.notifyError;
  }

  componentDidMount() {
    // only runs on initialization
    if (this.state.freshWordsCount > 0) {
      this.getFreshWords();
    } else if (this.state.reviewWordsCount > 0) {
      this.getReviewWords();
    }
  }

  setFreshWordsEmpty() {
    this.setState({
      freshWords: [],
      freshWordsCount: 0
    });
  }

  setReviewWordsEmpty() {
    this.setState({
      reviewWords: [],
      reviewWordsCount: 0
    });
  }

  selectKanji(event) {
    event.preventDefault();

    let newKanji = event.target.innerHTML;

    Utils.post(this.learnKanjiUrl, { kanji: newKanji }, {
      success: (response) => {
        let kanjiToLearn = this.state.kanjiToLearn.filter((kanji) => {
          return kanji !== newKanji;
        });

        if (kanjiToLearn.length === 0) {
          // TODO: actual do something when someone learns an entire grade
          // this is a horrible hack to make sure the page shows the next grade
          // of kanji
          location.reload();
        }

        this.setState({kanjiToLearn: kanjiToLearn}, () => {
          this.getFreshWords();
        });
      },
      failure: (errorMessage) => {
        this.notifyError(errorMessage, 'selecting a kanji');
      }
    });
  }

  getFreshWords() {
    Utils.get(this.getFreshWordsUrl, {
      success: (response) => {
        this.setState({
          freshWords: response.entries,
          freshWordsCount: response.entries.length
        });
      },
      failure: (errorMessage) => {
        this.notifyError(errorMessage, 'getting fresh words');
      }
    });
  }

  getReviewWords() {
    Utils.get(this.getReviewWordsUrl, {
      success: (response) => {
        this.setState({
          reviewWords: response.entries,
          reviewWordsCount: response.entries.length
        });
      },
      failure: (errorMessage) => {
        this.notifyError(errorMessage, 'getting review words');
      }
    });
  }

  kanjiPicker() {
    let kanjiButtons = this.state.kanjiToLearn.map((kanji) => {
      return (
        <button className="btn btn-danger btn-lg m-2" onClick={this.selectKanji} key={kanji}>
          {kanji}
        </button>
      );
    });

    return (
      <div>
        <h1>Select New Kanji</h1>

        <div className="row mt-2">
          {kanjiButtons}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.freshWords.length > 0) {
      return (
        <FreshWords
            freshWords={this.state.freshWords}
            learnWordUrl={this.learnWordUrl}
            ignoreWordUrl={this.ignoreWordUrl}
            setFreshWordsEmpty={this.setFreshWordsEmpty}
            notifyError={this.notifyError} />
      );
    } else if (this.state.reviewWords.length > 0) {
      return (
        <ReviewWords
            reviewWords={this.state.reviewWords}
            submitReviewUrl={this.submitReviewUrl}
            setReviewWordsEmpty={this.setReviewWordsEmpty}
            notifyError={this.notifyError} />
      );
    } else {
      return this.kanjiPicker();
    }
  }
}

export default Kyoushi;
