import React from 'react';
import './index.scss';

class FormStep3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            verif: ''
        };
    }
    
    render() {
        return (
            <div id="form-step-3">
                <form id="form-step-3-form">
                  <div id="form-step-3-form-box-1">
                    <label id="form-step-3-form-pwd-title">Mot de passe</label>
                    <input id="form-step-3-form-pwd" type="password" onChange={e => this.setState({ password: e.target.value })}/>
                  </div>
                  <div id="form-step-3-form-box-2">
                    <label id="form-step-3-form-verif-pwd-title">Vérification du mot de passe</label>
                    <input id="form-step-3-form-verif-pwd" type="password" onChange={e => this.setState({ verif: e.target.value })}/>
                  </div>
                  <div id="form-step-3-form-box-3">
                    <button id="form-step-3-previous" type="button" onClick={this.props.changeState}>Previous</button>
                    <button id="form-step-3-submit" type="submit">Valider</button>
                  </div>
                </form>
            </div>
        );
    }
}

export default FormStep3;