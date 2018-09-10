// Modules imports.
import React from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';


// View Component.
const View = props => {
  const { visitorList } = props;
  return (
    <div id='lgi-complete-visitedby-view'>
    <div id='lgi-complete-visitedby-view-title'>Visites reçu</div>
    {
      visitorList.length === 0 ?
      <div id='lgi-complete-visitedby-view-empty'>Aucune personnes ont visité votre profil</div> :
      visitorList.map(item => (
        <div key={item.id} className='lgi-complete-visitedby-view-item'>
          <div className='lgi-complete-visitedby-view-item-img'></div>
          <div className='lgi-complete-visitedby-view-item'>{item.username}</div>
          <div>Like</div>
          <div>{item.popularityScore}</div>
        </div>
      ))
    }
    </div>
  );
};


// Redux connection.
const mapStateToProps = state => ({
  visitorList: state.visitorList
});


// Export.
export default connect(mapStateToProps, null)(View);