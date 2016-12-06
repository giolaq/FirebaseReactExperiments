import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import shuffle from 'lodash/shuffle';
import throttle from 'lodash/throttle';

import articles from '../data/articles';

import FlipMove from 'react-flip-move';
import Toggle from './Toggle.jsx';

import ReactMixin from 'react-mixin';

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
        <img src={this.props.img} className="cat-img" />
        <h5>{moment(this.props.timestamp).format('MMM Do, YYYY')}</h5>
        <h5>Investment {this.props.investment} K €</h5>
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
      articles
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

  ref.on('value', function(dataSnapshot) {
      this.sortShuffle();
     }.bind(this));


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
    const sortAsc = (a, b) => a.investment - b.investment;
    const sortDesc = (a, b) => b.investment - a.investment;

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

    const sortDesc = (a, b) => b.investment - a.investment;

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
