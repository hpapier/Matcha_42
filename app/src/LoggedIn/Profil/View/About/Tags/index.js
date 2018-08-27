// Modules imports.
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { ADD_TAGS_MUTATION } from '../../../../../../query';
import { REMOVE_TAGS_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateUserInterestsMechanism } from '../../../../../../store/action/synchronous';


// Tags Component
class Tags extends Component {
  state = {
    modifActive: false,
    isLoading: false,
    tagsInput: '',
    errorMsg: ''
  };

  getTags = () => {
    const { tagsInput } = this.state;

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (tagsInput.match(regexp))
      return <div>Caractères spéciaux interdits.</div>;

    if (!tagsInput)
      return null;

    const { interests } = this.props;
    const listInterest = interests.filter(item => item.name.match(tagsInput));
    if (listInterest.length > 0)
      return <div>{listInterest[0]}</div>
    else
      return <div className='lgi-profil-view-about-tags-box1-result'>Créer le tag  "{tagsInput}"</div>
  }

  displayTags = () => {
    const { userTags, interests } = this.props;
    if (userTags.length === 0)
      return <div className='lgi-profil-view-about-tags-box1-tags-content-empty'>Aucuns tags..</div>
    
    let tags = [];
    interests.forEach(item => {
      userTags.forEach(el => {
        if (el.interestId === item.id)
          tags.push(item);
        return;
      });
      return;
    });

    if (tags.length > 0)
      return tags.map(item => ( <div key={item.id}>{item.name}</div> ));
    else
      return <div className='lgi-profil-view-about-tags-box1-tags-content-empty'>Aucuns tags..</div>;
  }

  render() {
    const { modifActive, isLoading, tagsInput, errorMsg } = this.state;
    return (
      <ApolloConsumer>
      {
        client => {
          return (
            <div id='lgi-profil-view-about-tags'>
              <div id='lgi-profil-view-about-tags-box1'>
                <div id='lgi-profil-view-about-tags-box1-title'>tags</div>
                <div>
                  { modifActive ? 
                    <div>
                      <input type='text' id='lgi-profil-view-about-tags-box1-input' value={tagsInput} onChange={e => this.setState({ tagsInput: e.target.value })} placeholder='Saisissez un tag..' />
                      {this.getTags()}
                    </div> :
                    null
                  }
                  <div id='lgi-profil-view-about-tags-box1-tags'>{this.displayTags()}</div>
                </div>
              </div>

              <div id='lgi-profil-view-about-tags-box2'>
                {
                  isLoading ?
                  <div>loading</div> :
                    !modifActive ?
                    <button
                      onClick={() => this.setState({ modifActive: true, tagsInput: '', errorMsg: '' })}
                      id='lgi-profil-view-about-tags-box2-edit'
                    >
                      <img src={editIcon} alt='edit' id='lgi-profil-view-about-tags-box2-edit-icon' />
                    </button> :
                    <button
                      onClick={() => this.setState({ modifActive: false, tagsInput: '', errorMsg: '' })}
                      id='lgi-profil-view-about-tags-box2-edit'
                    >
                      <img src={cancelIcon} alt='edit' id='lgi-profil-view-about-tags-box2-edit-icon' />
                    </button>
                }
              </div>
            </div>
          );
        }
      }
      </ApolloConsumer>
    );
  }
}


const mapStateToProps = state => ({
  userTags: state.user.userTags,
  interests: state.interests
});


// Export.
export default connect(mapStateToProps, null)(Tags);