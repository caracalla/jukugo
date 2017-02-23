import React, { Component } from 'react';
import SearchForm from './SearchForm.js'
import Entry from './Entry.js'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <SearchForm />

        {this.props.entries.map(function (entry) {
          return <div key={entry._id}><Entry entry={entry} /></div>;
        })}
      </div>
    );
  };
};

export default App;
