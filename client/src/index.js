import React from 'react';
import ReactDOM from "react-dom";
import Jukugo from "./jukugo.js";

const baseUrl = 'http://api.jukugo.caracal.la';

document.addEventListener('DOMContentLoaded', () => {
  const domContainer = document.querySelector('#react-root');

  ReactDOM.render(<Jukugo baseUrl={ baseUrl } />, domContainer);
});
