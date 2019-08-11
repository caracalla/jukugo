import React from 'react';

class ErrorContext extends React.Component {
  constructor(props) {
    super(props);

    this.message = props.message
    this.action = props.action;
  }

  render() {
    return (
      <div>
        <h1>Error Encountered</h1>

        <p className="lead">
          Jukugo encountered the following error while { this.action }:
        </p>

        <p>{ this.message }</p>
      </div>
    );
  }
}

export default ErrorContext;
