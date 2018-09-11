// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';


// Local imports.
import personIcon from '../../../../../assets/person.svg';
import emailIcon from '../../../../../assets/email.svg';
import lockIcon from '../../../../../assets/lock.svg';
import './index.sass';
import { SIGN_UP_MUTATION } from '../../../../../query';


// Sign In Component
class SignIn extends Component {
  state = {
    username: '',
    email: '',
    lastname: '',
    firstname: '',
    day: null,
    month: '',
    year: null,
    genre: '',
    interest: '',
    password: '',
    verif: '',
    errorMsg: ''
  };

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

  getCorrectMonth = month => {
    const MONTH = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    let mIndex = 0;
    MONTH.forEach((item, index) => {
      if (item === month)
        mIndex = index;
      return;
    });

    return mIndex;
  }

  checkChar = char => {
    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (char.match(regexp))
      return true;
    return false;
  }

  signUpMechanism = (e, mutation) => {
    e.preventDefault();

    const { username, email, lastname, firstname, day, month, year, genre, interest, password, verif } = this.state;
    if (!username || !email || !lastname || !firstname || !day || !month || !year || !genre || !interest || !password || !verif) {
      this.setState({ errorMsg: 'Veuillez remplir tout les champs. '});
      return;
    }

    if (password === verif && password && verif) {
      if (isNaN(Date.parse(year, this.getCorrectMonth(month), day))) {
        this.setState({ errorMsg: 'Date de naissance invalide' });
        return;
      }

      if (this.checkChar(username) || this.checkChar(lastname) || this.checkChar(firstname) || this.checkChar(password) || this.checkChar(verif)) {
        this.setState({ errorMsg: 'Les caractères spéciaux sont interdits.' });
        return;
      }

      const birthDate = new Date(year, this.getCorrectMonth(month), day);
      const serverGenre = genre === 'Homme' ? 'man' : 'woman';
      const serverInterest = interest === 'Homme' ? 'man' : (interest === 'Femme' ? 'woman' : 'bisexual'); 

      const data = { username, email, lastname, firstname, birthDate, genre: serverGenre, interest: serverInterest, password };

      mutation({ variables: data })
      .then(r => {
        if (r.data.signUpMutation.message === 'Success')
          this.setState({ username: '', email: '', lastname: '', firstname: '', day: null, month: '', year: null, genre: '', interest: '', password: '', verif: '', errorMsg: ''});
      });

      this.setState({ errorMsg: '', password: '', verif: '' });
      return;
    }

    this.setState({ errorMsg: 'Vérification du mot de passe invalide' });
  }

  getCorrectMsg = msg => {
    if (msg === 'Success')
      return 'Votre compte à été créé avec succès';
    else if (msg === 'Username exist')
      return 'Ce nom d\'utilisateur est déjà pris.';
    else if (msg === 'Email exist')
      return 'Cet email existe déjà.';
    else if (msg === 'Email error')
      return 'Cet email est invalide.';
    else
      return 'Erreur de server, veuillez réessayer plus tard.'
  }

