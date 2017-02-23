import React, { Component } from 'react';

class SearchForm extends Component {
  render() {
    return (
      <div className="row">
        <div className="card">
          <div className="card-block">
            <form>
              <div className="form-group row">
                <label className="lead col-sm-2 col-form-label" for="name">Writing</label>
                <div className="col-sm-10">
                  <input type="text" id="writingSearch" className="form-control" />
                </div>
              </div>

              <div className="form-group row">
                <label className="lead col-sm-2 col-form-label" for="name">Reading</label>
                <div className="col-sm-10">
                  <input type="text" id="readingSearch" className="form-control" />
                </div>
              </div>

              <div className="form-group row">
                <label className="lead col-sm-2 col-form-label" for="name">Translation</label>
                <div className="col-sm-10">
                  <input type="text" id="translationSearch" className="form-control" />
                </div>
              </div>

              <div className="row">
                <div className="col-sm-2">
                  <span className="lead">Grade:</span>
                </div>

                <div className="col-sm-10">
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      <input className="form-check-input" type="checkbox" id="radioGrade1" value="1" /> 1
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      <input className="form-check-input" type="checkbox" id="radioGrade2" value="2" /> 2
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      <input className="form-check-input" type="checkbox" id="radioGrade3" value="3" /> 3
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      <input className="form-check-input" type="checkbox" id="radioGrade4" value="4" /> 4
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      <input className="form-check-input" type="checkbox" id="radioGrade5" value="5" /> 5
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      <input className="form-check-input" type="checkbox" id="radioGrade6" value="6" /> 6
                    </label>
                  </div>
                </div>
              </div>

              <hr />
              <button type="submit" className="btn btn-danger">Search</button>
            </form>
          </div>
        </div>
      </div>
    );
  };
};

export default SearchForm;
