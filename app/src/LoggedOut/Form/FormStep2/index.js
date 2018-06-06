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
    }

    day() {

    }

    month() {
      const month = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre'];
      return month.map(item => (<option key={item} value={item}>{item}</option>));
    }

    year() {

    }
    
    render() {
      console.log(this.state);
        return (
            <div id="form-step-2">
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
                        <select id="form-step-2-form-group-3-genre" type="text" onChange={e => this.setState({ genre: e.target.value })}>
                          {this.genre()}
                        </select>
                        <select id="form-step-2-form-group-3-lookingFor" type="text" onChange={e => this.setState({ lookingFor: e.target.value })}>
                          {this.search()}
                        </select>
                    </div>
                    <div id="form-step-2-form-group-4">
                      <button id="form-step-2-form-submit" type="submit" onClick={this.props.changeState.next}>Next</button>
                      <button id="form-step-2-previous" onClick={this.props.changeState.previous}>Previous</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default FormStep2;