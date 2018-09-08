// Modules imports.
import React from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';


// ProfilSexualOrientation Component.
const ProfilSexualOrientation = props => {
  const { sexualOrientation } = props;
  return (
    <div id='lgi-complete-profil-so'>
      <div id='lgi-complete-profil-so-title'>intéressé par..</div>
      <div id='lgi-complete-profil-so-content'>Le genre {sexualOrientation === 'man' ? 'masculin' : sexualOrientation === 'woman' ? 'féminin' : 'masculin et féminin'}</div>
    </div>
  );
};


// Redux connection.
const mapStateToProps = state => ({
  sexualOrientation: state.currentUserProfilInfo.sexualOrientation
});


// Export.
export default connect(mapStateToProps, null)(ProfilSexualOrientation);