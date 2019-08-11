import React from 'react';

import WordModal from './word_modal.js';

class WordCard extends React.Component {
  constructor(props) {
    super(props);

    this.word = props.word
    this.review = props.review;

    // functions
    this.learnWord = props.learnWord;
    this.ignoreWord = props.ignoreWord;
    this.submitReview = props.submitReview;
  }

  bottomButtons() {
    if (this.review) {
      // Buttons for words under review
      return (
        <div className="row">
          <div className="col-6">
            <button
                id={this.word._id}
                className="btn btn-danger btn-block"
                onClick={this.submitReview}
                data-status="pass">
              Got It
            </button>
          </div>

          <div className="col-6">
            <button
                id={this.word._id}
                className="btn btn-danger btn-block"
                onClick={this.submitReview}
                data-status="fail">
              Don't Got It
            </button>
          </div>
        </div>
      );
    } else {
      // Buttons for fresh words
      return (
        <div className="row">
          <div className="col-6">
            <button
                id={this.word._id}
                className="btn btn-danger btn-block"
                onClick={this.learnWord}>
              Learn
            </button>
          </div>

          <div className="col-6">
            <button
                id={this.word._id}
                className="btn btn-outline-danger btn-block float-right"
                onClick={this.ignoreWord}>
              Ignore
            </button>
          </div>
        </div>
      );
    }
  }

  render() {
    let bottomButtons = this.bottomButtons();

    let bodyId = `body-${this.word._id}`;

    let revealButton = (
      <button
          className="btn btn-danger btn-block"
          onClick={(event) => {
            event.preventDefault();
            let element = document.querySelector(`#${bodyId}`);
            event.target.hidden = true;
            element.hidden = false;
          }}>
        Reveal
      </button>
    );

    return (
      <div className="col-lg-4 col-md-6 col-sm-12 mt-2 mb-3" key={this.word._id}>
        <div className="card">
          <div className="card-header">
            <h1 className="card-title text-center display-4">
              {this.word.writings[0].kanji}
            </h1>
          </div>

          <div className="card-body">
            {this.review ? revealButton : ''}

            <div id={bodyId} hidden={this.review ? 'hidden' : ''}>
              <h3 className="card-text">
                <span className="badge badge-danger font-weight-normal">{this.word.readings[0].kana}</span>
              </h3>

              <p className="card-text">
                {this.word.senses[0].translations[0].glossaries[0]}
              </p>

              <WordModal word={this.word} />

              <p className="card-text">
                <button
                    className="btn btn-outline-danger btn-block btn-sm"
                    data-toggle="modal"
                    data-target={`#modal-${this.word._id}`}>
                  See more
                </button>
              </p>

              {bottomButtons}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WordCard;
