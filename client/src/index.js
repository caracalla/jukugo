import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import $ from 'jquery';

var url = "http://api.jukugo.tech/entries";

$("document").ready(function() {
  $.get(url, function (response) {
    ReactDOM.render(
      <App entries={response} />,
      document.getElementById('root')
    );
  })
});
