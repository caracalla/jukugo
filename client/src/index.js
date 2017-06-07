import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import $ from 'jquery';

var jukugo = {
  baseURL: "http://api.jukugo.tech/entries",

  render: function (entries) {
    ReactDOM.render(
      <App entries={entries} />,
      document.getElementById('root')
    );
  },

  getEntries: function (queryString) {
    var url = this.baseURL + queryString;

    $.get(url, this.render);
  },

  log: function (text) {
    console.log(text);
  }
};

$("document").ready(function () {
  jukugo.getEntries(document.location.search);
});

export default jukugo;
