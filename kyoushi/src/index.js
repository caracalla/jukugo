class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.items = props.items;

    this.state = {
      activeItem: props.activeItem
    };

    this.notifyItemChange = props.notifyItemChange;
    this.resetUser = props.resetUser;

    this.setActiveItem = this.setActiveItem.bind(this);
  }

  setActiveItem(event) {
    event.preventDefault();

    let activeItem = event.target.innerHTML;

    this.notifyItemChange(activeItem);
    this.setState({ activeItem: activeItem });
  }

  render() {
    let navItems = this.items.map((item) => {
      let li_class = this.state.activeItem === item ? 'nav-item active' : 'nav-item';

      return (
        <li className={ li_class } key={ item }>
          <a href="#"
              className="nav-link"
              onClick={ this.setActiveItem }>
            {item}
          </a>
        </li>
      );
    });

    return (
      <nav className="navbar navbar-expand navbar-dark bg-danger">
        <a href="#" className="navbar-brand">Jukugo</a>

        <div className="" id="navbar-collapsible-content">
          <ul className="navbar-nav">
            {navItems}
          </ul>
        </div>

        <ul className="navbar-nav ml-auto">
          <button
              className="btn btn-danger float-right"
              type="submit"
              onClick={this.resetUser}>
            Reset
          </button>
        </ul>
      </nav>
    );
  }
}



/*******************************************************************************
* Sagasu
*******************************************************************************/
class Sagasu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <p className="">Words Content</p>;
  }
}



/*******************************************************************************
* Kyoushi
*******************************************************************************/
class WordCard extends React.Component {
  constructor(props) {
    super(props);

    this.word = props.word
    this.review = props.review;

    // functions
    this.learnWord = props.learnWord;
    this.ignoreWord = props.ignoreWord;
    this.submitReview = props.submitReview;
  }

  bottomButtons() {
    if (this.review) {
      // Buttons for words under review
      return (
        <div className="row">
          <div className="col-6">
            <button
                id={this.word._id}
                className="btn btn-danger btn-block"
                onClick={this.submitReview}
                data-status="pass">
              Got It
            </button>
          </div>

          <div className="col-6">
            <button
                id={this.word._id}
                className="btn btn-danger btn-block"
                onClick={this.submitReview}
                data-status="fail">
              Don't Got It
            </button>
          </div>
        </div>
      );
    } else {
      // Buttons for fresh words
      return (
        <div className="row">
          <div className="col-6">
            <button
                id={this.word._id}
                className="btn btn-danger btn-block"
                onClick={this.learnWord}>
              Learn
            </button>
          </div>

          <div className="col-6">
            <button
                id={this.word._id}
                className="btn btn-outline-danger btn-block float-right"
                onClick={this.ignoreWord}>
              Ignore
            </button>
          </div>
        </div>
      );
    }
  }

  render() {
    let bottomButtons = this.bottomButtons();

    let bodyId = `body-${this.word._id}`;

    let revealButton = (
      <button
          className="btn btn-danger btn-block"
          onClick={(event) => {
            event.preventDefault();
            let element = document.querySelector(`#${bodyId}`);
            event.target.hidden = true;
            element.hidden = false;
          }}>
        Reveal
      </button>
    );

    return (
      <div className="col-lg-4 col-md-6 col-sm-12 mt-2 mb-3" key={this.word._id}>
        <div className="card">
          <div className="card-header">
            <h1 className="card-title text-center display-4">
              {this.word.writings[0].kanji}
            </h1>
          </div>

          <div className="card-body">
            {this.review ? revealButton : ''}

            <div id={bodyId} hidden={this.review ? 'hidden' : ''}>
              <h3 className="card-text">
                <span className="badge badge-danger font-weight-normal">{this.word.readings[0].kana}</span>
              </h3>

              <p className="card-text">
                {this.word.senses[0].translations[0].glossaries[0]}
              </p>

              <WordModal word={this.word} />

              <p className="card-text">
                <button
                    className="btn btn-outline-danger btn-block btn-sm"
                    data-toggle="modal"
                    data-target={`#modal-${this.word._id}`}>
                  See more
                </button>
              </p>

              {bottomButtons}
            </div>
          </div>
        </div>
      </div>
    );
  }
}



// The idea here is to display all aspects of the word
class WordModal extends React.Component {
  constructor(props) {
    super(props);

    this.word = props.word
  }

