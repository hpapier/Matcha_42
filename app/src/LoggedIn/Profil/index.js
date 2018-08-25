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
      <div>
        <UserBox />
        <ViewPersonnalInfo />
        <ViewPreferences />
        <ViewSensibleInfo />
        <ViewAbout />
        <ViewImages />
      </div>
    );
  }
}


// Exports.
export default Profil;