class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.items = props.items;

    this.state = {
      activeItem: props.activeItem
    };

    this.notifyItemChange = props.notifyItemChange;
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

    this.wordId = props.word._id;
    this.writings = props.word.writings;
    this.readings = props.word.readings;
    this.senses = props.word.senses;
    this.review = props.review;

    // functions
    this.learnWord = props.learnWord;
    this.ignoreWord = props.ignoreWord;
    // function for doing well on learned word
    // function for doing poorly on learned word
  }

  bottomButtons() {
    if (this.review) {
      <div className="row">
      </div>
    } else {
      return (
        <div className="row">
          <div className="col-6">
            <button
                id={this.wordId}
                className="btn btn-danger btn-block"
                onClick={this.learnWord}>
              Learn
            </button>
          </div>

          <div className="col-6">
            <button
                id={this.wordId}
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
    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mt-2" key={this.wordId}>
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center display-4">
                {this.writings[0].kanji}
              </h1>

              <h3 className="card-text">
                <span className="badge badge-danger font-weight-normal">{this.readings[0].kana}</span>
              </h3>

              <p className="card-text">
                {this.senses[0].translations[0].glossaries[0]}
              </p>

              <WordModal wordId={this.wordId} writings={this.writings} />

              <p className="card-text">
                <button
                    className="btn btn-outline-danger btn-block btn-sm"
                    data-toggle="modal"
                    data-target={`#modal-${this.wordId}`}>
                  See more
                </button>
              </p>

              {bottomButtons}
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

    this.state = {
      key: props.wordId,
      writings: props.writings
    }
  }

  render() {
    let modalId = `modal-${this.state.key}`

    let kanji = this.state.writings.map((writing) => {
      return (
        <p key={writing.kanji}>{writing.kanji}</p>
      );
    });

    return (
      <div className="modal" tabIndex="-1" role="dialog" id={modalId} key={modalId}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.state.writings[0].kanji}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h1>Kanji</h1>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



class ReviewState extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <p className="">Words Content</p>;
  }
}



class LearnState extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <p className="">Words Content</p>;
  }
}



class KanjiState extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <p className="">Words Content</p>;
  }
}



class Kyoushi extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kanjiToLearn: props.kanjiToLearn,
      freshWordsCount: props.freshWordsCount,
      reviewWordsCount: props.reviewWordsCount,
      freshWords: [],
      reviewWords: []
    }

    this.resetUser = props.resetUser;
    this.learnKanjiUrl = props.learnKanjiUrl
    this.freshWordsUrl = props.freshWordsUrl
    this.reviewWordsUrl = props.reviewWordsUrl
    this.learnWordUrl = props.learnWordUrl
    this.ignoreWordUrl = props.ignoreWordUrl

    this.selectKanji = this.selectKanji.bind(this);
    this.learnWord = this.learnWord.bind(this);
    this.ignoreWord = this.ignoreWord.bind(this);
  }

  getRelevantData() {
    if (this.state.freshWordsCount > 0) {
      this.getFreshWords();
    } else if (this.state.reviewWordsCount > 0) {
      this.getReviewWords();
    }
  }

  componentDidMount() {
    this.getRelevantData();
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
      console.log('got review words?')
      this.setState({
        reviewWords: response.entries,
        reviewWordsCount: response.entries.length
      });
    });
  }

  learnWord(event) {
    event.preventDefault();

    let learnedWordId = event.target.id;
    let learnWordUrl = `${this.learnWordUrl}/${learnedWordId}`

    jQuery.post(learnWordUrl, (response) => {
      let newFreshWords = this.state.freshWords.filter((freshWord) => {
        return freshWord._id !== learnedWordId;
      });

      this.setState({
        freshWords: newFreshWords,
        freshWordsCount: newFreshWords.length
      });
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

      this.setState({
        freshWords: newFreshWords,
        freshWordsCount: newFreshWords.length
      });
    });
  }

  getContent() {
    if (this.state.freshWordsCount > 0) {
      return this.state.freshWords.map((freshWord) => {
        return <WordCard
            word={freshWord}
            learnWord={this.learnWord}
            ignoreWord={this.ignoreWord}
            key={freshWord._id} />;
      });
    } else if (this.state.reviewWordsCount > 0) {
      return this.state.reviewWords.map((reviewWord) => {
        return <WordCard word={reviewWord} key={reviewWord._id} review={true} />;
      });
    } else {
      return this.state.kanjiToLearn.map((kanji) => {
        return (
          <button className="btn btn-danger btn-lg m-2" onClick={this.selectKanji} key={kanji}>
            {kanji}
          </button>
        );
      });
    }
  }

  render() {
    console.log('getting content')
    let content = this.getContent();

    return (
      <div>
        <div className="row mt-2">
          <div className="col-12">
            <button className="btn btn-danger" onClick={this.resetUser}>
              Reset User
            </button>
          </div>
        </div>

        <div className="row mt-2">
          {content}
        </div>
      </div>
    );
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
                  resetUser={this.resetUser}
                  freshWordsCount={this.state.user.freshWordsCount}
                  reviewWordsCount={this.state.user.reviewWordsCount}
                  learnKanjiUrl={`http://192.168.57.10:3000/users/${this.state.username}/kanji`}
                  freshWordsUrl={`http://192.168.57.10:3000/users/${this.state.username}/words/fresh`}
                  reviewWordsUrl={`http://192.168.57.10:3000/users/${this.state.username}/words/review`}
                  learnWordUrl={`http://192.168.57.10:3000/users/${this.state.username}/words/learn`}
                  ignoreWordUrl={`http://192.168.57.10:3000/users/${this.state.username}/words/ignore`} />;
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
            notifyItemChange={ this.notifyItemChange } />

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
