import React from 'react';

import * as Utils from '../utils.js';

import SearchForm from './search_form.js';
import Entry from './entry.js';

class Sagasu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: props.query || {},
      entries: [],
      totalCount: 0
    }

    this.baseUrl = props.baseUrl;
    // this.baseUrl = 'http://api.jukugo.caracal.la';

    this.getEntries = this.getEntries.bind(this);
  }

  componentDidMount() {
    // is this gross?
    if (Object.keys(this.state.query).length) {
      this.getEntries(this.state.query);
    }
  }

  getEntries(query) {
    let queryItems = [];

    Object.keys(query).forEach((key) => {
      if (query[key]) {
        queryItems.push(key + "=" + query[key]);
      }
    });

    let entriesUrl = `${this.baseUrl}/entries?${queryItems.join('&')}`;

    console.log(entriesUrl);

    Utils.get(entriesUrl, {
      success: (response) => {
        this.setState({
          entries: response.entries,
          totalCount: response.total_count
        });
      },
      failure: (errorMessage) => {
        console.log(errorMessage);
      }
    });
  }

  render() {
    let entries = this.state.entries.map((entry) => {
      return <Entry entry={ entry } key={ entry._id } />
    });

    return (
      <div>
        <SearchForm
            query={ this.state.query }
            getEntries={ this.getEntries } />

        <hr />

        <div className="row">
          <div className="col-5">
            <p className="text-right">Total: { this.state.totalCount }</p>
          </div>

          <div className="col-2">
            <p className="text-center">|</p>
          </div>

          <div className="col-5">
            <p>In Page: { this.state.entries.length }</p>
          </div>
        </div>

        <hr />

        { entries }
      </div>
    );
  }
}

export default Sagasu;
