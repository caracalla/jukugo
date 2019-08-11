import React from 'react';

import { contexts } from './contexts.js';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.mainContexts = [
      contexts.KYOUSHI,
      contexts.SAGASU
    ];

    // Since this gets re-rendered every time the context changes, there is no
    // point in it having state
    this.activeContext = props.activeContext;
    this.loggedIn = props.loggedIn;
    this.username = props.username;
    this.notifyContextChange = props.notifyContextChange;
    this.resetUser = props.resetUser;

    this.setActiveContext = this.setActiveContext.bind(this);
  }

  setActiveContext(event) {
    event.preventDefault();

    let activeContext = event.target.innerHTML;

    this.notifyContextChange(activeContext);
    this.setState({ activeContext: activeContext });
  }

  renderLoggedIn() {
    let mainNavItems = this.mainContexts.map((context) => {
      let li_class = this.activeContext === context ? 'nav-item active' : 'nav-item';

      return (
        <li className={ li_class } key={ context }>
          <a href="#"
              className="nav-link"
              onClick={ this.setActiveContext }>
            { context }
          </a>
        </li>
      );
    });

    return (
      <nav className="navbar navbar-expand navbar-dark bg-danger">
        <a
            href="#"
            className="navbar-brand"
            onClick={ this.setActiveContext }>
          { contexts.JUKUGO }
        </a>

        <div className="" id="navbar-collapsible-content">
          <ul className="navbar-nav">
            { mainNavItems }
          </ul>
        </div>

        <ul className="navbar-nav ml-auto">
          <button
              className="btn btn-danger float-right"
              type="submit"
              onClick={ this.resetUser }>
            Reset
          </button>
        </ul>
      </nav>
    );
  }

  renderLoggedOut() {
    return (
      <nav className="navbar navbar-expand navbar-dark bg-danger">
        <a
            href="#"
            className="navbar-brand"
            onClick={ this.setActiveContext }>
          { contexts.JUKUGO }
        </a>

        <ul className="navbar-nav ml-auto">
          <button
              className="btn btn-danger float-right"
              type="submit"
              onClick={ this.setActiveContext }>
            { contexts.LOG_IN }
          </button>
        </ul>
      </nav>
    );
  }

  render() {
    if (this.loggedIn) {
      return this.renderLoggedIn();
    } else {
      return this.renderLoggedOut();
    }
  }
}

export default Navbar;
