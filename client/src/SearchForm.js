import React, { Component } from 'react';
import jukugo from './index.js'

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      writing: "",
      reading: "",
      translation: "",
      grades: []
    };

    this.handleWritingChange = this.handleWritingChange.bind(this);
    this.handleReadingChange = this.handleReadingChange.bind(this);
    this.handleTranslationChange = this.handleTranslationChange.bind(this);
    this.handleGradesChange = this.handleGradesChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

  handleGradesChange(event) {
    var grade = event.target.value

    if (event.target.checked) {
      if (!this.state.grades.includes(grade)) {
        this.setState(function (state) {
          return {grades: state.grades.concat(grade)};
        })
      }
    } else {
      this.setState(function (state) {
        while (state.grades.indexOf(grade) !== -1) {
          state.grades.splice(state.grades.indexOf(grade), 1);
        }

        return {grades: state.grades};
      })
    }
  }

  onSubmit(event) {
    event.preventDefault();

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

            <div className="row">
              <div className="col-md-2">
                <span className="lead">Grade:</span>
              </div>

              <div className="col-md-10">
                <div className="row">
                  <div className="col-2">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkGrade1"
                          value="1"
                          name="grades"
                          onChange={this.handleGradesChange}
                        /> 1
                      </label>
                    </div>
                  </div>

                  <div className="col-2">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkGrade2"
                          value="2"
                          name="grades"
                          onChange={this.handleGradesChange}
                        /> 2
                      </label>
                    </div>
                  </div>

                  <div className="col-2">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkGrade3"
                          value="3"
                          name="grades"
                          onChange={this.handleGradesChange}
                        /> 3
                      </label>
                    </div>
                  </div>

                  <div className="col-2">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkGrade4"
                          value="4"
                          name="grades"
                          onChange={this.handleGradesChange}
                        /> 4
                      </label>
                    </div>
                  </div>

                  <div className="col-2">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkGrade5"
                          value="5"
                          name="grades"
                          onChange={this.handleGradesChange}
                        /> 5
                      </label>
                    </div>
                  </div>

                  <div className="col-2">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkGrade6"
                          value="6"
                          name="grades"
                          onChange={this.handleGradesChange}
                        /> 6
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />
            <button type="submit" className="btn btn-danger">Search</button>
          </form>
        </div>
      </div>
    );
  };
};

export default SearchForm;
