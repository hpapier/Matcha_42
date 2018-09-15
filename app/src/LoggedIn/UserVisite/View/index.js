// Modules imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { changeStatusView, getUserProfil, clearStore, updateLikeStatusForUserVisiteList } from '../../../../store/action/synchronous';
import { UNLIKE_USER_MUTATION, LIKE_USER_MUTATION } from '../../../../query';
import heartIconBrown from '../../../../assets/heart-brown.svg';
import heartIcon from '../../../../assets/heart-white.svg';
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

    if (!item.isLiked) {
      this.client.mutate({
        mutation: LIKE_USER_MUTATION,
        variables: { userId: item.id }
      })
      .then(r => {
        if (!this._unmount) {
          this.setState({ currentAction: this.state.currentAction.filter(el => el !== item.id)});
          this.props.updateLikeStatusForUserVisiteList(item);
        }
      })
      .catch(error => {
        if (error.graphQLErrors && error.graphQLErrors[0]) {
          if (error.graphQLErrors[0].message === 'Not auth') {
            this.client.resetStore()
              .then(r => { return; })
              .catch(e => { return; });
            localStorage.removeItem('auth_token');
            this.props.clearStore();
            this.props.history.push('/');
          }
        }

        if (!this._unmount)
          this.setState({ currentAction: this.state.currentAction.filter(el => el !== item.id)});
      });
    }

    if (item.isLiked) {
      this.client.mutate({
        mutation: UNLIKE_USER_MUTATION,
        variables: { userId: item.id }
      })
      .then(r => {
        if (!this._unmount) {
          this.setState({ currentAction: this.state.currentAction.filter(el => el !== item.id)});
          this.props.updateLikeStatusForUserVisiteList(item);
        }
      })
      .catch(error => {
        if (error.graphQLErrors && error.graphQLErrors[0]) {
          if (error.graphQLErrors[0].message === 'Not auth') {
            this.client.resetStore()
              .then(r => { return; })
              .catch(e => { return; });
            localStorage.removeItem('auth_token');
            this.props.clearStore();
            this.props.history.push('/');
          }
        }

        if (!this._unmount)
          this.setState({ currentAction: this.state.currentAction.filter(el => el !== item.id)});
      });
    }
  }

  checkFiltreTags = element => {
    const { tags } = this.props.userPref;
    if (tags.length === 0)
      return true;

    let count = 0;
    element.tags.forEach(tag => {
      tags.forEach(el => {
        if (el.id === tag.interestId)
          count++;
      });
    });

    if (count === tags.length)
      return true;

    return false;
  };

  checkTags = element => {
    let count = 0;
    element.tags.forEach(tag => {
      this.props.userTags.forEach(userTags => {
        if (tag.interestId === userTags.interestId)
          count++;
        return;
      });
    });

    if (count === 0) {
      return 0;
    }

    const len = element.tags.length;
    if (len === count)
      return 3;
    
    if (len / count >= (len / 2))
      return 2;

    if (len / count >= (len / 3))
      return 1;

    return 0;
  }

  orderByTags = list => {
    const newList = list.map(item => {
      return { ...item, tagPond: this.checkTags(item) };
    });

    newList.sort((a, b) => b.tagPond - a.tagPond);
    return newList.map(item => {
      delete item.tagPond;
      return item;
    });
  };

  withOrder = list => {
    const { currentOrder } = this.props;
    let newList = list.slice(0);
    
    if (currentOrder === 'age')
      newList.sort((a, b) => a.age - b.age);
    else if (currentOrder === 'localisation')
      newList.sort((a, b) => a.distance - b.distance);
    else if (currentOrder === 'popularity')
      newList.sort((a, b) => b.popularityScore - a.popularityScore);
    else if (currentOrder === 'interest')
      newList = this.orderByTags(list);
    else
      newList.sort((a, b) => b.ponderation - a.ponderation);

    return newList;
  };

  withFiltre = list => {
    const { currentFiltre, userPref } = this.props;
    let result = list.slice(0);
    currentFiltre.forEach(filtre => {
      if (filtre === 'age')
        result = result.filter(item => item.age >= userPref.ageStart && item.age <= userPref.ageEnd);
      else if (filtre === 'localisation')
        result = result.filter(item => item.distance <= userPref.location);
      else if (filtre === 'popularity')
        result = result.filter(item => item.popularityScore >= userPref.scoreStart && item.popularityScore <= userPref.scoreEnd);
      else if (filtre === 'interest')
        result = result.filter(item => this.checkFiltreTags(item));
      
      return;
    });
    return result;
  };

  getListOfData = () => {
    const { userVisiteList } = this.props;
    let dataTrimed = userVisiteList.slice(0);
    dataTrimed = this.withFiltre(dataTrimed);
    dataTrimed = this.withOrder(dataTrimed)
    return dataTrimed.map(item => (
      <div className='lgi-suggestion-list-item' key={item.id * Math.random()} onClick={(e) => this.getUserProfilMech(item, e)}>
        <div className='lgi-suggestion-list-item-img'>
          <img className='lgi-suggestion-list-item-img-element' src={item.profilPicture} />
        </div>
        <div className='lgi-suggestion-list-item-event'>
          <button className={!item.isLiked ? 'lgi-suggestion-list-item-event-like' : 'lgi-suggestion-list-item-event-like-active'} onClick={(e) => this.toggleLikeUser(item)}>
            <img
              src={!item.isLiked ? heartIcon : heartIconBrown}
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
                <div id='lgi-complete-user-like-view-title-text'>Toute vos visites</div>
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
  userVisiteList: state.userVisiteList,
  userPref: state.userPref,
  currentFiltre: state.currentFiltre,
  currentOrder: state.currentOrder,
  userTags: state.user.userTags
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data)),
  getUserProfil: data => dispatch(getUserProfil(data)),
  clearStore: () => dispatch(clearStore()),
  updateLikeStatusForUserVisiteList: data => dispatch(updateLikeStatusForUserVisiteList(data))
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(View));