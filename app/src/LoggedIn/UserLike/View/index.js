// Modules imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { changeStatusView, getUserProfil, clearStore } from '../../../../store/action/synchronous';
import { UNLIKE_USER_MUTATION } from '../../../../query';
import heartIconBrown from '../../../../assets/heart-brown.svg';
import scoreIcon from '../../../../assets/popScore.svg';
import linedArrowBtm from '../../../../assets/lined-bottom-arrow.svg';
import closeWhiteIcon from '../../../../assets/close-white.svg';


// View Component.
class View extends Component {
  state = {
    limit: 8,
    currentAction: []
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  getUserProfilMech = (user, e) => {
    if (e.target) {
      if (
        e.target.className === 'lgi-suggestion-list-item-event-like'
        || e.target.className === 'lgi-suggestion-list-item-event-like-img'
        || e.target.className === 'lgi-suggestion-list-item-event-like-active'
        || e.target.className === 'lgi-suggestion-list-item-event-like-img-active'
      )
        return;
      else {
        const { getUserProfil, changeStatusView } = this.props;
        getUserProfil(user);
        changeStatusView('profil');
      }
    }

    return;
  }

  toggleLikeUser = item => {
    let isLoading = false;
    this.state.currentAction.forEach(el => {
      if (el === item.id)
        isLoading = true;
    });

    if (isLoading)
      return;

    if (item.isLiked) {
      this.client.mutate({
        mutation: UNLIKE_USER_MUTATION,
        variables: { userId: item.id }
      })
      .then(r => {
        if (!this._unmount) {
          this.setState({ currentAction: this.state.currentAction.filter(el => el !== item.id)});
          this.props.refetch();
        }
      })
      .catch(error => {
        if (error.graphQLErrors[0].message === 'Not auth') {
          localStorage.removeItem('auth_token');
          this.props.clearStore();
          this.props.history.push('/');
        }

        if (!this._unmount)
          this.setState({ currentAction: this.state.currentAction.filter(el => el !== item.id)});
      });
    }
  }

  getListOfData = () => {
    const { userLikeList } = this.props;
    return userLikeList.map(item => (
      <div className='lgi-suggestion-list-item' key={item.id * Math.random()} onClick={(e) => this.getUserProfilMech(item, e)}>
        <div className='lgi-suggestion-list-item-img'>
          <img className='lgi-suggestion-list-item-img-element' src={item.profilPicture} />
        </div>
        <div className='lgi-suggestion-list-item-event'>
          <button className={!item.isLiked ? 'lgi-suggestion-list-item-event-like' : 'lgi-suggestion-list-item-event-like-active'} onClick={(e) => this.toggleLikeUser(item)}>
            <img
              src={heartIconBrown}
              alt='like-icon'
              className={'lgi-suggestion-list-item-event-like-img-active'}
            />
          </button>
          <div className='lgi-suggestion-list-item-event-score'>
            <img src={scoreIcon} alt='score-icon' className='lgi-suggestion-list-item-event-score-icon' />
            <div className='lgi-suggestion-list-item-event-score-txt'>{item.popularityScore}</div>
          </div>
        </div>
        <div className='lgi-suggestion-list-item-content'>
          <div className='lgi-suggestion-list-item-content-title'>{item.username}</div>
          <div className='lgi-suggestion-list-item-content-text'>{item.age} ans - {item.distance} km</div>
        </div>
      </div>
    ));
  }

  render() {
    const list = this.getListOfData();
    const { limit } = this.state;
    return (
      <ApolloConsumer>
      {
        client => {
          this.client = client;
          return (
            <div id='lgi-complete-user-like'>
              <div id='lgi-complete-user-like-view-title'>
                <div id='lgi-complete-user-like-view-title-text'>Tous vos likes</div>
                <div id='lgi-complete-user-like-view-title-back-btn' onClick={() => this.props.changeStatusView('suggestion')}>
                  <div id='lgi-complete-user-like-view-title-back-btn-text'>Retour</div>
                  <img id='lgi-complete-user-like-view-title-back-btn-icon' src={closeWhiteIcon} alt='back-icon' />
                </div>
              </div>
      
              {
                list.length === 0 ?
                <div className='lgi-suggestion-list-item-empty'>Aucun profil disponible</div> :
                <div>
                  <div className='lgi-complete-user-like-box'>
                  {
                    list.map((item, index) => {
                      if (index >= limit)
                        return;
                      return item;
                    })
                  }
                  </div>
                  <div>
                    {
                      (list.length - limit > 0) ?
                      <div onClick={() => this.setState({ limit: this.state.limit + 8 })} className='lgi-suggestion-list-item-more-result'>
                        <div className='lgi-suggestion-list-item-more-result-text'>Plus de résultats</div>
                        <img src={linedArrowBtm} alt='more-result-icon' className='lgi-suggestion-list-item-more-result-icon' />
                      </div> : 
                      null
                    }
                  </div>
                </div>
              }
            </div>
          );
        }
      }
      </ApolloConsumer>
    );
  };
};


// Redux connection.
const mapStateToProps = state => ({
  userLikeList: state.userLikeList
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data)),
  getUserProfil: data => dispatch(getUserProfil(data)),
  clearStore: () => dispatch(clearStore())
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(View));