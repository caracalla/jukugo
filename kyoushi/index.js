var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Navbar = function (_React$Component) {
  _inherits(Navbar, _React$Component);

  function Navbar(props) {
    _classCallCheck(this, Navbar);

    var _this = _possibleConstructorReturn(this, (Navbar.__proto__ || Object.getPrototypeOf(Navbar)).call(this, props));

    _this.items = props.items;

    _this.state = {
      activeItem: props.activeItem
    };

    _this.notifyItemChange = props.notifyItemChange;
    _this.setActiveItem = _this.setActiveItem.bind(_this);
    return _this;
  }

  _createClass(Navbar, [{
    key: 'setActiveItem',
    value: function setActiveItem(event) {
      event.preventDefault();

      var activeItem = event.target.innerHTML;

      this.notifyItemChange(activeItem);
      this.setState({ activeItem: activeItem });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var navItems = this.items.map(function (item) {
        var li_class = _this2.state.activeItem === item ? 'nav-item active' : 'nav-item';

        return React.createElement(
          'li',
          { className: li_class, key: item },
          React.createElement(
            'a',
            { href: '#',
              className: 'nav-link',
              onClick: _this2.setActiveItem },
            item
          )
        );
      });

      return React.createElement(
        'nav',
        { className: 'navbar navbar-expand navbar-dark bg-danger' },
        React.createElement(
          'a',
          { href: '#', className: 'navbar-brand' },
          'Jukugo'
        ),
        React.createElement(
          'div',
          { className: '', id: 'navbar-collapsible-content' },
          React.createElement(
            'ul',
            { className: 'navbar-nav' },
            navItems
          )
        )
      );
    }
  }]);

  return Navbar;
}(React.Component);

var Sagasu = function (_React$Component2) {
  _inherits(Sagasu, _React$Component2);

  function Sagasu(props) {
    _classCallCheck(this, Sagasu);

    return _possibleConstructorReturn(this, (Sagasu.__proto__ || Object.getPrototypeOf(Sagasu)).call(this, props));
  }

  _createClass(Sagasu, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'p',
        { className: '' },
        'Words Content'
      );
    }
  }]);

  return Sagasu;
}(React.Component);

