import React, { Component } from 'react';
import Entry from './Entry.js'

class EntryList extends Component {
  render() {
    return (
      <div className="entry-list">
        <hr className="main-separator" />

        <div className="row">
          <div className="col-5">
            <p className="text-right">Total: {this.props.total_count}</p>
          </div>

          <div className="col-2">
            <p className="text-center">|</p>
          </div>

          <div className="col-5">
            <p>In Page: {this.props.entries.length}</p>
          </div>
        </div>

        <hr className="main-separator" />

        {this.props.entries.map(function (entry) {
          return <div key={entry._id}><Entry entry={entry} /><br/></div>;
        })}
      </div>
    );
  };
};

export default EntryList;

