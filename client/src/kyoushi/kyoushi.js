import React from 'react';

import * as Utils from '../utils.js';

import FreshWords from './fresh_words.js';

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

    this.learnKanjiUrl = `${props.baseUrl}/users/${this.state.username}/kanji`;
    this.freshWordsUrl = `${props.baseUrl}/users/${this.state.username}/words/fresh`;
    this.reviewWordsUrl = `${props.baseUrl}/users/${this.state.username}/words/review`;

    this.learnWordUrl = `${props.baseUrl}/users/${this.state.username}/words/learn`;
    this.ignoreWordUrl = `${props.baseUrl}/users/${this.state.username}/words/ignore`;

    this.submitReviewUrl = `${props.baseUrl}/users/${this.state.username}/words/review`;

    this.selectKanji = this.selectKanji.bind(this);
    this.setStateFromChild = this.setStateFromChild.bind(this);
  }

  componentDidMount() {
    // only runs on initialization
    if (this.state.freshWordsCount > 0) {
      this.getFreshWords();
    } else if (this.state.reviewWordsCount > 0) {
      this.getReviewWords();
    }
  }

  setStateFromChild(newState) {
    // could I just pass this.setState here?
    // thinking about it that way, this seems gross
    this.setState(newState);
  }

  selectKanji(event) {
    event.preventDefault();

    let newKanji = event.target.innerHTML;

    // Sending the kanji in a JSON body because it's not really URL safe
    jQuery.post(this.learnKanjiUrl, {kanji: newKanji}, (response) => {
      if (response.result === "success") {
        let kanjiToLearn = this.state.kanjiToLearn.filter((kanji) => {
          return kanji !== newKanji;
        });

        this.setState({kanjiToLearn: kanjiToLearn}, () => {
          this.getFreshWords();
        });
      }
    });
  }

  getFreshWords() {
    jQuery.get(this.freshWordsUrl, (response) => {
      this.setState({
        freshWords: response.entries,
        freshWordsCount: response.entries.length
      });
    });
  }

  getReviewWords() {
    jQuery.get(this.reviewWordsUrl, (response) => {
      this.setState({
        reviewWords: response.entries,
        reviewWordsCount: response.entries.length
      });
    });
  }

  render() {
    if (this.state.freshWords.length > 0) {
      return (
        <FreshWords
            freshWords={this.state.freshWords}
            learnWordUrl={this.learnWordUrl}
            ignoreWordUrl={this.ignoreWordUrl}
            setParentState={this.setStateFromChild} />
      );
    } else if (this.state.reviewWords.length > 0) {
      return (
        <ReviewWords
            reviewWords={this.state.reviewWords}
            submitReviewUrl={this.submitReviewUrl}
            setParentState={this.setStateFromChild} />
      );
    } else {
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
  }
}

export default Kyoushi;
