import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoggedIn from '../LoggedIn';
import SettingsBtn from './SettingsBtn';

class RouteLoggedIn extends React.Component {
  state = {};

  render() {
    return(
      <Router>
        <div>
          <SettingsBtn />

          <div>
              <Switch>
                <Route exact path="/" component={LoggedIn} />
                <Route component={() => <div>Lol</div>} />
              </Switch>
          </div>

          <div>
            footer
          </div>
        </div>
      </Router>
    );
  }
}

export default RouteLoggedIn;