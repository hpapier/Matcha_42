// Modules imports.
import React from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';


// ProfilGender Component.
const ProfilGender = props => {
  const { gender } = props;
  return (
    <div id='lgi-complete-profil-gender'>
      <div id='lgi-complete-profil-gender-title'>Genre</div>
      <div id='lgi-complete-profil-gender-content'>{gender === 'male' ? 'Masculin' : 'Féminin'}</div>
    </div>
  );
};


// Redux connection.
const mapStateToProps = state => ({
  gender: state.currentUserProfilInfo.genre
});


// Export.
export default connect(mapStateToProps, null)(ProfilGender);