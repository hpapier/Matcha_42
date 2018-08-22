import React from 'react';
import backgroundImage1 from '../../../assets/bg-1.jpg';
import './index.sass';

const NotFound = props => {
  return (
    <div id='lgo-notfound'>
      <img id='lgo-notfound-background' src={backgroundImage1} alt='background' />
      <div id='lgo-notfound-filter'></div>
      <div id='lgo-notfound-title'>
        <div id='lgo-notfound-title-first'>404</div>
        <div id='lgo-notfound-title-second'>vous êtes perdu ?</div>
      </div>
    </div>
  );
}

export default NotFound;