import React, { Component } from 'react';
import SearchForm from './SearchForm.js'
import EntryList from './EntryList.js'

class App extends Component {
  render() {
    return (
      <div className="container">
        <SearchForm query={this.props.query} />
        <div id="entry-list-container"></div>
      </div>
    );
  };
};

export default App;
