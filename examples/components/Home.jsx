import React, { Component, PropTypes }  from 'react';
import classNames                       from 'classnames';
import { Link }                         from 'react-router';

import Toggle from './Toggle.jsx';


const Home = () => (
  <div id="home">
    <header className="title">
      <h2>Perla Nera</h2>
    </header>

    <div className="text-right">
      <Link to='/shuffle' className="button-toggle large active icon-right">
        <i className="fa fa-fw fa-angle-right" />
        Pitch Day Top 10 Coins
      </Link>
    </div>
    <div className="text-right">
      <Link to='/shuffle_hearts' className="button-toggle large active icon-right">
        <i className="fa fa-fw fa-angle-right" />
        Pitch Day Top 10 Hearts
      </Link>
    </div>
    <div className="text-right">
      <Link to='/shuffle_stars' className="button-toggle large active icon-right">
        <i className="fa fa-fw fa-angle-right" />
        Pitch Day Top 10 Stars
      </Link>
    </div>
  </div>
);

export default Home;
