import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import EntryList from './EntryList';
import './index.css';
import $ from 'jquery';

var jukugo = {
  baseURL: "http://api.jukugo.tech/entries",

  renderApp: function (queryString) {
    var queryItems = this.parseQueryString(queryString);

    ReactDOM.render(
      <App query={queryItems} />,
      document.getElementById('root')
    );

    if (Object.keys(queryItems).length > 0) {
      this.getEntries(queryString);
    }
  },

  renderEntries: function (response) {
    console.log(response.total_count);
    ReactDOM.render(
      <EntryList entries={response.entries} total_count={response.total_count} />,
      document.getElementById('entry-list-container')
    );
  },

  getEntries: function (queryString) {
    var url = this.baseURL + queryString;
    window.history.pushState(null, 'Jukugo', queryString);

    $.get(url, this.renderEntries);
  },

  parseQueryString: function (queryString) {
    var queryItems = {};

    queryString.substring(1).split('&').forEach(function (pairString) {
      if (pairString.indexOf('=') !== -1) {
        var pair = pairString.split('=');
        queryItems[pair[0]] = pair[1];
      }
    });

    return queryItems;
  }
};

$("document").ready(function () {
  jukugo.renderApp(window.location.search);
});

export default jukugo;
