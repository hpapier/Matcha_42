// Modules imports.
import React from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';


// ProfilTags Component.
const ProfilTags = props => {
  const { tags, interests } = props;
  const tagsList = [];

  tags.forEach(element => {
    interests.forEach(item => {
      if (element.interestId === item.id)
        tagsList.push(item);
    });
  });

  return (
    <div id='lgi-complete-profil-tags'>
      <div id='lgi-complete-profil-tags-title'>tags</div>
      <div id='lgi-complete-profil-tags-content'>
        {tagsList.map(item => <div key={item.id} className='lgi-complete-profil-tags-content-item'>{item.name}</div>)}
      </div>
    </div>
  );
};


// Redux connection.
const mapStateToProps = state => ({
  tags: state.currentUserProfilInfo.tags,
  interests: state.interests
});


// Export.
export default connect(mapStateToProps, null)(ProfilTags);