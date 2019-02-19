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



class Sagasu extends React.Component {
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
      kanji: [],
      newWords: [],
      learnedWords: [],
      ignoredWords: [],
      username: 'james' // FIXME
    }

    this.selectKanji = this.selectKanji.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.learnWord = this.learnWord.bind(this);
    this.ignoreWord = this.ignoreWord.bind(this);
  }

  componentDidMount() {
    this.getUser(this.state.username);
  }

  getUser(name) {
    const userUrl = `http://192.168.57.10:3000/users/${this.state.username}`;

    jQuery.get(userUrl, (response) => {
      let user = response.user;
      let wordsUrl = `http://192.168.57.10:3000/users/${this.state.username}/words`;

      jQuery.get(wordsUrl, (response) => {
        this.setState({
          username: user.name,
          kanji: kanjiByGrade.grade1.filter((kanji) => {
            return !user.kanji.includes(kanji);
          }),
          newWords: response.newEntries,
          learnedWords: response.learnedEntries,
          ignoredWords: response.ignoredEntries
        });
      });
    });
  }

  selectKanji(event) {
    event.preventDefault();

    let kanji = event.target.innerHTML;
    let kanjiUrl = `http://192.168.57.10:3000/users/${this.state.username}/kanji`;

    jQuery.post(kanjiUrl, {kanji: kanji}, (response) => {
      this.getUser(this.state.username);
    });
  }

  learnWord(event) {
    event.preventDefault();

    let wordId = event.target.id;
    let learnUrl = `http://192.168.57.10:3000/users/${this.state.username}/words/learn/${wordId}`;

    jQuery.post(learnUrl, (response) => {
      this.getUser(this.state.username);
    });
  }

  ignoreWord(event) {
    event.preventDefault();

    let wordId = event.target.id;
    let ignoreUrl = `http://192.168.57.10:3000/users/${this.state.username}/words/ignore/${wordId}`;

    jQuery.post(ignoreUrl, (response) => {
      this.getUser(this.state.username);
    });
  }

  resetUser(event) {
    event.preventDefault();

    let url = `http://192.168.57.10:3000/users/${this.state.username}/resetUser`;

    jQuery.post(url, (response) => {
      this.getUser(this.state.username);
    });
  }

  render() {
    let kanjiButtons = this.state.kanji.map((kanji) => {
      return (
        <button className="btn btn-danger btn-lg m-1" onClick={this.selectKanji} key={kanji}>
          {kanji}
        </button>
      );
    });

    let wordCards = this.state.newWords.map((word) => {
      return (
        <div className="col-lg-3 col-md-4 col-sm-6 mt-2" key={word._id}>
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">{word.writings[0].kanji}</h1>

              <p className="card-text">
                {word.senses[0].translations[0].glossaries[0]}
              </p>

              <button
                  id={word._id}
                  className="btn btn-danger"
                  onClick={this.learnWord}>
                Learn
              </button>

              <button
                  id={word._id}
                  className="btn btn-outline-danger float-right"
                  onClick={this.ignoreWord}>
                Ignore
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <div className="row">
          <div className="col-12">
            <nav className="nav nav-pills nav-justified">
              <a className="nav-item nav-link active bg-danger" href="#">Active</a>
              <a className="nav-item nav-link text-danger" href="#">Link</a>
              <a className="nav-item nav-link text-danger" href="#">Link</a>
            </nav>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <button className="btn btn-danger" onClick={this.resetUser}>
              Reset User
            </button>
          </div>
        </div>

        <div className="row mt-2">
          {wordCards}
        </div>

        <hr />

        <div className="row mt-2">
          <div className="col-12">
            <h1>Learn New Kanji</h1>
            {kanjiButtons}
          </div>
        </div>
      </div>
    );
  }
}



// class ProfileContent extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return <p className="display-1">Profile Content</p>;
//   }
// }



class Jukugo extends React.Component {
  constructor(props) {
    super(props);

    this.navbarItems = ['Sagasu', 'Kyoushi'];

    this.state = {
      activeItem: props.activeItem || this.navbarItems[1]
    };

    this.notifyItemChange = this.notifyItemChange.bind(this);
  }

  notifyItemChange(item) {
    this.setState({ activeItem: item });
  }

  getContent(activeItem) {
    switch(activeItem) {
      case 'Sagasu': {
        return <Sagasu />;
        break;
      }
      case 'Kyoushi': {
        return <Kyoushi />;
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
