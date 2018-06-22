import React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { saveUserInfo } from '../../../../store/reducer';

class FormStep2 extends React.Component {
    state = {
      firstname: this.props.firstname,
      lastname: this.props.lastname,
      day: this.props.day,
      month: this.props.month,
      year: this.props.year,
      genre: this.props.genre,
      sexualOrientation: this.props.sexualOrientation
    };

    day = () => {
      let i = 1;
      let array = []; 
      while (i <= 31) {
        array.push(i);
        i++;
      }
      return array.map(item => <option value={item} key={item}>{item}</option>);
    }

    month = () => {
      const month = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre'];
      return month.map(item => (<option key={item} value={item}>{item}</option>));
    }

    year = () => {
      let i = 2018;
      let array = [];
      while(i >= 1918) {
        array.push(i);
        i--;
      }
      return array.map(i => <option value={i} key={i}>{i}</option>);
    }

    genre = () => {
      let array = ['Tu es..', 'Homme', 'Femme'];
      return array.map(i => <option value={i} key={i}>{i}</option>);
    }

    search = () => {
      let array = ['Selectionner', 'Homme', 'Femme', 'Autre'];
      return array.map(i => <option value={i} key={i}>{i}</option>);
    }

    handleSubmit = e => {
      e.preventDefault();
      if (this.state.firstname === '') {
        console.log('NOP');
      } else {
        const info = {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          day: this.state.day,
          month: this.state.month,
          year: this.state.year,
          genre: this.state.genre,
          sexualOrientation: this.state.sexualOrientation
        };
        this.props.saveUserInfo(info);
        this.props.changeState.next();
      }
    }
    
    render() {
        return (
            <div id="form-step-2" onSubmit={this.handleSubmit}>
                <form id="form-step-2-form">
                    <div id="form-step-2-form-group-1">
                      <div id="form-step-2-form-group-1-box-1">
                        <label
                          id="form-step-2-form-group-1-label-firstname"
                          htmlFor="logged-out-firstname-input"
                        >
                          Prénom
                        </label>
                        <input
                          id="form-step-2-form-group-1-firstname"
                          name="logged-out-firstname-input"
                          type="text"
                          onChange={e => this.setState({ firstname: e.target.value })}
                          value={this.state.firstname}
                        />
                      </div>
                      <div id="form-step-2-form-group-1-box-2">
                        <label
                          id="form-step-2-form-group-1-label-lastname"
                          htmlFor="logged-out-lastname-input"
                        >
                          Nom
                        </label>
                        <input
                          id="form-step-2-form-group-1-lastname"
                          name="logged-out-lastname-input"
                          type="text"
                          onChange={e => this.setState({ lastname: e.target.value })}
                          value={this.state.lastname}
                        />
                      </div>
                    </div>
                    <div id="form-step-2-form-group-2">
                        <p id="form-step-2-form-group-2-title">Date de naissance</p>
                        <select
                          id="form-step-2-form-group-2-day"
                          onChange={e => this.setState({ day: e.target.value })}
                          value={this.state.day}
                        >
                          {this.day()}
                        </select>
                        <select
                          id="form-step-2-form-group-2-month"
                          onChange={e => this.setState({ month: e.target.value })}
                          value={this.state.month}
                        >
                          {this.month()}
                        </select>
                        <select
                          id="form-step-2-form-group-2-year"
                          onChange={e => this.setState({ year: e.target.value })}
                          value={this.state.year}
                        >
                          {this.year()}
                        </select>
                    </div>
                    <div id="form-step-2-form-group-3">
                      <div id="form-step-2-form-group-3-box-1">
                        <p id="form-step-2-form-group-3-genre-title">Sexe</p>
                        <select
                          id="form-step-2-form-group-3-genre"
                          type="text"
                          onChange={e => this.setState({ genre: e.target.value })}
                          value={this.state.genre}
                        >
                          {this.genre()}
                        </select>
                      </div>
                      <div id="form-step-2-form-group-3-box-2">
                        <p id="form-step-2-form-group-3-lookingFor-title">Tu es ici pour...</p>
                        <select
                          id="form-step-2-form-group-3-lookingFor"
                          type="text"
                          onChange={e => this.setState({ sexualOrientation: e.target.value })}
                          value={this.state.sexualOrientation}
                        >
                          {this.search()}
                        </select>
                      </div>
                    </div>
                    <div id="form-step-2-form-group-4">
                      <button 
                        id="form-step-2-previous"
                        type="button"
                        onClick={this.props.changeState.previous}
                      >
                        Previous
                      </button>
                      <button
                        id="form-step-2-form-submit"
                        type="submit"
                      >
                        Next
                      </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
  firstname: state.firstname,
  lastname: state.lastname,
  day: state.day,
  month: state.month,
  year: state.year,
  genre: state.genre,
  sexualOrientation: state.sexualOrientation
});

const mapDispatchToProps = dispatch => ({
  saveUserInfo: info => dispatch(saveUserInfo(info))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormStep2);