import React, { Component } from 'react';

var Writing = function (props) {
  var classNames = props.writing.priority ? "kanji btn-lg btn btn-danger" : "kanji btn btn-lg btn-secondary";

  return (
    <span
      className={classNames}
      data-toggle="modal"
      data-target="#kanji-stroke-order-modal"
      data-kanji={props.writing.kanji}
      key={props.writing.kanji}
      // FIXME: this is shitty
      onClick={function (event) { document.getElementById('kanji-stroke-order').innerHTML = event.target.dataset.kanji }}
    >{props.writing.kanji}</span>
  );
};

var Reading = function (props) {
  var classNames = props.reading.priority ? "kana btn-lg btn btn-danger" : "kana btn btn-lg btn-secondary";

  return <span className={classNames} key={props.reading.kana}>{props.reading.kana}</span>;
};

var Sense = function (props) {
  var PartOfSpeech = function (props) {
    return <p className="part-of-speech small">{props.partOfSpeech}</p>;
  };

  var Translation = function (props) {
    const subFields = [
      "info",
      "misc",
      "fields",
      "similar",
      "antonyms",
      "loanwords",
      "dialects",
      "associatedReadings",
      "associatedWritings"
    ];

    var SubField = function(props) {
      return !props.data ? null : (
        <div>
          <p className="badge badge-danger">{props.name}: {props.data.join(', ')}</p>
        </div>
      );
    };

    var Glossary = function (props) {
      return (
        <li className="list-group-item glossary">
          {props.glossary}

          {/* {subFields.map(function (fieldName) {
            return <SubField data={props.translation[fieldName]} name={fieldName} key={fieldName} />
          })} */}
        </li>
      );
    };

    return (
      <ul className="list-group list-group-flush">
        {props.translation.glossaries.map(function (glossary) {
          return <Glossary glossary={glossary} key={glossary} />;
        })}
      </ul>
    );
  };

  return (
    <li className="list-group-item">
      <div className="col-4 pos-column">
        {props.sense.partsOfSpeech.map(function (partOfSpeech) {
          return <PartOfSpeech partOfSpeech={partOfSpeech} />;
        })}
      </div>

      <div className="col-8">
        <div className="card">
          {props.sense.translations.map(function (translation) {
            return <Translation translation={translation} />;
          })}
        </div>
      </div>
    </li>
  );
};

class Entry extends Component {
  render() {
    return (
      <div className="card" id={this.props.entry._id}>
        <div className="card-header">
            {this.props.entry.writings.map(function (writing) {
              return <Writing writing={writing} key={writing.kanji} />;
            })}
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            {this.props.entry.readings.map(function (reading) {
              return <Reading reading={reading} key={reading.kana} />;
            })}
          </li>

          {this.props.entry.senses.map(function (sense) {
            return <Sense sense={sense} />
          })}
        </ul>
      </div>
    );
  };
};

export default Entry;
