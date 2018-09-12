// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


// Local import.
import './index.sass';
import { USER_BOX_QUERY } from '../../../query';
import cupBrownIcon from '../../../assets/cup-brown.svg';
import { changeStatusView } from '../../../store/action/synchronous';


// UserBox Component
class UserBox extends Component {
  checkWord = (len, word) => {
    if (word.length > len)
      return word.substring(0, len) + '..';
    return word;
  }

  getUserLikeView = () => {
    if (this.props.location.pathname !== '/')
      this.props.history.push('/');
    this.props.changeStatusView('like');
  }

  getUserVisiteView = () => {

  }

  getUserMatchView = () => {

  }

  render() {
    return (
      <Query
        query={USER_BOX_QUERY}
        pollInterval={500}
      >
        {
          ({ loading, error, data }) => {
            const { statusView } = this.props;
            return (
              <div id='lgi-user-box'>
                {
                  loading ?
                  <div id='lgi-user-box-profil-loading'></div> :
                    data.userInformationsBox.profilPicture ? 
                    <img src={data.userInformationsBox.profilPicture} alt='profil-picture' id='lgi-user-box-profil' /> :
                    <div id='lgi-user-box-profil-noloading'></div>
                }

                {
                  loading ?
                  <div id='lgi-user-box-score-loading'></div> :
                  <div id='lgi-user-box-score'>
                    <img src={cupBrownIcon} alt='score-icon' id='lgi-user-box-score-icon' />
                    <div id='lgi-user-box-score-text'>{data.userInformationsBox.popularityScore}</div>
                  </div>
                }

                {
                  loading ?
                  <div id='lgi-user-box-name-loading'></div> :
                  <div id='lgi-user-box-name'>{this.checkWord(15, data.userInformationsBox.firstname) + ' ' + this.checkWord(15, data.userInformationsBox.lastname)}</div>
                }

                {
                  loading ?
                  <div id='lgi-user-box-username-loading'></div> :
                  <div id='lgi-user-box-username'>@{this.checkWord(40, data.userInformationsBox.username)}</div>
                }

                {
                  loading ?
                  <div id='lgi-user-box-bio-loading'></div> :
                  <div id='lgi-user-box-bio'>{data.userInformationsBox.bio || 'Veuillez compléter votre bio..'}</div>
                }

                <div id='lgi-user-link'>
                  <div className='lgi-user-box-link-box'>
                    <div className={`lgi-user-box-link-box-title ${statusView === 'like' ? '-active-link' : ''}`} onClick={this.getUserLikeView}>Likes</div>
                    <div className='lgi-user-box-link-box-content'>{data.userHistory ? data.userHistory.likeNumber : 0}</div>
                  </div>

                  <div className='lgi-user-box-link-box'>
                    <div className={`lgi-user-box-link-box-title ${statusView === 'visite' ? '-active-link' : ''}`} onClick={this.getUserVisiteView}>Visites</div>
                    <div className='lgi-user-box-link-box-content'>{data.userHistory ? data.userHistory.visiteNumber : 0}</div>
                  </div>

                  <div className='lgi-user-box-link-box'>
                    <div className={`lgi-user-box-link-box-title ${statusView === 'match' ? '-active-link' : ''}`} onClick={this.getUserMatchView}>Matches</div>
                    <div className='lgi-user-box-link-box-content'>{data.userHistory ? data.userHistory.matchNumber : 0}</div>
                  </div>
                </div>

              </div>
            );
          }
        }
      </Query>
    );
  }
};


// Redux connection.
const mapStateToProps = state => ({
  statusView: state.homepage.statusView
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data))
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserBox));