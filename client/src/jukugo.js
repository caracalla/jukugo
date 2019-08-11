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

    Utils.get(
      userUrl,
      {
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
      }
    );

    // jQuery.get(userUrl, (response) => {
    //   if (response.error) {
    //     this.notifyError(response.error, 'getting the user');
    //   } else {
    //     let nextState = {
    //       username: response.user.name,
    //       user: response.user,
    //       loggedIn: true,
    //       activeContext: this.state.nextContext
    //     };

    //     console.log(`retrieved user ${response.user.name}`);

    //     this.setState(nextState);
    //   }
    // });
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

      Utils.post(
        url,
        {},
        {
          success: (response) => {
            this.getUser(this.state.username);
          },
          failure: (errorMessage) => {
            this.notifyError(errorMessage, 'resetting the user');
          }
        }
      );
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
        return (
          <button
              className="btn btn-lg btn-primary"
              onClick={(event) => {
                event.preventDefault();
                this.setState({username: 'jimbo'}, () => {
                  this.getUser();
                });
              }}>
            Log In
          </button>
        );
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
              reviewWordsCount={ this.state.user.reviewWordsCount } />
        );
      }
      case contexts.SAGASU: {
        return <div>{ this.state.activeContext }</div>;
      }
      case contexts.SIGN_UP: {
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
