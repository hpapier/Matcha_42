// Modules imports.
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import heartIcon from '../../../../../assets/heart-white.svg';
import scoreIcon from '../../../../../assets/popScore.svg';
import linedArrowBtm from '../../../../../assets/lined-bottom-arrow.svg';


// Suggestion Component.
class Suggestion extends Component {
  state = {
    limit: 8,
    isLoading: true
  };

  componentDidMount() {
    this.getUserList();
  }

  displayUserSuggestion = () => {
    const { limit, list } = this.state;
    return list.map((item, index) => {
      if (index < limit) {
        return (
          <div className='lgi-suggestion-list-item' key={item.id * Math.random()}>
            <div className='lgi-suggestion-list-item-img'>
              <img className='lgi-suggestion-list-item-img-element' src={item.profilPicture} id="lol" />
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

  displayUserPreference = () => {
    const { limit, list } = this.state;
    const { userPref } = this.props;
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
    list.forEach((item, index) => {
      const isTagsPresent = checkTags(item);
      if (item.age >= userPref.ageStart
        && item.age <= userPref.ageEnd
        && item.popularityScore >= userPref.scoreStart
        && item.popularityScore <= userPref.scoreEnd
        && item.distance <= userPref.location
        && isTagsPresent) {
          listArray.push((
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
          ));
      }
      return;
    });

    return listArray.map((item, index) => {
      if (index < limit)
        return item;
      return;
    })
  }

  getage = date => {
    var today = new Date();
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  checkAge = element => {
    const { userBd } = this.props;
    const age = this.getage(userBd);

    if (Math.abs(age - element.age) <= 10)
      return 5;
    if (Math.abs(age - element.age) <= 20)
      return 3;
    if (Math.abs(age - element.age) <= 40)
      return 2;
    if (Math.abs(age - element.age) <= 60)
      return 1;

    return 0;
  }

  checkDistance = element => {
    const { distance } = element;
    
    if (distance <= 20)
      return 7;
    else if (distance > 20 && distance <= 40)
      return 5;
    else if (distance > 40 && distance <= 60)
      return 3;
    else if (distance > 60 && distance <= 80)
      return 2;
    else if (distance > 80 && distance <= 100)
      return 1;
    else
      return 0;
  }

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

  checkScore = element => {
    const { popularityScore } = element;
    if (Math.abs(this.props.popularityScore - popularityScore) <= 20)
      return 3;
    if (Math.abs(this.props.popularityScore - popularityScore) <= 40)
      return 2;
    if (Math.abs(this.props.popularityScore - popularityScore) <= 60)
      return 1;

    return 0;
  }

  getUserList = () => {
    const { simpleUserList } = this.props;
    const userSuggestion = simpleUserList.map(element => {
      let p = 0;

      p += this.checkAge(element);
      p += this.checkDistance(element);
      p += this.checkTags(element);
      p += this.checkScore(element);

      return { ...element, ponderation: p };
    });

    userSuggestion.sort((a, b) => b.ponderation - a.ponderation);
    this.setState({ isLoading: false, list: userSuggestion });
  }

  render() {
    const { isLoading, list, limit } = this.state;
    const { statusView, userPref, interests } = this.props;
    return (
      <ApolloConsumer>
      {
        client => {
          return (
            <div>
              <div id='lgi-suggestion-list'>
                {
                  isLoading ?
                  'loading' :
                    (statusView === 'suggestion') ?
                    this.displayUserSuggestion() :
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
                          <div className='lgi-suggestion-list-pref-list-element-content'>{userPref.tags.length > 0 ? userPref.tags.map(item => <div key={item.id}>{item.name}</div>) : 'Aucun tag'}</div>
                        </div>
                      </div>
                      { this.displayUserPreference() }
                    </div>
                }
              </div>
              <div>
                {
                  isLoading ?
                  'loading' :
                    (list.length - limit > 0) ?
                    <div onClick={() => this.setState({ limit: this.state.limit + 8})} className='lgi-suggestion-list-item-more-result'>
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

// const mapDispatchToProps = dispatch => ({
// });


// Export.
export default connect(mapStateToProps, null)(Suggestion);