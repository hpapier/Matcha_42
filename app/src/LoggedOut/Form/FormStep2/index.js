import React from 'react';
import './index.scss';

class FormStep2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            day: '',
            month: '',
            year: '',
            genre: '',
            lookingFor: ''
        };

        this.day = this.day.bind(this);
        this.month = this.month.bind(this);
        this.year = this.year.bind(this);
        this.genre = this.genre.bind(this);
        this.search = this.search.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    day() {
      let i = 1;
      let array = []; 
      while (i <= 31) {
        array.push(i);
        i++;
      }
      return array.map(item => <option value={item} key={item}>{item}</option>);
    }

    month() {
      const month = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre'];
      return month.map(item => (<option key={item} value={item}>{item}</option>));
    }

    year() {
      let i = 2018;
      let array = [];
      while(i >= 1918) {
        array.push(i);
        i--;
      }
      return array.map(i => <option value={i} key={i}>{i}</option>);
    }

    genre() {
      let array = ['Tu es..', 'Homme', 'Femme'];
      return array.map(i => <option value={i} key={i}>{i}</option>);
    }

    search() {
      let array = ['Selectionner', 'Homme', 'Femme', 'Autre'];
      return array.map(i => <option value={i} key={i}>{i}</option>);
    }

    handleSubmit(e) {
      e.preventDefault();
      this.props.changeState.next();
    }
    
    render() {
      console.log(this.state);
        return (
            <div id="form-step-2" onSubmit={this.handleSubmit}>
                <form id="form-step-2-form">
                    <div id="form-step-2-form-group-1">
                      <div id="form-step-2-form-group-1-box-1">
                        <label id="form-step-2-form-group-1-label-firstname" htmlFor="logged-out-firstname-input">Prénom</label>
                        <input id="form-step-2-form-group-1-firstname" name="logged-out-firstname-input" type="text" onChange={e => this.setState({ firstname: e.target.value })}/>
                      </div>
                      <div id="form-step-2-form-group-1-box-2">
                        <label id="form-step-2-form-group-1-label-lastname" htmlFor="logged-out-lastname-input">Nom</label>
                        <input id="form-step-2-form-group-1-lastname" name="logged-out-lastname-input" type="text" onChange={e => this.setState({ lastname: e.target.value })}/>
                      </div>
                    </div>
                    <div id="form-step-2-form-group-2">
                        <p id="form-step-2-form-group-2-title">Date de naissance</p>
                        <select id="form-step-2-form-group-2-day" onChange={e => this.setState({ day: e.target.value })}>
                          {this.day()}
                        </select>
                        <select id="form-step-2-form-group-2-month" onChange={e => this.setState({ month: e.target.value })}>
                          {this.month()}
                        </select>
                        <select id="form-step-2-form-group-2-year" onChange={e => this.setState({ year: e.target.value })}>
                          {this.year()}
                        </select>
                    </div>
                    <div id="form-step-2-form-group-3">
                      <div id="form-step-2-form-group-3-box-1">
                        <p id="form-step-2-form-group-3-genre-title">Sexe</p>
                        <select id="form-step-2-form-group-3-genre" type="text" onChange={e => this.setState({ genre: e.target.value })}>
                          {this.genre()}
                        </select>
                      </div>
                      <div id="form-step-2-form-group-3-box-2">
                        <p id="form-step-2-form-group-3-lookingFor-title">Tu es ici pour...</p>
                        <select id="form-step-2-form-group-3-lookingFor" type="text" onChange={e => this.setState({ lookingFor: e.target.value })}>
                          {this.search()}
                        </select>
                      </div>
                    </div>
                    <div id="form-step-2-form-group-4">
                      <button id="form-step-2-previous" type="button" onClick={this.props.changeState.previous}>Previous</button>
                      <button id="form-step-2-form-submit" type="submit">Next</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default FormStep2;