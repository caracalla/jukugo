import React from 'react';
import ReactDOM from "react-dom";

import Jukugo from "./jukugo.js";
import { contexts } from './contexts.js';

const baseUrl = 'http://api.jukugo.caracal.la';

let route = (path) => {
  switch(path) {
    case "": {
      return contexts.JUKUGO;
    }
    case "kyoushi": {
      return contexts.KYOUSHI;
    }
    case "sagasu": {
      return contexts.SAGASU
    }
    default: {
      return "404";
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const domContainer = document.querySelector('#react-root');

  let pathname = window.location.pathname.slice(1);

  let context = route(pathname);

  ReactDOM.render(
    <Jukugo
        baseUrl={ baseUrl }
        context={ route(pathname) } />,
    domContainer
  );
});
