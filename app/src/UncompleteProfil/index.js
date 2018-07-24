import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const UncompleteProfil = () => (
      <div id="uncomplete-profil">
        <p id="uncomplete-profil-txt">Veuillez completer votre profil avant de pouvoir rencontrer de nouvelles personnes.</p>
        <Link id="uncomplete-profil-btn" to="/profil">Completer</Link>
      </div>
);

export default UncompleteProfil;