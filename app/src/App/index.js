import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logUserIn } from '../../store/reducer';
import LoggedOut from '../LoggedOut';
import LoggedIn from '../LoggedIn';
import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log('PRINCIPAL COMPONENT:');
    // console.log('--- STATE ---');
    // console.log(this.state);
    // console.log('--- PROPS ---');
    // console.log(this.props);
    // console.log('----------------');
    return (
      <div>
        { this.props.isLoggedIn ? <LoggedIn /> : <LoggedOut />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn
});

export default connect(mapStateToProps)(App);