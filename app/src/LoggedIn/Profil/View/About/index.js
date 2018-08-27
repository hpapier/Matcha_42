// Modules imports.
import React, { Component } from 'react';


// Locals imports.
import './index.sass';
import Bio from './Bio';


// About Component
class About extends Component {
  render() {
    return (
      <div id='lgi-profil-view-sensible'>
        <div id='lgi-profil-view-sensible-header'>à propos</div>
        <Bio />
      </div>
    );
  }
}


// Exports.
export default About;