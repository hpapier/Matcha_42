import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../Home';
import SettingsBtn from './SettingsBtn';

class RouteLoggedIn extends React.Component {
  render() {
    return(
      <Router>
        <div>
          <SettingsBtn />

          <div>
              <Switch>
                <Route exact path="/" component={Home} />
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