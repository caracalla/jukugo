import React from 'react';

class WordModal extends React.Component {
  constructor(props) {
    super(props);

    this.word = props.word;
    this.wordString = props.wordString;

    this.extractTranslations = props.extractTranslations;
  }

  static wiktionaryLink(item) {
    return `https://en.wiktionary.org/wiki/${item}#Japanese`;
  }

  render() {
    let modalId = `modal-${this.word._id}`
    let kanjiCounter = 0;

    let headerKanji = this.wordString.split('').map((character) => {
      kanjiCounter += 1;  // I hate this key shit

      return (
        <a
            className="border border-primary rounded mx-1 p-1"
            target="_blank"
            href={WordModal.wiktionaryLink(character)}
            key={`${character}${kanjiCounter}`}>
          {character}
        </a>
      );
    });

    let writings = this.word.writings.map((writing) => {
      return (
        <span className="btn btn-lg btn-danger mx-1 mb-2" key={writing.kanji}>
          {writing.kanji}
        </span>
      );
    });

    let readings = this.word.readings.map((reading) => {
      return (
        <span className="btn btn-lg btn-outline-danger mx-1 mb-2" key={reading.kana}>
          {reading.kana}
        </span>
      );
    });

    let translations = this.extractTranslations(this.word).map((translation) => {
      return (
        <p className="mx-1 lead" key={ translation }>
          { translation }
        </p>
      );
    });

    return (
      <div className="modal" tabIndex="-1" role="dialog" id={modalId} key={modalId}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h1 className="display-3 text-center mb-3">{headerKanji}</h1>

              <p className="text-center">
                <a
                    className="btn btn-outline-primary btn-block"
                    target="_blank"
                    href={WordModal.wiktionaryLink(this.wordString)}>
                  Wiktionary page for {this.wordString}
                </a>
              </p>

              <hr />

              <h5>Writings</h5>
              {writings}
              <hr />

              <h5>Readings</h5>
              {readings}
              <hr />

              <h5>Translations</h5>
              {translations}

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger btn-block" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WordModal;
