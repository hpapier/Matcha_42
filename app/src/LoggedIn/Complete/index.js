// Modules imports.
import React from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import UserBox from '../UserBox';
import Search from './Search';
import Filtre from './Filtre';
import RandomChoice from './RandomChoice';
import Profil from './Profil';
import VisitedBy from './VisitedBy';
import UserLike from '../UserLike';
import UserVisite from '../UserVisite';
import UserMatch from '../UserMatch';
import LikedBy from './LikedBy';


// Complete Component.
const Complete = props => {
  const { statusView } = props;
  return (
    <div id='lgi-complete'>
      <div id='lgi-complete-left-box'>
        <UserBox />
        <div id='lgi-complete-left-box-btn'>
          { statusView === 'suggestion' || statusView === 'search' ? <Search /> : null }
          { statusView !== 'profil' ? <Filtre /> : null }
        </div>
      </div>

      <div id='lgi-complete-right-box'>
      {
        statusView === 'suggestion' || statusView === 'search' ?
        <div id='lgi-complete-right-subbox'>
          <RandomChoice />
          <VisitedBy />
          <LikedBy />
        </div> :
        null
      }

      { statusView === 'profil' ? <Profil /> : null }
      { statusView === 'like' ? <UserLike /> : null }
      { statusView === 'visite' ? <UserVisite /> : null }
      { statusView === 'match' ? <UserMatch /> : null }
      </div>
    </div>
  );
}


// Redux connection.
const mapStateToProps = state => ({
  statusView: state.homepage.statusView
})


// Export.
export default connect(mapStateToProps, null)(Complete);
