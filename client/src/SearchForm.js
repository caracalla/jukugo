import React, { Component } from 'react';
import jukugo from './index.js'

class SearchForm extends Component {
  constructor(props) {
    super(props);

    var page = parseInt(this.props.query.page);

    this.state = {
      writing: this.props.query.writing || "",
      reading: this.props.query.reading || "",
      translation: this.props.query.translation || "",
      grade: this.props.query.grade || "",
      page: page > 0 ? page : 1
    };

    this.handleWritingChange = this.handleWritingChange.bind(this);
    this.handleReadingChange = this.handleReadingChange.bind(this);
    this.handleTranslationChange = this.handleTranslationChange.bind(this);
    this.handleGradeChange = this.handleGradeChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  handleWritingChange(event) {
    this.setState({writing: event.target.value});
  }

  handleReadingChange(event) {
    this.setState({reading: event.target.value});
  }

  handleTranslationChange(event) {
    this.setState({translation: event.target.value});
  }

  handleGradeChange(event) {
    this.setState({grade: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();

    this.setState({page: 1}, function () {
      this.getEntries();
    }.bind(this));
  }

  nextPage(event) {
    event.preventDefault();

    this.setState({page: this.state.page + 1}, function () {
      this.getEntries();
    }.bind(this));
  }

  previousPage(event) {
    event.preventDefault();

    this.setState({page: this.state.page - 1}, function () {
      this.getEntries();
    }.bind(this));
  }

  getEntries() {
    var query_items = [];

    Object.keys(this.state).forEach(function(key) {
      if (this.state[key]) {
        query_items.push(key + "=" + this.state[key]);
      }
    }.bind(this));

    jukugo.getEntries("?" + query_items.join("&"));
  }

  render() {
    return (
      <div className="card">
        <div className="card-block">
          <form id="searchForm" onSubmit={this.onSubmit}>
            <div className="form-group row">
              <label className="lead col-md-2 col-form-label">Writing</label>
              <div className="col-md-10">
                <input
                  type="text"
                  id="writingSearch"
                  className="form-control"
                  value={this.state.writing}
                  onChange={this.handleWritingChange}
                />
              </div>
            </div>

            <div className="form-group row">
              <label className="lead col-md-2 col-form-label">Reading</label>
              <div className="col-md-10">
                <input
                  type="text"
                  id="readingSearch"
                  className="form-control"
                  value={this.state.reading}
                  onChange={this.handleReadingChange}
                />
              </div>
            </div>

            <div className="form-group row">
              <label className="lead col-md-2 col-form-label">Translation</label>
              <div className="col-md-10">
                <input
                  type="text"
                  id="translationSearch"
                  className="form-control"
                  value={this.state.translation}
                  onChange={this.handleTranslationChange}
                />
              </div>
            </div>

            <div className="form-group row">
              <label className="lead col-md-2 col-form-label">Grade</label>
              <div className="col-md-10">
                <select
                  className="form-control"
                  id="gradeSelect"
                  value={this.state.grade}
                  onChange={this.handleGradeChange}
                >
                  <option value="" disabled>Select a Grade</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>

            <hr />
            <button type="submit" className="btn btn-danger">Search</button>

            <button className="btn btn-danger" onClick={this.previousPage}>Previous</button>
            <button className="btn btn-danger" onClick={this.nextPage}>Next</button>
          </form>
        </div>
      </div>
    );
  };
};

export default SearchForm;
