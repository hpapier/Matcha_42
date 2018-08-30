// Modules imports.
import React from 'react';
import { Query } from 'react-apollo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';


// Local import.
import { GET_USER_INFO_QUERY } from '../../../query';
import Navbar from '../../LoggedIn/Navbar';
import NotComplete from '../../LoggedIn/NotComplete';
import Homepage from '../../LoggedIn/Homepage';
import Profil from '../../LoggedIn/Profil';
import { updateRefetch } from '../../../store/action/synchronous';

// LoggedIn Router Component
const LoggedIn = props => {
  return (
    <Router>
      <div>
        <Navbar logoutRefetch={props.firstRefetch} />
        <Switch>
          <Route exact path='/' component={() => <Homepage logoutRefetch={props.firstRefetch} />} />
          <Route exact path='/notification' component={() => <div>notifications</div>} />
          <Route exact path='/message' component={() => <div>messages</div>} />
          <Route exact path='/profil' component={() => <Profil logoutRefetch={props.firstRefetch} />} />
        </Switch>
      </div>
    </Router>
  );
}

const mapStateToProps = state => ({
  refetching: state.refetching
});

const mapDispatchToProps = dispatch => ({
  updateRefetch: bool => dispatch(updateRefetch(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoggedIn);