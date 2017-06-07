import React, { Component } from 'react';

var Writing = function (props) {
  var pClass = props.writing.priority ? "nav-link active bg-danger" : "nav-link text-danger";

  return (
    <div>
      <h1 className="display-4 hidden-sm-down">
        <p className={pClass}>{props.writing.kanji}</p>
      </h1>
      <h1 className="display-6 hidden-md-up">
        <p className={pClass}>{props.writing.kanji}</p>
      </h1>
    </div>
  );
};

var Reading = function (props) {
  var pClass = props.reading.priority ? "btn btn-danger" : "btn btn-outline-danger";

  return <p className={pClass}>{props.reading.kana}</p>;
};

var Sense = function (props) {
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
          <span className="badge badge-danger">{props.name}: {props.data.join(', ')}</span>
        </div>
      );
    };

    return (
      <li className="list-group-item">
        <span className="lead"><strong>{props.translation.glossaries.join(', ')}</strong></span>

        {subFields.map(function (fieldName) {
          return <SubField data={props.translation[fieldName]} name={fieldName} key={fieldName} />
        })}
      </li>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">{props.sense.partsOfSpeech.join(', ')}</h4>
      </div>
      <ul className="list-group list-group-flush">
        {props.sense.translations.map(function (translation) {
          // return <Translation translation={translation} />
          return (
            <span key={translation.glossaries[0]}>
              <Translation translation={translation} />
            </span>
          );
        })}
      </ul>
    </div>
  );
};

class Entry extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-lg-4">
          <ul className="nav nav-pills">
            {this.props.entry.writings.map(function (writing) {
              return (
                <li className="nav-item" key={writing.kanji}>
                  <Writing writing={writing} />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-lg-2">
          <ul className="list-inline">
            {this.props.entry.readings.map(function (reading) {
              return (
                <li className="list-inline-item" key={reading.kana}>
                  <Reading reading={reading} />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-lg-6">
          {this.props.entry.senses.map(function (sense) {
            // return <Sense sense={sense} />
            return (
              <span key={sense.translations[0].glossaries[0]}>
                <Sense sense={sense} />
              </span>
            );
          })}
          <br /><hr /><br />
        </div>
      </div>
    );
  };
};

export default Entry;
