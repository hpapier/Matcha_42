import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Homepage from '../../LoggedOut/Homepage';
import ConfirmEmail from '../../LoggedOut/ConfirmEmail';
import SetPassword from '../../LoggedOut/SetPassword';

const LoggedOut = props => (
  <Router>
    <Switch>
      <Route exact path='/' component={() => <Homepage firstRefetch={props.firstRefetch} />} />
      <Route path='/email/:username/:token' component={ConfirmEmail} />
      <Route path='/reset/:token' component={SetPassword} />
      <Route component={() => <div>NOT FOUND</div>} />
    </Switch>
  </Router>
);

export default LoggedOut;