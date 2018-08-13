import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Profil from '../Profil';
import LoggedInNavbar from './LoggedInNavbar';

class RouteLoggedIn extends React.Component {
  render() {
    return(
      <Router>
        <div>
          <LoggedInNavbar />

          <div>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/profil" component={Profil} />
                <Route exact path="/msg" component={() => (<div>Message Component</div>)} />
                <Route component={() => <div>Lol</div>} />
              </Switch>
          </div>

          <div>
            footer
            <SubTest />
          </div>
        </div>
      </Router>
    );
  }
}

export default RouteLoggedIn;