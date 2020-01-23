import React from 'react';

import WordModal from './word_modal.js';

const translationsToShow = 3;

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

  // TODO: this is dumb, let's just handle this in populate_db
  extractTranslations(word) {
    let translations = [];

    word.senses.forEach((sense) => {
      sense.translations.forEach((translation) => {
        translation.glossaries.forEach((glossary) => {
          translations.push(glossary);
        })
      })
    })

    return translations;
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

    let readingBadges = this.word.readings.map((reading) => {
      return (
        <span
            className="badge badge-danger font-weight-normal mr-1"
            key={ reading.kana }>
          { reading.kana }
        </span>
      );
    });

    // grab the first 'translationsToShow' elements
    let translations = this.extractTranslations(this.word).
        slice(0, translationsToShow);

    // why is this showing the top and bottom border?  bug in bootstrap?
    let translationElements = translations.map((translation) => {
      return (
        <li className="list-group-item" key={ translation }>
          { translation }
        </li>
      );
    });

    return (
      <div className="col-lg-4 col-md-6 col-sm-12 mt-2 mb-3" key={ this.word._id }>
        <div className="card">
          <div className="card-header">
            <h1 className="card-title text-center display-4">
              { this.word.writings[0].kanji }

              {/* Trying to figure out a way to move learned words to ignore
              <div className="dropleft inline-block">
                <button className="close" data-toggle="dropdown">&laquo;</button>

                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">something</a>
                  <a className="dropdown-item" href="#">something2</a>
                </div>
              </div>
              */}
            </h1>
          </div>

          <div className="card-body">
            { this.review ? revealButton : '' }

            <div id={bodyId} hidden={ this.review ? 'hidden' : '' }>
              <h3 className="card-text">
                { readingBadges }
              </h3>

              <ul className="list-group list-group-flush my-4">
                { translationElements }
              </ul>

              <WordModal
                  word={ this.word }
                  extractTranslations={ this.extractTranslations } />

              <p className="card-text">
                <button
                    className="btn btn-outline-danger btn-block btn-sm"
                    data-toggle="modal"
                    data-target={`#modal-${this.word._id}`}>
                  See more
                </button>
              </p>

              { bottomButtons }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WordCard;
