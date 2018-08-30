// Modules imports.
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


// Local import.
import Navbar from '../../LoggedIn/Navbar';
import Homepage from '../../LoggedIn/Homepage';
import Profil from '../../LoggedIn/Profil';


// LoggedIn Router Component.
const LoggedIn = props => {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route exact path='/' component={() => <Homepage />} />
          <Route exact path='/notification' component={() => <div>notifications</div>} />
          <Route exact path='/message' component={() => <div>messages</div>} />
          <Route exact path='/profil' component={() => <Profil />} />
        </Switch>
      </div>
    </Router>
  );
};


// Export.
export default LoggedIn;