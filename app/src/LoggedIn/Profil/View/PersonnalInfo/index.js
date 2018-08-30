// Modules imports.
import React from 'react';


// Locals imports.
import './index.sass';
import LastName from './LastName';
import FirstName from './FirstName';
import UserName from './UserName';
import Age from './Age';
import Geolocation from './Geolocation';


// PersonnalInfo Component
const PersonnalInfo = props => {
  return (
    <div id='lgi-profil-view-pi'>
      <div id='lgi-profil-view-pi-header'>informations personelles</div>
      <LastName />
      <FirstName />
      <UserName />
      <Age />
      <Geolocation />
    </div>
  );
};


// Export.
export default PersonnalInfo;