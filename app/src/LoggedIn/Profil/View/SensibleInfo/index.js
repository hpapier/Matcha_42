// Modules imports.
import React, { Component } from 'react';


// Locals imports.
import './index.sass';
import Email from './Email';
// import Password from './Password';


// SensibleInfo Component
class SensibleInfo extends Component {
  render() {
    return (
      <div id='lgi-profil-view-sensible'>
        <div id='lgi-profil-view-sensible-header'>confidentialités</div>
        <Email />
        {/* <Password /> */}
      </div>
    );
  }
}


// Exports.
export default SensibleInfo;