  render() {
    const { errorMsg } = this.state;
    return (
      <Mutation mutation={SIGN_UP_MUTATION}>
        {
          (signUpMutation, response) => {
            return (
              <div id='lgo-sign-in'>
                <form onSubmit={e => this.signUpMechanism(e, signUpMutation)} id='lgo-sign-in-form'>
                  <div id='lgo-sign-in-username'>
                    <img id='lgo-sign-in-username-icon' src={personIcon} alt='person-icon' />
                    <input id='lgo-sign-in-username-input' autoComplete='off' type='text' placeholder="Nom d'utilisateur" onChange={e => this.setState({ username: e.target.value })} value={this.state.username} />
                  </div>

                  <div id='lgo-sign-in-email'>
                    <img id='lgo-sign-in-email-icon' src={emailIcon} alt='email-icon' />
                    <input id='lgo-sign-in-email-input' autoComplete='email' type='email' placeholder='Adresse email' onChange={e => this.setState({ email: e.target.value })} value={this.state.email} />
                  </div>

                  <div id='lgo-sign-in-box-1'>
                    <div id='lgo-sign-in-box-1-lastname'>
                      <img id='lgo-sign-in-box-1-lastname-icon' src={personIcon} alt='person-icon' />
                      <input id='lgo-sign-in-box-1-lastname-input' autoComplete='family-name' type='text' placeholder='Nom' onChange={e => this.setState({ lastname: e.target.value })} value={this.state.lastname} />
                    </div>
                    <div id='lgo-sign-in-box-1-firstname'>
                      <img id='lgo-sign-in-box-1-firstname-icon' src={personIcon} alt='person-icon' />
                      <input id='lgo-sign-in-box-1-firstname-input' autoComplete='given-name' type='text' placeholder='Prénom' onChange={e => this.setState({ firstname: e.target.value })} value={this.state.firstname} />
                    </div>
                  </div>

                  <div id='lgo-sign-in-box-2'>
                    <div id='lgo-sign-in-box-2-day'>
                      <select id='lgo-sign-in-box-2-day-select' onChange={e => this.setState({ day: e.target.value })} value={this.state.day || 'no-value'}>
                        <option value='no-value' hidden>Jour</option>
                        {this.dayOption()}
                      </select>
                    </div>
                    <div id='lgo-sign-in-box-2-month'>
                      <select id='lgo-sign-in-box-2-month-select' onChange={e => this.setState({ month: e.target.value })} value={this.state.month || 'no-value'}>
                        <option value='no-value' hidden>Mois</option>
                        {this.monthOption()}
                      </select>
                    </div>
                    <div id='lgo-sign-in-box-2-year'>
                      <select id='lgo-sign-in-box-2-year-select' onChange={e => this.setState({ year: e.target.value })} value={this.state.year || 'no-value'}>
                        <option value='no-value' hidden>Année</option>
                        {this.yearOption()}
                      </select>
                    </div>
                  </div>

                  <div id='lgo-sign-in-box-3'>
                    <div id='lgo-sign-in-box-3-genre'>
                      <select id='lgo-sign-in-box-3-genre-select' onChange={e => this.setState({ genre: e.target.value })} value={this.state.genre || 'no-value'}>
                        <option value='no-value' hidden>Genre</option>
                        <option value='man' className='lgo-sign-in-box-3-genre-select-option'>Homme</option>
                        <option value='woman' className='lgo-sign-in-box-3-genre-select-option'>Femme</option>
                      </select>
                    </div>
                    <div id='lgo-sign-in-box-3-interest'>
                      <select id='lgo-sign-in-box-3-interest-select' onChange={e => this.setState({ interest: e.target.value })} value={this.state.interest || 'no-value'}>
                        <option value='no-value' hidden>Intéressé par..</option>
                        <option value='man' className='lgo-sign-in-box-3-interest-select-option'>Homme</option>
                        <option value='woman' className='lgo-sign-in-box-3-interest-select-option'>Femme</option>
                        <option value='bisexual' className='lgo-sign-in-box-3-interest-select-option'>Homme et Femme</option>
                      </select>
                    </div>
                  </div>

                  <div id='lgo-sign-in-password'>
                    <img src={lockIcon} alt='lock-icon' id='lgo-sign-in-password-icon' />
                    <input type='password' autoComplete='new-password' id='lgo-sign-in-password-input' placeholder='Mot de passe' onChange={e => this.setState({ password: e.target.value })} value={this.state.password} />
                  </div>

                  <div id='lgo-sign-in-verification'>
                    <img src={lockIcon} alt='lock-icon' id='lgo-sign-in-verification-icon' />
                    <input type='password' autoComplete='new-password' id='lgo-sign-in-verification-input' placeholder='Vérification du mot de passe' onChange={e => this.setState({ verif: e.target.value })} value={this.state.verif} />
                  </div>

                  {
                    !response.loading ?
                    <button id='lgo-sign-in-submit' onClick={e => this.signUpMechanism(e, signUpMutation)}>s'inscrire</button> :
                    <div id='lgo-sign-in-loading-box'>
                      <div id='lgo-sign-in-loading-box-animation'></div>
                    </div>
                  }
                  { response.error && !errorMsg ? <div className='lgo-sign-in-error-msg'>{(typeof response.error === 'object') ? 'Server error' : response.error}</div> : null }
                  { errorMsg ? <div className='lgo-sign-in-error-msg'>{errorMsg}</div> : null }
                  { response.data && !errorMsg ? <div className={response.data.signUpMutation.message !== 'Success' ? 'lgo-sign-in-error-msg' : 'lgo-sign-in-success-msg'}>{this.getCorrectMsg(response.data.signUpMutation.message)}</div> : null }
                </form>
              </div>
            );
          }
        }
      </Mutation>
    );
  }
};


// Exports.
export default SignIn;