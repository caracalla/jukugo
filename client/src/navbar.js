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
    this.logOut = props.logOut;
    this.logIn = props.logIn;

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
          <li className="nav-item dropdown">
            <button
                className="btn btn-danger nav-link"
                data-toggle="dropdown"
                type="submit">
              Account
            </button>

            <div className="dropdown-menu dropdown-menu-right">
              <a
                  className="dropdown-item"
                  href="#"
                  onClick={ this.resetUser }>
                Reset
              </a>

              <div className="dropdown-divider"></div>

              <a
                  className="dropdown-item"
                  href="#"
                  onClick={ this.logOut }>Log Out</a>
            </div>
          </li>
        </ul>
      </nav>
    );
  }

  logInForm() {
    return (
      <div className="dropdown-menu dropdown-menu-right">
        <form className="px-3 py-2" onSubmit={ this.logIn }>
          <div className="form-group">
            <label htmlFor="log-in-username">Username</label>
            <input className="form-control" id="log-in-username" />
          </div>

          <div className="form-group">
            <label htmlFor="log-in-password">Password</label>
            <input type="password" className="form-control" id="log-in-password" />
          </div>

          <button type="submit" className="btn btn-danger">Log In</button>
        </form>
      </div>
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
          <li className="nav-item dropdown">
            <button
                className="btn btn-danger nav-link"
                data-toggle="dropdown"
                type="submit">
              Log In
            </button>

            { this.logInForm() }
          </li>
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