var Kyoushi = function (_React$Component3) {
  _inherits(Kyoushi, _React$Component3);

  function Kyoushi(props) {
    _classCallCheck(this, Kyoushi);

    var _this4 = _possibleConstructorReturn(this, (Kyoushi.__proto__ || Object.getPrototypeOf(Kyoushi)).call(this, props));

    _this4.state = {
      kanji: [],
      newWords: [],
      learnedWords: [],
      ignoredWords: [],
      username: 'james' // FIXME
    };

    _this4.selectKanji = _this4.selectKanji.bind(_this4);
    _this4.resetUser = _this4.resetUser.bind(_this4);
    _this4.learnWord = _this4.learnWord.bind(_this4);
    _this4.ignoreWord = _this4.ignoreWord.bind(_this4);
    return _this4;
  }

  _createClass(Kyoushi, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getUser(this.state.username);
    }
  }, {
    key: 'getUser',
    value: function getUser(name) {
      var _this5 = this;

      var userUrl = 'http://192.168.57.10:3000/users/' + this.state.username;

      jQuery.get(userUrl, function (response) {
        var user = response.user;
        var wordsUrl = 'http://192.168.57.10:3000/users/' + _this5.state.username + '/words';

        jQuery.get(wordsUrl, function (response) {
          _this5.setState({
            username: user.name,
            kanji: kanjiByGrade.grade1.filter(function (kanji) {
              return !user.kanji.includes(kanji);
            }),
            newWords: response.newEntries,
            learnedWords: response.learnedEntries,
            ignoredWords: response.ignoredEntries
          });
        });
      });
    }
  }, {
    key: 'selectKanji',
    value: function selectKanji(event) {
      var _this6 = this;

      event.preventDefault();

      var kanji = event.target.innerHTML;
      var kanjiUrl = 'http://192.168.57.10:3000/users/' + this.state.username + '/kanji';

      jQuery.post(kanjiUrl, { kanji: kanji }, function (response) {
        _this6.getUser(_this6.state.username);
      });
    }
  }, {
    key: 'learnWord',
    value: function learnWord(event) {
      var _this7 = this;

      event.preventDefault();

      var wordId = event.target.id;
      var learnUrl = 'http://192.168.57.10:3000/users/' + this.state.username + '/words/learn/' + wordId;

      jQuery.post(learnUrl, function (response) {
        _this7.getUser(_this7.state.username);
      });
    }
  }, {
    key: 'ignoreWord',
    value: function ignoreWord(event) {
      var _this8 = this;

      event.preventDefault();

      var wordId = event.target.id;
      var ignoreUrl = 'http://192.168.57.10:3000/users/' + this.state.username + '/words/ignore/' + wordId;

      jQuery.post(ignoreUrl, function (response) {
        _this8.getUser(_this8.state.username);
      });
    }
  }, {
    key: 'resetUser',
    value: function resetUser(event) {
      var _this9 = this;

      event.preventDefault();

      var url = 'http://192.168.57.10:3000/users/' + this.state.username + '/resetUser';

      jQuery.post(url, function (response) {
        _this9.getUser(_this9.state.username);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this10 = this;

      var kanjiButtons = this.state.kanji.map(function (kanji) {
        return React.createElement(
          'button',
          { className: 'btn btn-danger btn-lg m-1', onClick: _this10.selectKanji, key: kanji },
          kanji
        );
      });

      var wordCards = this.state.newWords.map(function (word) {
        return React.createElement(
          'div',
          { className: 'col-lg-3 col-md-4 col-sm-6 mt-2', key: word._id },
          React.createElement(
            'div',
            { className: 'card' },
            React.createElement(
              'div',
              { className: 'card-body' },
              React.createElement(
                'h1',
                { className: 'card-title text-center' },
                word.writings[0].kanji
              ),
              React.createElement(
                'p',
                { className: 'card-text' },
                word.senses[0].translations[0].glossaries[0]
              ),
              React.createElement(
                'button',
                {
                  id: word._id,
                  className: 'btn btn-danger',
                  onClick: _this10.learnWord },
                'Learn'
              ),
              React.createElement(
                'button',
                {
                  id: word._id,
                  className: 'btn btn-outline-danger float-right',
                  onClick: _this10.ignoreWord },
                'Ignore'
              )
            )
          )
        );
      });

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-12' },
            React.createElement(
              'nav',
              { className: 'nav nav-pills nav-justified' },
              React.createElement(
                'a',
                { className: 'nav-item nav-link active bg-danger', href: '#' },
                'Active'
              ),
              React.createElement(
                'a',
                { className: 'nav-item nav-link text-danger', href: '#' },
                'Link'
              ),
              React.createElement(
                'a',
                { className: 'nav-item nav-link text-danger', href: '#' },
                'Link'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'row mt-2' },
          React.createElement(
            'div',
            { className: 'col-12' },
            React.createElement(
              'button',
              { className: 'btn btn-danger', onClick: this.resetUser },
              'Reset User'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'row mt-2' },
          wordCards
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'row mt-2' },
          React.createElement(
            'div',
            { className: 'col-12' },
            React.createElement(
              'h1',
              null,
              'Learn New Kanji'
            ),
            kanjiButtons
          )
        )
      );
    }
  }]);

  return Kyoushi;
}(React.Component);

// class ProfileContent extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return <p className="display-1">Profile Content</p>;
//   }
// }


var Jukugo = function (_React$Component4) {
  _inherits(Jukugo, _React$Component4);

  function Jukugo(props) {
    _classCallCheck(this, Jukugo);

    var _this11 = _possibleConstructorReturn(this, (Jukugo.__proto__ || Object.getPrototypeOf(Jukugo)).call(this, props));

    _this11.navbarItems = ['Sagasu', 'Kyoushi'];

    _this11.state = {
      activeItem: props.activeItem || _this11.navbarItems[1]
    };

    _this11.notifyItemChange = _this11.notifyItemChange.bind(_this11);
    return _this11;
  }

  _createClass(Jukugo, [{
    key: 'notifyItemChange',
    value: function notifyItemChange(item) {
      this.setState({ activeItem: item });
    }
  }, {
    key: 'getContent',
    value: function getContent(activeItem) {
      switch (activeItem) {
        case 'Sagasu':
          {
            return React.createElement(Sagasu, null);
            break;
          }
        case 'Kyoushi':
          {
            return React.createElement(Kyoushi, null);
            break;
          }
        // case 'Profile': {
        //   return <ProfileContent />;
        //   break;
        // }
        default:
          {
            return React.createElement(
              'p',
              { className: 'display-1' },
              '404'
            );
            break;
          }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var content = this.getContent(this.state.activeItem);

      return React.createElement(
        'div',
        null,
        React.createElement(Navbar, {
          items: this.navbarItems,
          activeItem: this.state.activeItem,
          notifyItemChange: this.notifyItemChange }),
        React.createElement(
          'div',
          { className: 'mt-2 container' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-12' },
              content
            )
          )
        )
      );
    }
  }]);

  return Jukugo;
}(React.Component);

$("document").ready(function () {
  var domContainer = document.querySelector('#react-root');

  ReactDOM.render(React.createElement(Jukugo, null), domContainer);
});