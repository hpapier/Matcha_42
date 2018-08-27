// Modules imports.
import React, { Component } from 'react';


// Locals imports.
import './index.sass';
import Genre from './Genre';
import SexualOrientation from './SexualOrientation';


// Preferences Component
class Preferences extends Component {
  render() {
    return (
      <div id='lgi-profil-view-pref'>
        <div id='lgi-profil-view-pref-header'>préférences</div>
        <Genre />
        <SexualOrientation />
      </div>
    );
  }
}


// Exports.
export default Preferences;