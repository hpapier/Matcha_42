// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { FORCE_GEOLOCATION_MUTATION } from '../../../query';
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
      <Mutation mutation={FORCE_GEOLOCATION_MUTATION}>
      {
        forceGeolocation => {
          const { bio, interests, images, location, profilPicture } = this.props.data;
          if (!location)
            forceGeolocation();

          return (
            <div id='lgi-not-complete'>
              <div id='lgi-not-complete-title'>Votre profil n'est pas complet.</div>
              <div id='lgi-not-complete-sub-title'>Veuillez le compléter afin d'accéder au matching.</div>
              <div id='lgi-not-complete-text'>
                {!bio || interests.length === 0 || images.length === 0 || !profilPicture ? '(' : ''}
                {!bio ? `Bio${interests.length === 0 || images.length === 0 || !profilPicture ? ', ' : ''}` : ''}
                {interests.length === 0 ? `tags${images.length === 0 || !profilPicture ? ', ' : ''}` : ''}
                {images.length === 0 ? `photos${ !profilPicture ? ', ' : ''}` : ''}
                {!profilPicture ? 'photo de profil' : ''}
                {!bio || interests.length === 0 || images.length === 0 || !profilPicture ? ')' : ''}
              </div>
              <div id='lgi-not-complete-btn' onClick={this.changeRoute}>compléter</div>
            </div>
          );
        } 
      }
      </Mutation>
    );
  }
};


// Redux connection.
const mapDispatchToProps = dispatch => ({
  statusBarMechanism: status => dispatch(statusBarMechanism(status))
});


// Export.
export default connect(null, mapDispatchToProps)(withRouter(NotComplete));