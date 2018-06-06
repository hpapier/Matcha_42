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
    }
    
    render() {
        return (
            <div id="form-step-2">
                <form id="form-step-2-form">
                    <div id="form-step-2-form-group-1">
                        <input id="form-step-2-form-group-1-firstname" type="text" onChange={e => this.setState({ firstname: e.target.value })}/>
                        <input id="form-step-2-form-group-1-lastname" type="text" onChange={e => this.setState({ lastname: e.target.value })}/>
                    </div>
                    <div id="form-step-2-form-group-2">
                        <input id="form-step-2-form-group-2-day" type="text" onChange={e => this.setState({ day: e.target.value })}/>
                        <input id="form-step-2-form-group-2-month" type="text" onChange={e => this.setState({ month: e.target.value })}/>
                        <input id="form-step-2-form-group-2-year" type="text" onChange={e => this.setState({ year: e.target.value })}/>
                    </div>
                    <div id="form-step-2-form-group-3">
                        <input id="form-step-2-form-group-3-genre" type="text" onChange={e => this.setState({ genre: e.target.value })}/>
                        <input id="form-step-2-form-group-3-lookingFor" type="text" onChange={e => this.setState({ lookingFor: e.target.value })}/>
                    </div>
                    <button id="form-step-2-form-submit" type="submit" onClick={this.props.changeState.next}>Next</button>
                </form>
                <button id="form-step-2-previous" onClick={this.props.changeState.previous}>Previous</button>
            </div>
        );
    }
}

export default FormStep2;