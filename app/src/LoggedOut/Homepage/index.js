import React from 'react';
import backgroundImage1 from '../../../assets/bg-1.jpg';
import heartIcon from '../../../assets/heart.svg';
import AuthenticationBox from './AuthenticationBox';
import './index.scss';

const Homepage = props => (
  <div id='lgo-homepage'>
    <img id='lgo-homepage-background' src={backgroundImage1} alt='background' />
    <div id='lgo-homepage-title'>
      <div id='lgo-homepage-title-first'>Matcha</div>
      <div id='lgo-homepage-title-second'>Rencontrez la personne qui partagera votre vie</div>
    </div>
    <AuthenticationBox />
    <div id='lgo-homepage-box'>
      <div id='lgo-homepage-box-title'>
        <img id='lgo-homepage-box-title-icon' src={heartIcon} alt='love' />
        <div id='lgo-homepage-box-title-text'>Le meilleur du matching en ligne</div>
      </div>
      <div id='lgo-homepage-box-subtitle'>De nombreux profils vérifié vous attendent sur Matcha.</div>
      <div id='lgo-homage-box-copyright'>©hpapier 2017-2018</div>
    </div>
  </div>
);

export default Homepage;