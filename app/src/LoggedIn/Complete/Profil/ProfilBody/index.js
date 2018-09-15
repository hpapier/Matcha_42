// Modules imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import matchIcon from '../../../../../assets/match.svg';
import closeIcon from '../../../../../assets/close-white.svg';
import { cleanUserProfil, clearStore, changeLikeStatusOfUserProfil, changeBlockStatusForProfilUser, changeMatchStatusOfUserProfil } from '../../../../../store/action/synchronous';
import likeWhiteIcon from '../../../../../assets/heart-white.svg';
import likeBrownIcon from '../../../../../assets/heart-brown.svg';
import scoreWhiteIcon from '../../../../../assets/cup-white.svg';
import msgWhiteIcon from '../../../../../assets/msg-sending.svg';
import flagIconWhite from '../../../../../assets/flag.svg';
import nonBlockWhiteIcon from '../../../../../assets/non-block.svg';
import blockIcon from '../../../../../assets/block.svg';
import closeBlackIcon from '../../../../../assets/close-black.svg';
import { BLOCK_USER_MUTATION, UNBLOCK_USER_MUTATION, REPORT_USER_MUTATION, LIKE_USER_MUTATION, UNLIKE_USER_MUTATION, SEND_MSG_MUTATION } from '../../../../../query';


