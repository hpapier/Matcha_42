import React from 'react';
import './index.scss';

class FormStep1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: ''
        };
    }
    
    render() {
        return (
            <div id="form-step-1">
                <form>
                    <input id="form-step-1-username" type="text" onChange={e => this.setState({ username: e.target.value })}/>
                    <input id="form-step-1-email" type="email" onChange={e => this.setState({ email: e.target.value })}/>
                    <button id="form-step-1-next" type="submit" onClick={this.props.changeState.next}>Next</button>
                </form>
                <button id="form-step-1-previous" onClick={this.props.changeState.previous}>Previous</button>
            </div>
        );
    }
}

export default FormStep1;