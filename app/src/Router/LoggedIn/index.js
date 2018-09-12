// Modules imports.
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


// Local import.
import Navbar from '../../LoggedIn/Navbar';
import Homepage from '../../LoggedIn/Homepage';
import Profil from '../../LoggedIn/Profil';
import Notification from '../../LoggedIn/Notification';
import UserLike from '../../LoggedIn/UserLike';
// import UserVisite from '../../LoggedIn/UserVisite';
// import UserMatch from '../../LoggedIn/UserMatch';


// LoggedIn Router Component.
const LoggedIn = props => {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Homepage} />
          <Route exact path='/notification' component={Notification} />
          <Route exact path='/user/like' component={UserLike}/>
          {/* <Route exact path='/user/visite' component={UserVisite}/>
          <Route exact path='/user/match' component={UserMatch}/> */}
          <Route exact path='/message' component={() => <div>messages</div>} />
          <Route exact path='/profil' component={() => <Profil />} />
        </Switch>
      </div>
    </Router>
  );
};


// Export.
export default LoggedIn;