  render() {
    let modalId = `modal-${this.word._id}`
    let kanjiCounter = 0;

    let header = this.word.writings[0].kanji.split('').map((character) => {
      kanjiCounter += 1;  // I hate this key shit

      return (
        <a
            target="_blank"
            href={`https://en.wiktionary.org/wiki/${character}#Japanese`}
            key={`${character}${kanjiCounter}`}>
          {character}
        </a>
      );
    });

    let writings = this.word.writings.map((writing) => {
      return (
        <span className="btn btn-lg btn-danger mx-1 mb-2" key={writing.kanji}>
          {writing.kanji}
        </span>
      );
    });

    let readings = this.word.readings.map((reading) => {
      return (
        <span className="btn btn-lg btn-outline-danger mx-1 mb-2" key={reading.kana}>
          {reading.kana}
        </span>
      );
    });

    let translations = this.word.senses.map((sense) => {
      return sense.translations.map((translation) => {
        return translation.glossaries.map((glossary) => {
          return (
            <p className="mx-1 lead" key={glossary}>
              {glossary}
            </p>
          );
        });
      });
    });

    return (
      <div className="modal" tabIndex="-1" role="dialog" id={modalId} key={modalId}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h1 className="display-3 text-center">{header}</h1>

              <hr />

              <h5>Writings</h5>
              {writings}
              <hr />

              <h5>Readings</h5>
              {readings}
              <hr />

              <h5>Translations</h5>
              {translations}

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger btn-block" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



class FreshWordsState extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      freshWords: props.freshWords
    };

    this.learnWordUrl = props.learnWordUrl;
    this.ignoreWordUrl = props.ignoreWordUrl;
    this.setParentState = props.setParentState;

    this.learnWord = this.learnWord.bind(this);
    this.ignoreWord = this.ignoreWord.bind(this);
  }

  learnWord(event) {
    event.preventDefault();

    let learnedWordId = event.target.id;
    let learnWordUrl = `${this.learnWordUrl}/${learnedWordId}`

    jQuery.post(learnWordUrl, (response) => {
      let newFreshWords = this.state.freshWords.filter((freshWord) => {
        return freshWord._id !== learnedWordId;
      });

      this.updateFreshWords(newFreshWords);
    });
  }

  ignoreWord(event) {
    event.preventDefault();

    let ignoredWordId = event.target.id;
    let ignoreWordUrl = `${this.ignoreWordUrl}/${ignoredWordId}`

    jQuery.post(ignoreWordUrl, (response) => {
      let newFreshWords = this.state.freshWords.filter((freshWord) => {
        return freshWord._id !== ignoredWordId;
      });

      this.updateFreshWords(newFreshWords);
    });
  }

  updateFreshWords(newFreshWords) {
    if (newFreshWords.length > 0) {
      this.setState({
        freshWords: newFreshWords,
      });
    } else {
      this.setParentState({
        freshWords: [],
        freshWordsCount: 0
      });
    }
  }

  render() {
    let freshWordCards = this.state.freshWords.map((freshWord) => {
      return <WordCard
          word={freshWord}
          learnWord={this.learnWord}
          ignoreWord={this.ignoreWord}
          key={freshWord._id} />;
    });

    return (
      <div>
        <h1>Fresh Words</h1>

        <div className="row mt-2">
          {freshWordCards}
        </div>
      </div>
    );
  }
}



class ReviewWordsState extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewWords: props.reviewWords
    };

    this.submitReviewUrl = props.submitReviewUrl;
    this.setParentState = props.setParentState;

    this.submitReview = this.submitReview.bind(this);
  }

  submitReview(event) {
    event.preventDefault();

    let wordId = event.target.id;
    let wordStatus = event.target.dataset["status"];

    let submitReviewUrl = `${this.submitReviewUrl}/${wordId}/${wordStatus}`;

    jQuery.post(submitReviewUrl, (response) => {
      let newReviewWords = this.state.reviewWords.filter((reviewWord) => {
        return reviewWord._id !== wordId;
      });

      if (newReviewWords.length > 0) {
        this.setState({
          reviewWords: newReviewWords,
          reviewWordsCount: newReviewWords.length
        });
      } else {
        this.setParentState({
        reviewWords: [],
        reviewWordsCount: 0
      });
      }
    });
  }

  render() {
    let reviewWordCards = this.state.reviewWords.map((reviewWord) => {
      return <WordCard
                word={reviewWord}
                submitReview={this.submitReview}
                key={reviewWord._id}
                review={true} />;
    });

    return (
      <div>
        <h1>Review Words</h1>

        <div className="row mt-2">
          {reviewWordCards}
        </div>
      </div>
    );
  }
}



