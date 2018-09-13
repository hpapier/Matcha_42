// Module imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApolloConsumer } from 'react-apollo';


// Locals imports.
import './index.sass';
import { changeStatusView, getUserProfil, changeLikeStatusForUserList } from '../../../../../store/action/synchronous';
import heartIcon from '../../../../../assets/heart-white.svg';
import heartIconBrown from '../../../../../assets/heart-brown.svg';
import scoreIcon from '../../../../../assets/popScore.svg';
import linedArrowBtm from '../../../../../assets/lined-bottom-arrow.svg';
import { LIKE_USER_MUTATION, UNLIKE_USER_MUTATION } from '../../../../../query';


// Searchable Component.
class Searchable extends Component {
  state = {
    limit: 8,
    currentAction: []
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  getUserPreference = () => {
    const { userPref, data } = this.props;
    const checkTags = element => {
      let count = 0;
      userPref.tags.forEach(tag => {
        element.tags.forEach(e => {
          if (tag.id === e.interestId)
            count++;
          return;
        });
      });
      if (count === userPref.tags.length)
        return true;
      return false;
    }

    let listArray = [];
    data.forEach((item) => {
      const isTagsPresent = checkTags(item);
      if (item.age >= userPref.ageStart
        && item.age <= userPref.ageEnd
        && item.popularityScore >= userPref.scoreStart
        && item.popularityScore <= userPref.scoreEnd
        && item.distance <= userPref.location
        && isTagsPresent) {
          listArray.push(item);
      }
      return;
    });

    return listArray;
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

  displayUserPreference = (list) => {
    if (list.length === 0)
      return <div className='lgi-suggestion-list-item-empty'>Aucun résultats</div>;
    else {
      return list.map((item, index) => {
        if (index < this.state.limit) {
          return (
            <div className='lgi-suggestion-list-item' key={item.id * Math.random()} onClick={(e) => this.getUserProfilMech(item, e)}>
              <div className='lgi-suggestion-list-item-img'>
                <img className='lgi-suggestion-list-item-img-element' src={item.profilPicture} />
              </div>
              <div className='lgi-suggestion-list-item-event'>
                <button className={!item.isLiked ? 'lgi-suggestion-list-item-event-like' : 'lgi-suggestion-list-item-event-like-active'} onClick={() => this.toggleLikeUser(item)}>
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
  }

  render() {
    const { userPref } = this.props;
    const { limit } = this.state;
    const list = this.getUserPreference();
    return (
      <ApolloConsumer>
      {
        client => {
          this.client = client;
          return (
            <div>
              <div className='lgi-suggestion-list-pref'>
                <div className='lgi-suggestion-list-pref-list'>
                  <div className='lgi-suggestion-list-pref-list-element'>
                    <div className='lgi-suggestion-list-pref-list-element-title'>âge</div>
                    <div className='lgi-suggestion-list-pref-list-element-content'>{userPref.ageStart} - {userPref.ageEnd}</div>
                  </div>
                  <div className='lgi-suggestion-list-pref-list-element'>
                    <div className='lgi-suggestion-list-pref-list-element-title'>score de popularité</div>
                    <div className='lgi-suggestion-list-pref-list-element-content'>{userPref.scoreStart} - {userPref.scoreEnd}</div>
                  </div>
                  <div className='lgi-suggestion-list-pref-list-element'>
                    <div className='lgi-suggestion-list-pref-list-element-title'>proximité géographique</div>
                    <div className='lgi-suggestion-list-pref-list-element-content'>{userPref.location} km</div>
                  </div>
                  <div className='lgi-suggestion-list-pref-list-element'>
                    <div className='lgi-suggestion-list-pref-list-element-title'>Tags</div>
                    <div className='lgi-suggestion-list-pref-list-element-content'>
                      {
                        userPref.tags.length > 0 ?
                        userPref.tags.map((item, index) => (
                          <div key={item.id}>{item.name}{userPref.tags[index + 1] ? ', ' : null}</div>
                        )) :
                        'Aucun tag'
                      }
                    </div>
                  </div>
                </div>
                { this.displayUserPreference(list) }
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
          );
        }
      }
      </ApolloConsumer>
    )
  }
};


// Redux connexion.
const mapStateToProps = state => ({
  userPref: state.userPref
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data)),
  getUserProfil: data => dispatch(getUserProfil(data)),
  changeLikeStatusForUserList: data => dispatch(changeLikeStatusForUserList(data))
})


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(Searchable);