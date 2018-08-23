// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Local import
import './index.sass';
import { FORCE_GEOLOCATION_QUERY } from '../../../query';
import { statusBarMechanism } from '../../../store/action/synchronous';


// Homepage Component
class NotComplete extends Component {
  changeRoute = () => {
    const { history, statusBarMechanism } = this.props;
    history.push('/profil');
    statusBarMechanism('profil');
  }

  render() {
    return (
      <Query query={FORCE_GEOLOCATION_QUERY}>
      {
        () => {
          const { bio, interests, images, location } = this.props;
          return (
            <div id='lgi-not-complete'>
              <div id='lgi-not-complete-title'>Votre profil n'est pas complet.</div>
              <div id='lgi-not-complete-sub-title'>Veuillez le compléter afin d'accéder au matching.</div>
              <div id='lgi-not-complete-text'>({!bio ? `Bio${!interests ? ', ' : ''}` : ''}{!interests ? `tags${!images ? ', ' : ''}` : ''}{!images ? `photos${!location ? ', ' : ''}` : ''}{!location ? `localisation` : ''})</div>
              <div id='lgi-not-complete-btn' onClick={this.changeRoute}>compléter</div>
            </div>
          );
        } 
      }
      </Query>
    );
  }
};


const mapDispatchToProps = dispatch => ({
  statusBarMechanism: status => dispatch(statusBarMechanism(status))
});

// Export.
export default connect(null, mapDispatchToProps)(withRouter(NotComplete));