// Modules imports.
import React from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import heartIcon from '../../../../../assets/heart-brown.svg';
import eyeIcon from '../../../../../assets/eye.svg';


// ProfilActions Component
const ProfilActions = props => {
  const { actions } = props;
  let visite = false;
  let like = false;

  actions.forEach(element => {
    if (element === 'visite')
      visite = true;
    else if (element === 'like')
      like = true;
  });

  return (
    <div id='lgi-complete-profil-action'>
      <div id='lgi-complete-profil-action-title'>Actions</div>

      {
        like ?
        <div id='lgi-complete-profil-action-like'>
          <img src={heartIcon} alt='like-icon' id='lgi-complete-profil-action-like-icon' />
          <div id='lgi-complete-profil-action-like-text'>Cette personne vous a liké.</div>
        </div> :
        null
      }

      {
        visite ?
        <div id='lgi-complete-profil-action-visite'>
          <img src={eyeIcon} alt='eye-icon' id='lgi-complete-profil-action-visite-icon' />
          <div id='lgi-complete-profil-action-visite-text'>Cette personne a visité votre profil.</div>
        </div> :
        null
      }

      {
        !visite && !like ?
        <div id='lgi-complete-profil-action-empty'>Aucune action récente</div> :
        null
      }
    </div>
  );
};


// Redux connection.
const mapStateToProps = state => ({
  actions: state.currentUserProfilInfo.actions
});


// Export.
export default connect(mapStateToProps, null)(ProfilActions);