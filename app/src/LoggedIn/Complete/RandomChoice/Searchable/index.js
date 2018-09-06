// Module imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { changeStatusView } from '../../../../../store/action/synchronous';
import heartIcon from '../../../../../assets/heart-white.svg';
import scoreIcon from '../../../../../assets/popScore.svg';
import linedArrowBtm from '../../../../../assets/lined-bottom-arrow.svg';


// Searchable Component.
class Searchable extends Component {
  state = {
    limit: 8,
    getter: true,
    list: [],
    userPref: null
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  checkPrefChange = () => {
    const { userPref } = this.state;

    if (userPref === null)
      return false;

    const { ageStart, ageEnd, scoreStart, scoreEnd, location, tags } = this.props.userPref;

    let tagsDiff = false;
    
    let count = 0;
    userPref.tags.forEach(item => {
      tags.forEach(el => {
        if (el.id === item.id)
          count++;
      });
    });

    if (count === userPref.tags.length)
      tagsDiff = true;

    if (
      userPref.ageStart !== ageStart
      || userPref.ageEnd !== ageEnd
      || userPref.scoreStart !== scoreStart
      || userPref.scoreEnd !== scoreEnd
      || userPref.location !== location
      || tagsDiff
    ) {
      if (!this._unmount)
        this.setState({ userPref: { ...this.props.userPref }});
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    console.log('DIDUPDATE');

    const userPrefUpdate = this.checkPrefChange();
    if (this.state.getter ||userPrefUpdate) {
      this.getUserPreference();
      if (!this._unmount)
        this.setState({ getter: false });
    }
  };

  componentDidMount() {
    this.getUserPreference();
    if (!this._unmount) {
      this.setState({ getter: false, userPref: { ...this.props.userPref }});
    }
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

    if (!this._unmount)
      this.setState({ list: listArray });
  }

  displayUserPreference = () => {
    const { list } = this.state;

    if (list.length === 0)
      return <div>Aucun résultats</div>;
    else {
      return list.map((item, index) => {
        return (
          <div className='lgi-suggestion-list-item' key={item.id * Math.random()}>
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
      })
    }
  }

  render() {
    const { userPref } = this.props;
    const { list, limit } = this.state;
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
          { this.displayUserPreference() }
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
})


// Export.
export default connect(mapStateToProps, null)(Searchable);