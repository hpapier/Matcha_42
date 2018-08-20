import React, { Component } from 'react';
import personIcon from '../../../../../assets/person.svg';
import emailIcon from '../../../../../assets/email.svg';
// import bottomArrowIcon from '../../../../../assets/bottom-arrow.svg';
import lockIcon from '../../../../../assets/lock.svg';
import './index.sass';

class SignIn extends Component {

  dayOption = () => {
    let DAY = [];
    for(let iteration = 1; iteration <= 31; iteration++) {
      DAY.push(iteration);
    }

    return DAY.map(item => (
      <option key={item} value={item} className='lgo-sign-in-box-2-day-select-option'>
        {item}
      </option>
    ));
  }

  monthOption = () => {
    let MONTH = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return MONTH.map(item => (
      <option value={item} key={item} className='lgo-sign-in-box-2-month-select-option'>{item}</option>
    ));
  }

  yearOption = () => {
    let YEAR = [];
    for(let it = 2018; it >= 1900; it--)
      YEAR.push(it);

    return YEAR.map(item => (
      <option value={item} key={item} className='lgo-sign-in-box-2-year-select-option'>{item}</option>
    ));
  }

  render() {
    return (
      <div id='lgo-sign-in'>
        
        <div id='lgo-sign-in-username'>
          <img id='lgo-sign-in-username-icon' src={personIcon} alt='person-icon' />
          <input id='lgo-sign-in-username-input' type='text' placeholder="Nom d'utilisateur" />
        </div>

        <div id='lgo-sign-in-email'>
          <img id='lgo-sign-in-email-icon' src={emailIcon} alt='email-icon' />
          <input id='lgo-sign-in-email-input' type='text' placeholder='Adresse email' />
        </div>

        <div id='lgo-sign-in-box-1'>
          <div id='lgo-sign-in-box-1-lastname'>
            <img id='lgo-sign-in-box-1-lastname-icon' src={personIcon} alt='person-icon' />
            <input id='lgo-sign-in-box-1-lastname-input' type='text' placeholder='Nom' />
          </div>
          <div id='lgo-sign-in-box-1-firstname'>
            <img id='lgo-sign-in-box-1-firstname-icon' src={personIcon} alt='person-icon' />
            <input id='lgo-sign-in-box-1-firstname-input' type='text' placeholder='Prénom' />
          </div>
        </div>

        <div id='lgo-sign-in-box-2'>
          <div id='lgo-sign-in-box-2-day'>
            <select id='lgo-sign-in-box-2-day-select' defaultValue='no-value'>
              <option value='no-value' hidden>Jour</option>
              {this.dayOption()}
            </select>
          </div>
          <div id='lgo-sign-in-box-2-month'>
            <select id='lgo-sign-in-box-2-month-select' defaultValue='no-value'>
              <option value='no-value' hidden>Mois</option>
              {this.monthOption()}
            </select>
          </div>
          <div id='lgo-sign-in-box-2-year'>
            <select id='lgo-sign-in-box-2-year-select' defaultValue='no-value'>
              <option value='no-value' hidden>Année</option>
              {this.yearOption()}
            </select>
          </div>
        </div>

        <div id='lgo-sign-in-box-3'>
          <div id='lgo-sign-in-box-3-genre'>
            <select id='lgo-sign-in-box-3-genre-select' defaultValue='no-value'>
              <option value='no-value' hidden>Genre</option>
              <option value='man' className='lgo-sign-in-box-3-genre-select-option'>Homme</option>
              <option value='woman' className='lgo-sign-in-box-3-genre-select-option'>Femme</option>
            </select>
          </div>
          <div id='lgo-sign-in-box-3-interest'>
            <select id='lgo-sign-in-box-3-interest-select' defaultValue='no-value'>
              <option value='no-value' hidden>Intéressé par..</option>
              <option value='man' className='lgo-sign-in-box-3-interest-select-option'>Homme</option>
              <option value='woman' className='lgo-sign-in-box-3-interest-select-option'>Femme</option>
              <option value='bisexual' className='lgo-sign-in-box-3-interest-select-option'>Homme et Femme</option>
            </select>
          </div>
        </div>

        <div id='lgo-sign-in-password'>
          <img src={lockIcon} alt='lock-icon' id='lgo-sign-in-password-icon' />
          <input type='text' id='lgo-sign-in-password-input' placeholder='Mot de passe' />
        </div>

        <div id='lgo-sign-in-verification'>
          <img src={lockIcon} alt='lock-icon' id='lgo-sign-in-verification-icon' />
          <input type='text' id='lgo-sign-in-verification-input' placeholder='Vérification du mot de passe' />
        </div>

        <button id='lgo-sign-in-submit'>s'inscrire</button>
      </div>
    );
  }
};

export default SignIn;