import React from 'react';
import { Route, Link } from 'react-router-dom';
import LoggedOut from '../LoggedOut';
import EmailValidation from '../EmailValidation';
import ResetPassword from '../ResetPassword';

class RouteLoggedOut extends React.Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={LoggedOut} />
        <Route path="/email:token" component={EmailValidation} />
        <Route exact path="/reset:token" component={ResetPassword} />
      </div>
    );
  }
}

export default RouteLoggedOut;