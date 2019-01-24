import React, { Component } from 'react';
import Entry from './Entry.js'

class EntryList extends Component {
  render() {
    return (
      <div className="entry-list">
        <hr className="main-separator" />
        <p>Number of results: {this.props.count}</p>
        <hr className="main-separator" />
        {this.props.entries.map(function (entry) {
          return <div key={entry._id}><Entry entry={entry} /><br/></div>;
        })}
      </div>
    );
  };
};

export default EntryList;

