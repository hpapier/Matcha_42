// Modules imports.
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import heartIcon from '../../../../../assets/heart-white.svg';
import scoreIcon from '../../../../../assets/popScore.svg';
import linedArrowBtm from '../../../../../assets/lined-bottom-arrow.svg';
import { getUserProfil, changeStatusView } from '../../../../../store/action/synchronous';


// Suggestion Component.
class Suggestion extends Component {
  state = {
    limit: 8
  };

  getUserProfilMech = user => {
    const { getUserProfil, changeStatusView } = this.props;
    getUserProfil(user);
    changeStatusView('profil');
  }

  displayUserSuggestion = () => {
    const { limit } = this.state;
    const { data } = this.props;
    return data.map((item, index) => {
      if (index < limit) {
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

  render() {
    const { limit } = this.state;
    const { data } = this.props;
    return (
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
  changeStatusView: data => dispatch(changeStatusView(data))
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(Suggestion);