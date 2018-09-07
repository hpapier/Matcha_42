// Module imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { changeStatusView, getUserProfil } from '../../../../../store/action/synchronous';
import heartIcon from '../../../../../assets/heart-white.svg';
import scoreIcon from '../../../../../assets/popScore.svg';
import linedArrowBtm from '../../../../../assets/lined-bottom-arrow.svg';


// Searchable Component.
class Searchable extends Component {
  state = {
    limit: 8
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

  getUserProfilMech = user => {
    const { getUserProfil, changeStatusView } = this.props;
    getUserProfil(user);
    changeStatusView('profil');
  }

  displayUserPreference = (list) => {
    if (list.length === 0)
      return <div className='lgi-suggestion-list-item-empty'>Aucun résultats</div>;
    else {
      return list.map((item, index) => {
        if (index < this.state.limit) {
          return (
            <div className='lgi-suggestion-list-item' key={item.id * Math.random()} onClick={() => this.getUserProfilMech(item)}>
              <div className='lgi-suggestion-list-item-img'>
                <img className='lgi-suggestion-list-item-img-element' src={item.profilPicture} />
              </div>
              <div className='lgi-suggestion-list-item-event'>
                <button className='lgi-suggestion-list-item-event-like'>
                  <img src={heartIcon} alt='like-icon' className='lgi-suggestion-list-item-event-like-img' />
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
};


// Redux connexion.
const mapStateToProps = state => ({
  userPref: state.userPref
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data)),
  getUserProfil: data => dispatch(getUserProfil(data))
})


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(Searchable);