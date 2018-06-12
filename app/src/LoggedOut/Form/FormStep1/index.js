import React from 'react';
import './index.scss';

class FormStep1 extends React.Component {
    state = {
      username: '',
      email: ''
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.username === '') {
          console.log('username non remplie');
        } else {
          this.props.changeState.next();
        }
    }

    render() {
        return (
            <div id="form-step-1" onSubmit={this.handleSubmit}>
                <form id="form-step-1-form">
                    <label id="form-step-1-form-label-username" htmlFor="logged-out-username-input">Nom d'utilisateur</label>
                    <input id="form-step-1-form-username" name="logged-out-username-input" type="text" onChange={e => this.setState({ username: e.target.value })}/>
                    <label id="form-step-1-form-label-email" htmlFor="logged-out-email-input">Adresse email</label>
                    <input id="form-step-1-form-email" name="logged-out-email-input" type="email" onChange={e => this.setState({ email: e.target.value })}/>
                    <div id="form-step-1-form-btn">
                        <button id="form-step-1-form-btn-previous" type="button" onClick={this.props.changeState.previous}>Previous</button>
                        <button id="form-step-1-form-btn-submit" type="submit">Next</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default FormStep1;