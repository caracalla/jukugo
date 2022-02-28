import React from 'react';

import * as Utils from '../utils.js';

import WordCard from './word_card.js';

class ReviewWords extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewWords: props.reviewWords
    };

    this.submitReviewUrl = props.submitReviewUrl;
    this.setReviewWordsEmpty = props.setReviewWordsEmpty;
    this.notifyError = props.notifyError;

    this.submitReview = this.submitReview.bind(this);
  }

  submitReview(event) {
    event.preventDefault();

    let wordId = event.target.id;
    let wordStatus = event.target.dataset["status"];
    let submitReviewUrl = `${this.submitReviewUrl}/${wordId}/${wordStatus}`;

    Utils.authedPost(submitReviewUrl, {}, {
      success: (response) => {
        let newReviewWords = this.state.reviewWords.filter((reviewWord) => {
          return reviewWord._id !== wordId;
        });

        if (newReviewWords.length > 0) {
          this.setState({
            reviewWords: newReviewWords,
            reviewWordsCount: newReviewWords.length
          });
        } else {
          this.setReviewWordsEmpty();
        }
      },
      failure: (errorMessage) => {
        this.notifyError('reviewing a word', errorMessage);
      }
    });
  }

  render() {
    let reviewWordCards = this.state.reviewWords.map((reviewWord) => {
      return <WordCard
                word={reviewWord}
                submitReview={this.submitReview}
                key={reviewWord._id}
                review={true} />;
    });

    return (
      <div>
        <h1>Review ({this.state.reviewWords.length} words)</h1>

        <div className="row mt-2">
          {reviewWordCards}
        </div>
      </div>
    );
  }
}

export default ReviewWords;
