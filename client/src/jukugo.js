import React from 'react';

import { contexts } from './contexts.js';
import * as Utils from './utils.js';

import Navbar from './navbar.js';
import Splash from './splash.js';
import ErrorContext from './error.js';
import Kyoushi from './kyoushi/kyoushi.js';

class Jukugo extends React.Component {
  constructor(props) {
    super(props);

    this.defaultContext = contexts.JUKUGO;

    this.state = {
      loggedIn: false,
      username: props.username,
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
        this.notifyError(errorMessage, 'getting the user');
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

  logInContext() {
    return (
      <form onSubmit={ this.logIn }>
        <div className="form-group">
          <label htmlFor="log-in-username">Username</label>
          <input className="form-control" id="log-in-username" />
        </div>

        <div className="form-group">
          <label htmlFor="log-in-password">Password</label>
          <input type="password" className="form-control" id="log-in-password" />
        </div>

        <button type="submit" className="btn btn-primary">Log In</button>
      </form>
    );
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
        // TODO: set cookies

        let nextState = {
          username: body.username,
          nextContext: contexts.KYOUSHI
        };

        this.setState(nextState, () => {
          this.getUser();
        });
      },
      failure: (errorMessage) => {
        console.log(errorMessage);
      }
    })
  }

  signUpContext() {
    return <div>{ this.state.activeContext }</div>;
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
              notifyContextChange={ this.notifyContextChange } />
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
        return <div>{ this.state.activeContext }</div>;
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
            key={ this.state.activeContext } />

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
