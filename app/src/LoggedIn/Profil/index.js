// Modules imports.
import React, { Component } from 'react';


// Locals imports.
import './index.sass';
import UserBox from '../UserBox';
import ViewPersonnalInfo from './View/PersonnalInfo';
import ViewPreferences from './View/Preferences';
import ViewSensibleInfo from './View/SensibleInfo';
import ViewAbout from './View/About';
import ViewImages from './View/Images';


// Profil Component
class Profil extends Component {
  render() {
    return (
      <div id='lgi-profil'>
        <UserBox />
        <div id='lgi-profil-infobox'>
          <ViewPersonnalInfo />
          <ViewPreferences />
          <ViewSensibleInfo />
          <ViewAbout />
          <ViewImages />
        </div>
      </div>
    );
  }
}


// Exports.
export default Profil;