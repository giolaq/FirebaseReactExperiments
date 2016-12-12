import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import shuffle from 'lodash/shuffle';
import throttle from 'lodash/throttle';

import articles from '../data/articles';

import FlipMove from 'react-flip-move';
import Toggle from './Toggle.jsx';

import ReactMixin from 'react-mixin';

var users = [];

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
};


class ListItem extends Component {
  render() {
    const listClass = `list-item card ${this.props.view}`;
    const style = { zIndex: 100 - this.props.index };

    return (
      <li id={this.props.id} className={listClass} style={style}>
        <h3>{this.props.name}</h3>
        <img src={this.props.imgUrl} className="cat-img" />
        <h5>Coins {this.props.coins} K €</h5>
        <h5>Hearts {this.props.hearts} H €</h5>
      </li>
    );
  }
};


class Shuffle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removedArticles: [],
      view: 'list',
      order: 'asc',
      sortingMethod: 'chronological',
      enterLeaveAnimation: 'accordianVertical',
      articles,
      users
    };

    this.toggleList = this.toggleList.bind(this);
    this.toggleGrid = this.toggleGrid.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
    this.sortRotate = this.sortRotate.bind(this);
    this.sortShuffle = this.sortShuffle.bind(this);
  }

  componentWillMount() {
  var ref = firebase.database().ref("teams");
  this.bindAsArray(ref, "articles");
  var refusers = firebase.database().ref("users");
  this.bindAsArray(refusers, "users");

  //ref.on('value', function(dataSnapshot) {
  //    this.sortShuffle();
  //   }.bind(this));

 refusers.on('value', function(dataSnapshot) {
      this.sortTeams(dataSnapshot);
    }.bind(this));


  }

  sortTeams(dataSnapshot) {
    var currentUsers = dataSnapshot.val();
    var teamsValues = {};
    //Loop in users
    for ( var key in currentUsers ) {
      if (currentUsers.hasOwnProperty(key)) {
        //loop in scores
        for ( var keyScore in currentUsers[key]["scores"] ) {
          if (currentUsers[key]["scores"].hasOwnProperty(keyScore)) {
            if (keyScore in teamsValues) {
              teamsValues[keyScore].hearts += currentUsers[key]["scores"][keyScore]["hearts"];
              teamsValues[keyScore].coins += currentUsers[key]["scores"][keyScore]["coins"];
            } else {
              teamsValues[keyScore] = { "hearts" : currentUsers[key]["scores"][keyScore]["hearts"],
              "coins" : currentUsers[key]["scores"][keyScore]["coins"]};
            }

          }
        }

      }
    }

    var indexOf = function(key, items) {
      var i = 0;
      var len = items.length;
      for (i = 0; i < len; i++) {
        if (key === items[i][".key"]) {
          return i;
        }
      }
      return -1;
    }
    console.log(teamsValues);

   for ( key in teamsValues) {
     if (teamsValues.hasOwnProperty(key)) {

      var idx = indexOf(key, this.state.articles);
      console.log("key " + key);

      console.log(teamsValues[key]);
      this.state.articles[idx].hearts = teamsValues[key].hearts;
      this.state.articles[idx].coins = teamsValues[key].coins;
    }
   }

    this.sortShuffle();

  }

  componentWillUnmount() {
  this.firebaseRef.off();
  }

  toggleList() {
    this.setState({
      view: 'list',
      enterLeaveAnimation: 'accordianVertical'
    });
  }

  toggleGrid() {
    this.setState({
      view: 'grid',
      enterLeaveAnimation: 'accordianHorizontal'
    });
  }


  toggleSort() {
    const sortAsc = (a, b) => a.coins - b.coins;
    const sortDesc = (a, b) => b.coins - a.coins;

    this.setState({
      order: (this.state.order === 'asc' ? 'desc' : 'asc'),
      sortingMethod: 'chronological',
      articles: this.state.articles.sort(
        this.state.order === 'asc' ? sortDesc : sortAsc
      )
    });
  }

  sortShuffle() {
    //this.state.articles[getRandomInt(0, this.state.articles.length)].investment =
    //getRandomInt(10, 1000);
    console.log(this.state.articles);

    const sortDesc = (a, b) => b.coins - a.coins;

    this.setState({
      sortingMethod: 'shuffle',
      articles: this.state.articles.sort(sortDesc)

    });
  }

  moveArticle(source, dest, id) {
    const sourceArticles = this.state[source].slice();
    let destArticles = this.state[dest].slice();

    if ( !sourceArticles.length ) return;

    // Find the index of the article clicked.
    // If no ID is provided, the index is 0
    const i = id ? sourceArticles.findIndex(article => article.id === id) : 0;

    // If the article is already removed, do nothing.
    if ( i === -1 ) return;

    destArticles = [].concat( sourceArticles.splice(i, 1), destArticles );

    this.setState({
      [source]: sourceArticles,
      [dest]: destArticles,
    });
  }

  sortRotate() {
    const articles = this.state.articles.slice();
    articles.unshift(articles.pop())

    this.setState({
      sortingMethod: 'rotate',
      articles
    });
  }

  renderArticles() {
    return this.state.articles.map( (article, i) => {
      return (
        <ListItem
          key={article.id}
          view={this.state.view}
          index={i}
          clickHandler={throttle(() => this.moveArticle('articles', 'removedArticles', article.id), 800)}
          {...article}
        />
      );
    });
  }

  render() {
    return (
      <div id="shuffle" className={this.state.view}>
        <header>
          <div className="abs-left">
            <Toggle
              clickHandler={this.toggleList}
              text="List" icon="list"
              active={this.state.view === 'list'}
            />
            <Toggle
              clickHandler={this.toggleGrid}
              text="Grid" icon="th"
              active={this.state.view === 'grid'}
            />
          </div>
          <div className="abs-right">

            <Toggle
              clickHandler={this.sortShuffle}
              text="Random Vote" icon="random"
              active={this.state.sortingMethod === 'shuffle'}
            />

          </div>
        </header>
        <div>
          <FlipMove
            staggerDurationBy="30"
            duration={500}
            enterAnimation={this.state.enterLeaveAnimation}
            leaveAnimation={this.state.enterLeaveAnimation}
            typeName="ul"
          >
            { this.renderArticles() }

          </FlipMove>
        </div>
      </div>
    );
  }
};

ReactMixin(Shuffle.prototype, ReactFireMixin);


export default Shuffle;
