// Modules imports.
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { ADD_TAGS_MUTATION } from '../../../../../../query';
import { REMOVE_TAGS_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import whiteCancelIcon from '../../../../../../assets/white-cancel.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateInterest, updateUserTags, clearStore } from '../../../../../../store/action/synchronous';


// Tags Component
class Tags extends Component {
  state = {
    modifActive: false,
    isLoading: false,
    tagsInput: '',
    errorMsg: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  addTag = (client, tag, exist) => {
    const { userTags, interests } = this.props;
    let isPresent = false;
    let gTag;
    if (exist) {
      userTags.forEach(item => {
        if (tag.id === item.interestId)
          isPresent = true;
      });
    }

    if (isPresent) {
      this.setState({ tagsInput: '', errorMsg: '' });
      return;
    }

    if (exist)
      gTag = tag.name;
    else {
      gTag = tag;
    } 

    this.setState({ isLoading: true, errorMsg: '' });
    client.mutate({
      mutation: ADD_TAGS_MUTATION,
      variables: { tag: gTag }
    })
    .then(r => {
      if (!this._unmount) {
        this.props.updateInterest(r.data.addTagToUser.userTags, r.data.addTagToUser.interests);
        this.setState({ isLoading: false, tagsInput: '', errorMsg: '' });
      }
    })
    .catch(error => {
      if (error.graphQLErrors && error.graphQLErrors[0]) {
        if (error.graphQLErrors[0].message === 'Not auth') {
          this.client.resetStore()
            .then(r => { return; })
            .catch(e => { return; })
          localStorage.removeItem('auth_token');
          this.props.clearStore();
          this.props.history.push('/');
        }
      }

      if (!this._unmount) {
        const { message } = error.graphQLErrors[0];
        if (message === 'Character string too long')
          this.setState({ modifActive: true, isLoading: false, errorMsg: 'Maximum 255 caractères.' });
        else if (message === 'Contains invalid char')
          this.setState({ modifActive: true, isLoading: false, errorMsg: 'Caractères spéciaux interdits.' });
        else
          this.setState({ modifActive: true, isLoading: false, errorMsg: 'Oups! Une erreur est survenue..' });
      }
    });
  }

  deleteTag = (tag, client) => {
    this.setState({ isLoading: true, errorMsg: '' });
    client.mutate({
      mutation: REMOVE_TAGS_MUTATION,
      variables: { tag: tag.id }
    })
    .then(r => {
      if (!this._unmount) {
        this.props.updateUserTags(r.data.removeTagToUser);
        this.setState({ isLoading: false, errorMsg: '' });
      }
    })
    .catch(error => {
      if (error.graphQLErrors && error.graphQLErrors[0]) {
        if (error.graphQLErrors[0].message === 'Not auth') {
          this.client.resetStore()
            .then(r => { return; })
            .catch(e => { return; })
          localStorage.removeItem('auth_token');
          this.props.clearStore();
          this.props.history.push('/');
        }
      }

      if (!this._unmount) {
        this.setState({ modifActive: true, isLoading: false, errorMsg: 'Oups! Une erreur est survenue..' });
      }
    });
  }

  getTags = client => {
    const { tagsInput } = this.state;

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (tagsInput.match(regexp))
      return <div className='lgi-profil-view-about-tags-error'>Caractères spéciaux interdits.</div>;

    if (!tagsInput)
      return null;

    const { interests } = this.props;
    const listInterest = interests.filter(item => item.name.match(tagsInput));
    if (listInterest.length > 0)
      return <div className='lgi-profil-view-about-tags-box1-result' onClick={() => this.addTag(client, listInterest[0], 1)}>#{listInterest[0].name}</div>
    else
      return <div className='lgi-profil-view-about-tags-box1-result' onClick={() => this.addTag(client, tagsInput, 0)}>Créer le tag  "{tagsInput}"</div>
  }

  displayTags = client => {
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
      return tags.map(item => (
        <div className='lgi-profil-view-about-tags-box1-tags-content' key={item.name}>
          {item.name}
          <button className='lgi-profil-view-about-tags-box1-tags-content-btn' onClick={() => this.deleteTag(item, client)}>
            <img src={whiteCancelIcon} alt='white-cancel-icon' />
          </button>
        </div> ));
    else
      return <div className='lgi-profil-view-about-tags-box1-tags-content-empty'>Aucuns tags..</div>;
  }

  render() {
    const { modifActive, isLoading, tagsInput, errorMsg } = this.state;
    return (
      <ApolloConsumer>
      {
        client => {
          this.client = client;
          return (
            <div id='lgi-profil-view-about-tags'>
              <div id='lgi-profil-view-about-tags-box1'>
                <div id='lgi-profil-view-about-tags-box1-title'>tags</div>
                <div>
                  { modifActive ? 
                    <div>
                      <input autoFocus type='text' id='lgi-profil-view-about-tags-box1-input' value={tagsInput} onChange={e => this.setState({ tagsInput: e.target.value })} placeholder='Saisissez un tag..' />
                      {this.getTags(client)}
                    </div> :
                    null
                  }
                  <div id='lgi-profil-view-about-tags-box1-tags'>{this.displayTags(client)}</div>
                  { errorMsg ? <div className='lgi-profil-view-about-tags-error'>{errorMsg}</div> : null }
                </div>
              </div>

              <div id='lgi-profil-view-about-tags-box2'>
                {
                  isLoading ?
                  <div className='lgi-profil-view-about-tags-loading'></div> :
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

const mapDispatchToPropss = dispatch => ({
  updateInterest: (userTags, interests) => dispatch(updateInterest(userTags, interests)),
  updateUserTags: tags => dispatch(updateUserTags(tags)),
  clearStore: () => dispatch(clearStore())
});


// Export.
export default connect(mapStateToProps, mapDispatchToPropss)(withRouter(Tags));