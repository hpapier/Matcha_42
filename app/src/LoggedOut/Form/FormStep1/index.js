import React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { saveUserInfo } from '../../../../store/reducer';

class FormStep1 extends React.Component {
    state = {
      username: this.props.username,
      email: this.props.email
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.username === '') {
          console.log('username non remplie');
        } else {
          this.props.saveUserInfo({ email: this.state.email, username: this.state.username });
        }
    }

    render() {
      console.log('-- PROPS --');
      console.log(this.props);
      return (
          <div id="form-step-1" onSubmit={this.handleSubmit}>
              <form id="form-step-1-form">
                  <label
                    id="form-step-1-form-label-username"
                    htmlFor="logged-out-username-input"
                  >
                    Nom d'utilisateur
                  </label>
                  <input
                    id="form-step-1-form-username"
                    name="logged-out-username-input"
                    type="text"
                    onChange={e => this.setState({ username: e.target.value })}
                    value={this.state.username}
                  />

                  <label
                    id="form-step-1-form-label-email"
                    htmlFor="logged-out-email-input"
                  >
                    Adresse email
                  </label>
                  <input
                    id="form-step-1-form-email"
                    name="logged-out-email-input"
                    type="email"
                    onChange={e => this.setState({ email: e.target.value })}
                    value={this.state.email}
                  />

                  <div id="form-step-1-form-btn">
                      <button
                        id="form-step-1-form-btn-previous"
                        type="button"
                        onClick={this.props.changeState.previous}
                      >
                        Previous
                      </button>
                      <button
                        id="form-step-1-form-btn-submit"
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
  email: state.email,
  username: state.username
});

const mapDispatchToProps = dispatch => ({
  saveUserInfo: info => dispatch(saveUserInfo(info))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormStep1);