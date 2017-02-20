import React, { Component } from 'react';
import './App.css';

var Entry = function (props) {
  return (
    <div className="row">
      <h1 className="display-4">
        <ul className="nav nav-pills">
          {props.entry.writings.map(function (writing) {
            return (
              <li className="nav-item" key={writing.kanji}>
                <Writing writing={writing} />
              </li>
            );
          })}
        </ul>
      </h1>
      <ul className="list-inline">
        {props.entry.readings.map(function (reading) {
          return (
            <li className="list-inline-item" key={reading.kana}>
              <Reading reading={reading} />
            </li>
          );
        })}
      </ul>
      <ul className="list-group">
        {props.entry.senses.map(function (sense) {
          return (
            <li className="list-group-item" key={sense.translations}>
              <Sense sense={sense} />
            </li>
          );
        })}
      </ul>
      <hr />
    </div>
  );
};

var Writing = function (props) {
  var pClass = props.writing.priority ? "nav-link active bg-danger" : "nav-link text-danger";

  return <p className={pClass}>{props.writing.kanji}</p>;
};

var Reading = function (props) {
  var pClass = props.reading.priority ? "btn btn-success" : "btn btn-outline-success";

  return <p className={pClass}>{props.reading.kana}</p>;
};

var Sense = function (props) {
  const translations = <span><strong>Translations:</strong> {props.sense.translations.join(", ")}</span>;

  if (props.sense.partsOfSpeech) {
    return (
      <div>
        <span className="lead"><strong>Parts of Speech:</strong> {props.sense.partsOfSpeech}</span>
        <br />
        {translations}
      </div>
    );
  } else {
    return translations;
  }
};

class App extends Component {
  render() {
    return (
      <div>
        {this.props.entries.map(function (entry) {
          return <div key={entry._id}><Entry entry={entry} /></div>;
        })}
      </div>
    );
  };
};

export default App;
