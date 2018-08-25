// Modules imports.
import React from 'react';
import { Query } from 'react-apollo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


// Local import.
import { GET_USER_INFO_QUERY } from '../../../query';
import Navbar from '../../LoggedIn/Navbar';
import NotComplete from '../../LoggedIn/NotComplete';
import Homepage from '../../LoggedIn/Homepage';
import Profil from '../../LoggedIn/Profil';

// LoggedIn Router Component
const LoggedIn = props => (
  <Query query={GET_USER_INFO_QUERY}>
  {
    ({ loading, error, data }) => {
      console.log('Rendering');
        
      const getComponent = () => {
        if (loading)
          return <div>Loading....</div>;

        if (!error) {
          const { bio, interests, images, location } = data.userInformations;
          if (!bio || !interests || !images || !location)
            return <NotComplete data={{ bio, interests, images, location }} />
          else
            return <Homepage />
        }

        if (error) {
          localStorage.removeItem('auth_token');
          props.firstRefetch();
          return null;
        }
      }

      return (
        <Router>
          <div>
            <Navbar loading={loading} firstRefetch={props.firstRefetch} data={data.userInformations} />
            <Switch>
              <Route exact path='/' component={getComponent} />
              { !loading ? <Route exact path='/notification' component={() => <div>notifications</div>} /> : null }
              { !loading ? <Route exact path='/message' component={() => <div>messages</div>} /> : null }
              { !loading ? <Route exact path='/profil' component={Profil} /> : null }
            </Switch>
          </div>
        </Router>
      );
    }
  } 
  </Query>
);

export default LoggedIn;