// ProfilImg Component.
class ProfilBody extends Component {
  state = {
    blockLoading: false,
    modalReport: false,
    modalReportLoading: false,
    modalReportErrorMsg: '',
    modalMsg: false,
    modalMsgLoading: false,
    modalMsgErrorMsg: '',
    modalMsgInput: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  getLocationName = (location) => {
    const locationName = JSON.parse(location).formatedName;
    const locArr = locationName.split(',');

    return `${locArr[0]}, ${locArr[1]}, ${locArr[2]}`;
  }

  blockUserMechanism = () => {
    const { client } = this;
    const { id, isBlocked } = this.props.information;

    if (!this._unmount)
      this.setState({ blockLoading: true });

    if (!isBlocked) {
      client.mutate({
        mutation: BLOCK_USER_MUTATION,
        variables: { userId: id }
      })
      .then(r => {
        if (!this._unmount) {
          this.setState({ blockLoading: false });
          this.props.changeBlockStatusForProfilUser();
        }
      })
      .catch(error => {
        if (error.graphQLErrors && error.graphQLErrors[0]) {
          if (error.graphQLErrors[0].message === 'Not auth') {
            client.resetStore()
              .then(r => { return; })
              .catch(r => { return; });
            localStorage.removeItem('auth_token');
            this.props.clearStore();
            this.props.history.push('/');
          }
        }

        if (!this._unmount)
          this.setState({ blockLoading: false });
      });
    } else {

      client.mutate({
        mutation: UNBLOCK_USER_MUTATION,
        variables: { userId: id }
      })
      .then(r => {
        if (!this._unmount) {
          this.setState({ blockLoading: false });
          this.props.changeBlockStatusForProfilUser();
        }
      })
      .catch(error => {
        if (error.graphQLErrors && error.graphQLErrors[0]) {
          if (error.graphQLErrors[0].message === 'Not auth') {
            client.resetStore()
              .then(r => { return; })
              .catch(r => { return; });
            localStorage.removeItem('auth_token');
            this.props.clearStore();
            this.props.history.push('/');
          }
        }

        if (!this._unmount)
          this.setState({ blockLoading: false });
      });
    }
  }

  likeMechanism = () => {
    const { client } = this;
    const { id, isLiked } = this.props.information;

    if (!isLiked) {
      client.mutate({
        mutation: LIKE_USER_MUTATION,
        variables: { userId: id }
      })
      .then(r => {
        if (!this._unmount) {
          this.props.changeLikeStatusOfUserProfil();
          this.props.changeMatchStatusOfUserProfil(r.data.likeUser.isMatched);
        }
      })
      .catch(error => {
        if (error.graphQLErrors && error.graphQLErrors[0]) {
          if (error.graphQLErrors[0].message === 'Not auth') {
            client.resetStore()
              .then(r => { return; })
              .catch(r => { return; });
            localStorage.removeItem('auth_token');
            this.props.clearStore();
            this.props.history.push('/');
          }
        }
      });

    } else {
      client.mutate({
        mutation: UNLIKE_USER_MUTATION,
        variables: { userId: id }
      })
      .then(r => {
        if (!this._unmount) {
          this.props.changeLikeStatusOfUserProfil();
          this.props.changeMatchStatusOfUserProfil(r.data.unlikeUser.isMatched);
        }
      })
      .catch(error => {
        if (error.graphQLErrors && error.graphQLErrors[0]) {
          if (error.graphQLErrors[0].message === 'Not auth') {
            client.resetStore()
              .then(r => { return; })
              .catch(r => { return; });
            localStorage.removeItem('auth_token');
            this.props.clearStore();
            this.props.history.push('/');
          }
        }
      });
    }
  }

  reportMechanism = () => {
    const { client } = this;
    const { id } = this.props.information;

    if (!this._unmount)
      this.setState({ modalReportLoading: true, modalReportErrorMsg: '' });

    client.mutate({
      mutation: REPORT_USER_MUTATION,
      variables: { userId: id }
    })
    .then(r => {
      if (!this._unmount)
        this.setState({ modalReportLoading: false, modalReport: false, modalReportErrorMsg: '' });
    })
    .catch(error => {
      if (error.graphQLErrors && error.graphQLErrors[0]) {
        if (error.graphQLErrors[0].message === 'Not auth') {
          client.resetStore()
            .then(r => { return; })
            .catch(r => { return; });
          localStorage.removeItem('auth_token');
          this.props.clearStore();
          this.props.history.push('/');
        }
      }

      if (!this._unmount)
        this.setState({ modalReportLoading: false, modalReport: true, modalReportErrorMsg: 'Oups! Une erreur est survenu.' });
    });
  }

  msgMechanism = () => {
    const { client } = this;
    const { id } = this.props.information;

    if (!this._unmount) {
      if (!this.state.modalMsgInput) {
        this.setState({ modalMsgErrorMsg: 'Vous ne pouvez pas envoyer de message vide !' });
        return;
      }
      this.setState({ modalMsgLoading: true, modalMsgErrorMsg: '' });
    }

    client.mutate({
      mutation: SEND_MSG_MUTATION,
      variables: { toUser: id, content: this.state.modalMsgInput }
    })
    .then(r => {
      if (!this._unmount)
        this.setState({ modalMsgLoading: false, modalMsg: false, modalMsgErrorMsg: '', modalMsgInput: '' });
    })
    .catch(error => {
      if (error.graphQLErrors && error.graphQLErrors[0]) {
        if (error.graphQLErrors[0].message === 'Not auth') {
          client.resetStore()
            .then(r => { return; })
            .catch(r => { return; });
          localStorage.removeItem('auth_token');
          this.props.clearStore();
          this.props.history.push('/');
        }
      }

      if (!this._unmount)
        this.setState({ modalMsgLoading: false, modalMsg: true, modalMsgErrorMsg: 'Oups! Une erreur est survenu.' });
    });
  }

  render() {
    const { information } = this.props;
    const { isLiked, isBlocked } = information;
    const { blockLoading, modalReport, modalReportLoading, modalReportErrorMsg, modalMsg, modalMsgLoading, modalMsgErrorMsg } = this.state;
    return (
      <ApolloConsumer>
      {
        client => {
          this.client = client;
          return (
            <div id='lgi-complete-profil-body'>
              <div id='lgi-complete-profil-body-close'>
                <img id='lgi-complete-profil-body-close-icon' src={closeIcon} alt='close' onClick={this.props.cleanUserProfil} />
              </div>
      
              {
                information.isMatched ?
                <div id='lgi-complete-profil-body-match'>
                  <img id='lgi-complete-profil-body-match-icon' src={matchIcon} alt='match-icon' />
                  <div id='lgi-complete-profil-body-match-text'>Vous avez matché avec cette personne</div>
                </div> :
                <div id='lgi-complete-profil-body-match-empty'></div>
              }
      
              <div id='lgi-complete-profil-body-user'>
                <div id='lgi-complete-profil-body-user-lastconnexion'>Dernière connexion il y a {information.lastConnexion}</div>
                <div id='lgi-complete-profil-body-user-username'>
                  <div id='lgi-complete-profil-body-user-username-text'>{information.username}</div>
                  <div id={ information.isConnected ? 'lgi-complete-profil-body-user-username-co-status-active' : 'lgi-complete-profil-body-user-username-co-status-inactive' }></div>
                </div>
                <div id='lgi-complete-profil-body-user-info'>{information.age} ans - {this.getLocationName(information.location)}</div>
              </div>
      
              <div id='lgi-complete-profil-body-cta'>
                <div id='lgi-complete-profil-body-cta-left'>
                  <div id={!isLiked ? 'lgi-complete-profil-body-cta-left-like' : 'lgi-complete-profil-body-cta-left-like-liked'} onClick={this.likeMechanism}>
                    <img id='lgi-complete-profil-body-cta-left-like-icon' src={!isLiked ? likeWhiteIcon : likeBrownIcon} alt='like-icon' />
                  </div>
      
                  <div id='lgi-complete-profil-body-cta-left-score'>
                    <img id='lgi-complete-profil-body-cta-left-score-icon' src={scoreWhiteIcon} alt='score-icon' />
                    <div id='lgi-complete-profil-body-cta-left-score-score'>{information.popularityScore}</div>
                  </div>
      
                  {
                    information.isMatched ?
                    <div id='lgi-complete-profil-body-cta-left-msg' onClick={() => this.setState({ modalMsg: true })}>
                      <img id='lgi-complete-profil-body-cta-left-msg-icon' src={msgWhiteIcon} alt='msg-icon'/>
                    </div> :
                    null
                  }
                </div>
      
                <div id='lgi-complete-profil-body-cta-right'>
                  <button id={!isBlocked ? 'lgi-complete-profil-body-cta-right-block' : 'lgi-complete-profil-body-cta-right-block-blocked'} disabled={blockLoading} onClick={this.blockUserMechanism}>
                    <img src={!isBlocked ? nonBlockWhiteIcon : blockIcon} alt='block-icon' id='lgi-complete-profil-body-cta-right-block-icon' />
                    <div id='lgi-complete-profil-body-cta-right-block-text'>{isBlocked ? 'débloquer' : 'bloquer'}</div>
                  </button>
      
                  <button id='lgi-complete-profil-body-cta-right-report' onClick={() => this.setState({ modalReport: true })}>
                    <img src={flagIconWhite} alt='report-icon' id='lgi-complete-profil-body-cta-right-report-icon' />
                    <div id='lgi-complete-profil-body-cta-right-report-text'>signaler</div>
                  </button>
                </div>
              </div>

              {
                modalReport ?
                <div className='lgi-complete-profil-body-modal-background'>
                  <div className='lgi-complete-profil-body-modal-box'>
                    <button className='lgi-complete-profil-body-modal-close' onClick={() => this.setState({ modalReportLoading: false, modalReport: false, modalReportErrorMsg: ''  })}>
                      <img src={closeBlackIcon} alt='close-icon' />
                    </button>
                    <div className='lgi-complete-profil-body-modal-text'>Voulez vous signaler ce compte comme étant un "faux compte" ?</div>
                    {
                      !modalReportLoading ?
                      <button className='lgi-complete-profil-body-modal-submit' onClick={this.reportMechanism}>Valider</button> :
                      <div className='lgi-complete-profil-body-modal-submit-loading'><div className='lgi-complete-profil-body-modal-submit-loading-animation'></div></div>
                    }
                    { modalReportErrorMsg ? <div className='lgi-complete-profil-body-modal-error'>{modalReportErrorMsg}</div> : null }
                  </div>
                </div> :
                null
              }

              {
                modalMsg ?
                <div className='lgi-complete-profil-body-modal-msg-background'>
                  <div className='lgi-complete-profil-body-modal-msg-box'>
                    <button className='lgi-complete-profil-body-modal-msg-close' onClick={() => this.setState({ modalMsgLoading: false, modalMsg: false, modalMsgErrorMsg: '', modalMsgInput: ''  })}>
                      <img src={closeBlackIcon} alt='close-icon' />
                    </button>
                    <div className='lgi-complete-profil-body-modal-msg-text'>Message à {this.props.information.username}</div>
                    <textarea className='lgi-complete-profil-body-modal-msg-input' value={this.state.modalMsgInput} placeholder='Entrer votre message..' onChange={e => this.setState({ modalMsgInput: e.target.value })}></textarea>
                    {
                      !modalMsgLoading ?
                      <button className='lgi-complete-profil-body-modal-msg-submit' onClick={this.msgMechanism}>Valider</button> :
                      <div className='lgi-complete-profil-body-modal-msg-submit-loading'><div className='lgi-complete-profil-body-modal-msg-submit-loading-animation'></div></div>
                    }
                    { modalMsgErrorMsg ? <div className='lgi-complete-profil-body-modal-msg-error'>{modalMsgErrorMsg}</div> : null }
                  </div>
                </div> :
                null
              }
            </div>
          );
        }
      }
      </ApolloConsumer>
    );
  }
};


// Redux connexion.
const mapStateToProps = state => ({
  information: state.currentUserProfilInfo
});

const mapDispatchToProps = dispatch => ({
  cleanUserProfil: () => dispatch(cleanUserProfil()),
  clearStore: () => dispatch(clearStore()),
  changeLikeStatusOfUserProfil: () => dispatch(changeLikeStatusOfUserProfil()),
  changeBlockStatusForProfilUser: () => dispatch(changeBlockStatusForProfilUser()),
  changeMatchStatusOfUserProfil: data => dispatch(changeMatchStatusOfUserProfil(data))
})


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfilBody));