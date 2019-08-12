import React from 'react';
import * as Cookies from "js-cookie";

import { contexts } from './contexts.js';
import * as Utils from './utils.js';

import Navbar from './navbar.js';
import Splash from './splash.js';
import ErrorContext from './error.js';
import Kyoushi from './kyoushi/kyoushi.js';
import Sagasu from './sagasu/sagasu.js';

class Jukugo extends React.Component {
  constructor(props) {
    super(props);

    this.defaultContext = contexts.JUKUGO;

    this.state = {
      loggedIn: false,
      username: Cookies.get('username'),
      activeContext: contexts.LOADING,
      nextContext: props.context || this.defaultContext,
      user: null,
      error: {
        message: '',
        action: ''
      }
    }

    this.baseUrl = props.baseUrl;
    this.getUser = this.getUser.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.notifyContextChange = this.notifyContextChange.bind(this);
    this.notifyError = this.notifyError.bind(this);

    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  componentDidMount() {
    if (this.state.username && !this.state.user) {
      // log the user in
      this.getUser();
    } else {
      // not logged in, can only to go splash page
      this.setState({
        activeContext: this.defaultContext
      });
    }
  }

  getUser() {
    const userUrl = `${this.baseUrl}/users/${this.state.username}`;

    Utils.get(userUrl, {
      success: (response) => {
        let nextState = {
          username: response.user.name,
          user: response.user,
          loggedIn: true,
          activeContext: this.state.nextContext
        };

        console.log(`retrieved user ${response.user.name}`);

        this.setState(nextState);
      },
      failure: (errorMessage) => {
        console.log(`failed to get user ${this.state.username}`);

        this.setState({
          username: '',
          user: null,
          loggedIn: false,
          activeContext: this.defaultContext
        })
      }
    });
  }

  // TODO: remove this
  resetUser(event) {
    event.preventDefault();

    let nextState = {
      activeContext: contexts.LOADING,
      nextContext: contexts.KYOUSHI
    };

    this.setState(nextState, () => {
      let url = `${this.baseUrl}/users/${this.state.username}/reset`;

      Utils.post(url, {}, {
        success: (response) => {
          this.getUser();
        },
        failure: (errorMessage) => {
          this.notifyError(errorMessage, 'resetting the user');
        }
      });
    });
  }

  // Used by the navbar to change the active context
  notifyContextChange(context) {
    this.setState({ activeContext: context });
  }

  // Used by the context to report errors
  notifyError(errorMessage, failedAction) {
    console.log(`encountered an error while ${failedAction}: ${errorMessage}`);

    this.setState({
      activeContext: contexts.ERROR,
      error: {
        message: errorMessage,
        action: failedAction
      }
    });
  }

  logIn(event) {
    event.preventDefault();

    let logInUrl = `${this.baseUrl}/log_in`;

    let body = {
      username: document.querySelector('#log-in-username').value,
      password: document.querySelector('#log-in-password').value
    }

    Utils.post(logInUrl, body, {
      success: (response) => {
        Cookies.set('username', body.username);

        let nextState = {
          username: body.username,
          nextContext: contexts.KYOUSHI
        };

        this.setState(nextState, () => {
          console.log('username cookie is: ', Cookies.get('username'));
          this.getUser();
        });
      },
      failure: (errorMessage) => {
        console.log(errorMessage);
        // TODO: show the error
      }
    });
  }

  logOut(event) {
    event.preventDefault();

    Cookies.set('username', '');

    this.setState({
      loggedIn: false,
      username: '',
      activeContext: this.defaultContext,
      user: null
    });
  }

  signUpContext() {
    return (
      <form onSubmit={ this.signUp }>
        <div className="form-group">
          <label htmlFor="sign-up-username">Username</label>
          <input className="form-control" id="sign-up-username" />
        </div>

        <div className="form-group">
          <label htmlFor="sign-up-password">Password</label>
          <input type="password" className="form-control" id="sign-up-password" />
        </div>

        <button type="submit" className="btn btn-danger">Sign Up</button>
      </form>
    );
  }

  signUp(event) {
    event.preventDefault();

    let signUpUrl = `${this.baseUrl}/users`;

    let body = {
      username: document.querySelector('#sign-up-username').value,
      password: document.querySelector('#sign-up-password').value
    };

    Utils.post(signUpUrl, body, {
      success: (response) => {
        Cookies.set('username', body.username);

        let nextState = {
          username: body.username,
          nextContext: contexts.KYOUSHI
        };

        this.setState(nextState, () => {
          console.log('username cookie is: ', Cookies.get('username'));
          this.getUser();
        });
      },
      failure: (errorMessage) => {
        console.log(errorMessage);
        // TODO: show the error
      }
    });
  }

  getContent() {
    switch(this.state.activeContext) {
      case contexts.ERROR: {
        return (
          <ErrorContext
              message={ this.state.error.message }
              action={ this.state.error.action } />
        );
      }
      case contexts.LOG_IN: {
        return this.logInContext();
      }
      case contexts.SIGN_UP: {
        return this.signUpContext();
      }
      case contexts.JUKUGO: {
        return (
          <Splash
              username={ this.state.username }
              notifyContextChange={ this.notifyContextChange }
              key={ this.state.loggedIn } />
        );
      }
      case contexts.LOADING: {
        return (
          <div>
            <p className="display-4 text-center">Loading...</p>
          </div>
        );
      }
      case contexts.KYOUSHI: {
        return (
          <Kyoushi
              baseUrl={ this.baseUrl }
              username={ this.state.username}
              kanjiToLearn={ this.state.user.kanjiToLearn }
              freshWordsCount={ this.state.user.freshWordsCount }
              reviewWordsCount={ this.state.user.reviewWordsCount }
              notifyError={ this.notifyError } />
        );
      }
      case contexts.SAGASU: {
        return (
          <Sagasu
              baseUrl={ this.baseUrl } />
        );
      }
      default: {
        return <p className="display-1">404</p>;
      }
    }
  }

  render() {
    return (
      <div>
        <Navbar
            activeContext={ this.state.activeContext }
            loggedIn={ this.state.loggedIn }
            notifyContextChange={ this.notifyContextChange }
            resetUser={ this.resetUser }
            logOut={ this.logOut }
            logIn={ this.logIn }
            // this makes me feel dirty, but it works
            key={ this.state.activeContext + this.state.loggedIn } />

        <div className="mt-2 container">
          <div className="row">
            <div className="col-12">
              { this.getContent() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Jukugo;
