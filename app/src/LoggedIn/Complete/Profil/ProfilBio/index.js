// Modules imports.
import React from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';


// ProfilBio Component.
const ProfilBio = props => {
  const { bio } = props;
  return (
    <div id='lgi-complete-profil-bio'>
      <div id='lgi-complete-profil-bio-title'>Bio</div>
      <div id='lgi-complete-profil-bio-content'>{bio}</div>
    </div>
  );
};


// Redux connection.
const mapStateToProps = state => ({
  bio: state.currentUserProfilInfo.bio
});


// Export.
export default connect(mapStateToProps, null)(ProfilBio);