import React, { Component } from 'react';
import './App.css';

var Entry = function (props) {
  return (
    <div className="row">
      {/* <h1 className="display-4"> */}
        <ul className="nav nav-pills">
          {props.entry.writings.map(function (writing) {
            return (
              <li className="nav-item" key={writing.kanji}>
                <Writing writing={writing} />
              </li>
            );
          })}
        </ul>
      {/* </h1> */}
      <ul className="list-inline">
        {props.entry.readings.map(function (reading) {
          return (
            <li className="list-inline-item" key={reading.kana}>
              <Reading reading={reading} />
            </li>
          );
        })}
      </ul>
        {props.entry.senses.map(function (sense) {
          return <Sense sense={sense} />
        })}
      <br /><hr /><br />
    </div>
  );
};

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
  var pClass = props.reading.priority ? "btn btn-success" : "btn btn-outline-success";

  return <p className={pClass}>{props.reading.kana}</p>;
};

var Sense = function (props) {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">{props.sense.partsOfSpeech.join(', ')}</h4>
      </div>
      <ul className="list-group list-group-flush">
        {props.sense.translations.map(function (translation) {
          return <Translation translation={translation} />
        })}
      </ul>
    </div>
  );
};

var Translation = function (props) {
  // glossaries: [],
  // similar: [],
  // antonyms: [],
  // misc: [],
  // loanwords: [],
  // dialects: [],
  // associatedReadings: [],
  // associatedWritings: []

  return (
    <li className="list-group-item">
      <span className="lead"><strong>{props.translation.glossaries.join(', ')}</strong></span>
      <Info info={props.translation.info} />
      <Misc misc={props.translation.misc} />
      <Fields fields={props.translation.fields} />
      <Similar similar={props.translation.similar} />
      <Antonyms antonyms={props.translation.antonyms} />
      <Loanwords loanwords={props.translation.loanwords} />
      <Dialects dialects={props.translation.dialects} />
      <AssociatedReadings associatedReadings={props.translation.associatedReadings} />
      <AssociatedWritings associatedWritings={props.translation.associatedWritings} />
    </li>
  );
};

var Info = function (props) {
  return !props.info ? null : (
    <div>
      <button className="btn btn-secondary btn-sm">Info: {props.info.join(', ')}</button>
    </div>
  );
};

var Fields = function (props) {
  return !props.fields ? null : (
    <div>
      <button className="btn btn-secondary btn-sm">Fields: {props.fields.join(', ')}</button>
    </div>
  );
};

var Misc = function (props) {
  return !props.misc ? null : (
    <div>
      <button className="btn btn-secondary btn-sm">Misc: {props.misc.join(', ')}</button>
    </div>
  );
};

var Similar = function (props) {
  return !props.similar ? null : (
    <div>
      <button className="btn btn-secondary btn-sm">Similar: {props.similar.join(', ')}</button>
    </div>
  );
};

var Antonyms = function (props) {
  return !props.antonyms ? null : (
    <div>
      <button className="btn btn-secondary btn-sm">Antonyms: {props.antonyms.join(', ')}</button>
    </div>
  );
};

var Loanwords = function (props) {
  return !props.loanwords ? null : (
    <div>
      <button className="btn btn-secondary btn-sm">Loanwords: {props.misc.join(', ')}</button>
    </div>
  );
};

var Dialects = function (props) {
  return !props.dialects ? null : (
    <div>
      <button className="btn btn-secondary btn-sm">Dialects: {props.dialects.join(', ')}</button>
    </div>
  );
};

var AssociatedReadings = function (props) {
  return !props.associatedReadings ? null : (
    <div>
      <button className="btn btn-secondary btn-sm">
        Associated Readings: {props.associatedReadings.join(', ')}
      </button>
    </div>
  );
};

var AssociatedWritings = function (props) {
  return !props.associatedWritings ? null : (
    <div>
      <button className="btn btn-secondary btn-sm">
        Associated Writings: {props.associatedWritings.join(', ')}
      </button>
    </div>
  );
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
