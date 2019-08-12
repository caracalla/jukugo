import React from 'react';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    let page = parseInt(this.props.query.page);

    // FIXME: If the writing or reading is read from the query, it gets escaped
    // into gibberish.  Example: 人 -> %E4%BA%BA
    this.state = {
      writing: this.props.query.writing || "",
      reading: this.props.query.reading || "",
      translation: this.props.query.translation || "",
      grade: this.props.query.grade || "",
      page: page > 0 ? page : 1
    };

    this.getEntries = props.getEntries;

    this.handleWritingChange = this.handleWritingChange.bind(this);
    this.handleReadingChange = this.handleReadingChange.bind(this);
    this.handleTranslationChange = this.handleTranslationChange.bind(this);
    this.handleGradeChange = this.handleGradeChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  handleWritingChange(event) {
    this.setState({ writing: event.target.value });
  }

  handleReadingChange(event) {
    this.setState({ reading: event.target.value });
  }

  handleTranslationChange(event) {
    this.setState({ translation: event.target.value });
  }

  handleGradeChange(event) {
    this.setState({ grade: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    this.setState({ page: 1 }, () => {
      this.getEntries(this.state);
    });
  }

  nextPage(event) {
    event.preventDefault();

    this.setState({ page: this.state.page + 1 }, () => {
      this.getEntries(this.state);
    });
  }

  previousPage(event) {
    event.preventDefault();

    this.setState({ page: this.state.page - 1 }, () => {
      this.getEntries(this.state);
    });
  }

  render() {
    return (
      <div className="card">
        <div className="card-block p-2">
          <form id="searchForm" onSubmit={ this.onSubmit }>
            <div className="form-group row">
              <label className="lead col-md-2 col-form-label">
                Writing
              </label>

              <div className="col-md-10">
                <input
                    type="text"
                    id="writingSearch"
                    className="form-control"
                    value={ this.state.writing }
                    onChange={ this.handleWritingChange } />
              </div>
            </div>

            <div className="form-group row">
              <label className="lead col-md-2 col-form-label">
                Reading
              </label>

              <div className="col-md-10">
                <input
                    type="text"
                    id="readingSearch"
                    className="form-control"
                    value={ this.state.reading }
                    onChange={ this.handleReadingChange } />
              </div>
            </div>

            <div className="form-group row">
              <label className="lead col-md-2 col-form-label">
                Translation
              </label>

              <div className="col-md-10">
                <input
                    type="text"
                    id="translationSearch"
                    className="form-control"
                    value={ this.state.translation }
                    onChange={ this.handleTranslationChange } />
              </div>
            </div>

            <div className="form-group row">
              <label className="lead col-md-2 col-form-label">
                Grade
              </label>

              <div className="col-md-10">
                <select
                    className="form-control"
                    id="gradeSelect"
                    value={ this.state.grade }
                    onChange={ this.handleGradeChange }>
                  <option value="">All Kanji</option>
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
            <div className="row">
              <div className="col-4">
                <button
                    className="btn btn-danger btn-block"
                    onClick={ this.previousPage }
                    disabled={ this.state.page < 2 ? true : false }>
                  Prev
                </button>
              </div>

              <div className="col-4 text-center">
                <button type="submit" className="btn btn-success btn-block">
                  Search
                </button>
              </div>

              <div className="col-4 text-right">
                <button
                    className="btn btn-danger btn-block"
                    onClick={ this.nextPage }
                    // We can't disable this button, since the number of remaining
                    // results is only accessible on the results page.
                    >
                  Next
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SearchForm;
