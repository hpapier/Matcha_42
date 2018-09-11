// Modules imports.
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import heartIcon from '../../../../../assets/heart-white.svg';
import heartIconBrown from '../../../../../assets/heart-brown.svg';
import scoreIcon from '../../../../../assets/popScore.svg';
import linedArrowBtm from '../../../../../assets/lined-bottom-arrow.svg';
import { getUserProfil, changeStatusView, changeLikeStatusForUserList, clearStore } from '../../../../../store/action/synchronous';
import { LIKE_USER_MUTATION, UNLIKE_USER_MUTATION } from '../../../../../query'; 


// Suggestion Component.
class Suggestion extends Component {
  state = {
    limit: 8,
    currentAction: []
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  toggleLikeUser = item => {
    let isLoading = false;
    this.state.currentAction.forEach(el => {
      if (el === item.id)
        isLoading = true;
    });

    if (isLoading)
      return;

    if (!item.isLiked) {
      if (!this._unmount)
        this.setState({ currentAction: [...this.state.currentAction, item.id]});

      this.client.mutate({
        mutation: LIKE_USER_MUTATION,
        variables: { userId: item.id }
      })
      .then(r => {
        this.props.changeLikeStatusForUserList(item);
        if (!this._unmount)
          this.setState({ currentAction: this.state.currentAction.filter(el => el !== item.id)});
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
      return;
    }

    if (item.isLiked) {
      this.client.mutate({
        mutation: UNLIKE_USER_MUTATION,
        variables: { userId: item.id }
      })
      .then(r => {
        this.props.changeLikeStatusForUserList(item);
        if (!this._unmount)
          this.setState({ currentAction: this.state.currentAction.filter(el => el !== item.id)});
      })
      .catch(e => {
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

  displayUserSuggestion = () => {
    const { limit } = this.state;
    const { data } = this.props;
    return data.map((item, index) => {
      if (index < limit) {
        return (
          <div className='lgi-suggestion-list-item' key={item.id * Math.random()} onClick={(e) => this.getUserProfilMech(item, e)}>
            <div className='lgi-suggestion-list-item-img'>
              <img className='lgi-suggestion-list-item-img-element' src={item.profilPicture} />
            </div>
            <div className='lgi-suggestion-list-item-event'>
              <button className={!item.isLiked ? 'lgi-suggestion-list-item-event-like' : 'lgi-suggestion-list-item-event-like-active'} onClick={(e) => this.toggleLikeUser(item)}>
                <img
                  src={!item.isLiked ? heartIcon : heartIconBrown}
                  alt='like-icon'
                  className={!item.isLiked ? 'lgi-suggestion-list-item-event-like-img' : 'lgi-suggestion-list-item-event-like-img-active'}
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
        );
      }
      return;
    });
  }

  render() {
    const { limit } = this.state;
    const { data } = this.props;
    return (
      <ApolloConsumer>
      {
        client => {
          this.client = client;
          return (
            <div>
              {
                data.length === 0 ?
                <div className='lgi-suggestion-list-item-empty'>Aucun profil disponible</div> :
                <div>
                  <div id='lgi-suggestion-list'>
                    { this.displayUserSuggestion() }
                  </div>
                  <div>
                    {
                      (data.length - limit > 0) ?
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


// Redux connexion.
const mapStateToProps = state => ({
  simpleUserList: state.simpleUserList,
  userTags: state.user.userTags,
  userBd: state.user.birthDate,
  popularityScore: state.user.popularityScore,
  statusView: state.homepage.statusView,
  userPref: state.userPref,
  interests: state.interests
});

const mapDispatchToProps = dispatch => ({
  getUserProfil: data => dispatch(getUserProfil(data)),
  changeStatusView: data => dispatch(changeStatusView(data)),
  changeLikeStatusForUserList: data => dispatch(changeLikeStatusForUserList(data)),
  clearStore: () => dispatch(clearStore())
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Suggestion));