class Kyoushi extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.username,
      kanjiToLearn: props.kanjiToLearn,
      freshWordsCount: props.freshWordsCount,
      reviewWordsCount: props.reviewWordsCount,
      freshWords: [],
      reviewWords: []
    }

    this.learnKanjiUrl = `http://192.168.57.10:3000/users/${this.state.username}/kanji`;
    this.freshWordsUrl = `http://192.168.57.10:3000/users/${this.state.username}/words/fresh`;
    this.reviewWordsUrl = `http://192.168.57.10:3000/users/${this.state.username}/words/review`;

    this.learnWordUrl = `http://192.168.57.10:3000/users/${this.state.username}/words/learn`;
    this.ignoreWordUrl = `http://192.168.57.10:3000/users/${this.state.username}/words/ignore`;

    this.submitReviewUrl = `http://192.168.57.10:3000/users/${this.state.username}/words/review`;

    this.selectKanji = this.selectKanji.bind(this);
    this.setStateFromChild = this.setStateFromChild.bind(this);
  }

  componentDidMount() {
    // only runs on initialization
    if (this.state.freshWordsCount > 0) {
      this.getFreshWords();
    } else if (this.state.reviewWordsCount > 0) {
      this.getReviewWords();
    }
  }

  setStateFromChild(newState) {
    // could I just pass this.setState here?
    // thinking about it that way, this seems gross
    this.setState(newState);
  }

  selectKanji(event) {
    event.preventDefault();

    let newKanji = event.target.innerHTML;

    // Sending the kanji in a JSON body because it's not really URL safe
    jQuery.post(this.learnKanjiUrl, {kanji: newKanji}, (response) => {
      if (response.result === "success") {
        let kanjiToLearn = this.state.kanjiToLearn.filter((kanji) => {
          return kanji !== newKanji;
        });

        this.setState({kanjiToLearn: kanjiToLearn}, () => {
          this.getFreshWords();
        });
      }
    });
  }

  getFreshWords() {
    jQuery.get(this.freshWordsUrl, (response) => {
      this.setState({
        freshWords: response.entries,
        freshWordsCount: response.entries.length
      });
    });
  }

  getReviewWords() {
    jQuery.get(this.reviewWordsUrl, (response) => {
      this.setState({
        reviewWords: response.entries,
        reviewWordsCount: response.entries.length
      });
    });
  }

  render() {
    if (this.state.freshWords.length > 0) {
      return (
        <FreshWordsState
            freshWords={this.state.freshWords}
            learnWordUrl={this.learnWordUrl}
            ignoreWordUrl={this.ignoreWordUrl}
            setParentState={this.setStateFromChild} />
      );
    } else if (this.state.reviewWords.length > 0) {
      return (
        <ReviewWordsState
            reviewWords={this.state.reviewWords}
            submitReviewUrl={this.submitReviewUrl}
            setParentState={this.setStateFromChild} />
      );
    } else {
      let kanjiButtons = this.state.kanjiToLearn.map((kanji) => {
        return (
          <button className="btn btn-danger btn-lg m-2" onClick={this.selectKanji} key={kanji}>
            {kanji}
          </button>
        );
      });

      return (
        <div>
          <h1>Select New Kanji</h1>

          <div className="row mt-2">
            {kanjiButtons}
          </div>
        </div>
      );
    }
  }
}



/*******************************************************************************
* Profile
*******************************************************************************/
// class ProfileContent extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return <p className="display-1">Profile Content</p>;
//   }
// }



/*******************************************************************************
* Jukugo
*******************************************************************************/
class Jukugo extends React.Component {
  constructor(props) {
    super(props);

    this.navbarItems = ['Sagasu', 'Kyoushi'];

    this.state = {
      reload: true,
      activeItem: props.activeItem || this.navbarItems[1],
      loggedIn: true,     // FIXME
      username: 'james',  // FIXME
      user: null
    };

    this.getUser = this.getUser.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.notifyItemChange = this.notifyItemChange.bind(this);
  }

  componentDidMount() {
    if (this.state.loggedIn && !this.state.user) {
      this.getUser(this.state.username);
    }
  }

  getUser(name) {
    const userUrl = `http://192.168.57.10:3000/users/${this.state.username}`;

    jQuery.get(userUrl, (response) => {
      let nextState = {
        username: response.user.name,
        user: response.user
      };

      if (this.state.reload) {
        nextState.reload = false;
      }

      this.setState(nextState);
    });
  }

  resetUser(event) {
    event.preventDefault();

    this.setState({reload: true}, () => {
      let url = `http://192.168.57.10:3000/users/${this.state.username}/reset`;

      jQuery.post(url, (response) => {
        this.getUser(this.state.username);
      });
    });
  }

  notifyItemChange(item) {
    this.setState({ activeItem: item });
  }

  getContent(activeItem) {
    if (this.state.reload) {
      return <h1>Loading...</h1>;
    }

    switch(activeItem) {
      case 'Sagasu': {
        return <Sagasu />;
        break;
      }
      case 'Kyoushi': {
        return <Kyoushi
                  kanjiToLearn={this.state.user.kanjiToLearn}
                  freshWordsCount={this.state.user.freshWordsCount}
                  reviewWordsCount={this.state.user.reviewWordsCount}
                  username={this.state.username} />
        break;
      }
      // case 'Profile': {
      //   return <ProfileContent />;
      //   break;
      // }
      default: {
        return <p className="display-1">404</p>;
        break;
      }
    }
  }

  render () {
    let content = this.getContent(this.state.activeItem);

    return (
      <div>
        <Navbar
            items={ this.navbarItems }
            activeItem={ this.state.activeItem }
            notifyItemChange={ this.notifyItemChange }
            resetUser={this.resetUser} />

        <div className="mt-2 container">
          <div className="row">
            <div className="col-12">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

$("document").ready(function () {
  const domContainer = document.querySelector('#react-root');

  ReactDOM.render(<Jukugo />, domContainer);
});
