import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoggedOut from '../LoggedOut';
import EmailValidation from '../EmailValidation';
import ResetPassword from '../ResetPassword';
import { BrowserRouter as Router } from 'react-router-dom';


class RouteLoggedOut extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={LoggedOut} />
            <Route exact path="/email:token" component={EmailValidation} />
            <Route exact path="/reset:token" component={ResetPassword} />
            <Route component={() => (<div>NOT FOUND 404.</div>)} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default RouteLoggedOut;