// Modules imports.
import React from 'react';
import { connect } from 'react-redux';


// Local import
import './index.sass';
import UserBox from '../UserBox';
import Search from './Search';
import Filtre from './Filtre';
import RandomChoice from './RandomChoice';


// Complete Component.
const Complete = props => {
  const { statusView } = props;
  return (
    <div id='lgi-complete'>
      <div id='lgi-complete-left-box'>
        <UserBox />
        {
          statusView !== 'profil' ?
          <div id='lgi-complete-left-box-btn'>
            <Search />
            <Filtre />
          </div> :
          null
        }
      </div>

      <div id='lgi-complete-right-box'>
      {
        statusView !== 'profil' ?
        <div>
          <RandomChoice />
          <div>Visited</div>
          <div>Liked by</div>
          <div>like</div>
        </div> :
        <div>
          Profil
        </div>
      }
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  statusView: state.homepage.statusView
})

// Export
export default connect(mapStateToProps, null)(Complete);
