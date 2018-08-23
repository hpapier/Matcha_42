// Modules imports.
import React from 'react';
import { Query } from 'react-apollo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

// Local import.
import { GET_USER_INFO_QUERY } from '../../../query';
import { saveUserInfo } from '../../../store/action/synchronous';
import Navbar from '../../LoggedIn/Navbar';
import NotComplete from '../../LoggedIn/NotComplete';
import Homepage from '../../LoggedIn/Homepage';

// LoggedIn Router Component
const LoggedIn = props => (
  <Query query={GET_USER_INFO_QUERY}>
  {
    ({ loading, error, data }) => {
      console.log('Rendering');

      if (!loading && data && !error)
        props.saveUserInfo(data.userInformations);
        
      const getComponent = () => {
        if (loading)
          return <div>Loading....</div>;

        if (!error) {
          const { bio, interests, images, location } = data.userInformations;
          if (!bio || !interests || !images || !location)
            return <NotComplete />
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
        <div>
          <Navbar loading={loading} />
          <Router>
            <Switch>
              <Route exact path='/' component={getComponent} />
              { !loading ? <Route exact path='/notification' component={() => <div>notifications</div>} /> : null }
              { !loading ? <Route exact path='/message' component={() => <div>messages</div>} /> : null }
              { !loading ? <Route exact path='/profil' component={() => <div>profil</div>} /> : null }
            </Switch>
          </Router>
        </div>
      );
    }
  } 
  </Query>
);

const mapDispatchToProps = dispatch => ({
  saveUserInfo: data => dispatch(saveUserInfo(data))
});

export default connect(null, mapDispatchToProps)(LoggedIn);