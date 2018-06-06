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
                    <input id="form-step-3-form-pwd" type="password" onChange={e => this.setState({ password: e.target.value })}/>
                    <input id="form-step-3-form-verif-pwd" type="password" onChange={e => this.setState({ verif: e.target.value })}/>
                    <button type="submit" id="form-step-3-form-submit">Valider</button>
                </form>
                <button id="form-step-3-previous" onClick={this.props.changeState}>Previous</button>
            </div>
        );
    }
}

export default FormStep3;