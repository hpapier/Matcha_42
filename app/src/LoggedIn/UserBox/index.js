// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';


// Local import.
import './index.sass';
import { USER_BOX_QUERY } from '../../../query';
import cupBrownIcon from '../../../assets/cup-brown.svg';


// UserBox Component
class UserBox extends Component {
  checkWord = (len, word) => {
    if (word.length > len)
      return word.substring(0, len) + '..';
    return word;
  }

  render() {
    return (
      <Query
        query={USER_BOX_QUERY}
        pollInterval={500}
      >
        {
          ({ loading, error, data }) => {
            let likesArray = [];
            let visiteArray = [];
            let matchArray = [];
            if (!loading) {
              data.userNotif.forEach(item => {
                if (item.action === 'like')
                  likesArray.push(item);
                else if (item.action === 'visite')
                  visiteArray.push(item);
                else if (item.action === 'match')
                  matchArray.push(item);
                return;
              })
            }
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
                    <div className='lgi-user-box-link-box-title'>Likes</div>
                    <div className='lgi-user-box-link-box-content'>{likesArray.length}</div>
                  </div>

                  <div className='lgi-user-box-link-box'>
                    <div className='lgi-user-box-link-box-title'>Visites</div>
                    <div className='lgi-user-box-link-box-content'>{visiteArray.length}</div>
                  </div>

                  <div className='lgi-user-box-link-box'>
                    <div className='lgi-user-box-link-box-title'>Matches</div>
                    <div className='lgi-user-box-link-box-content'>{matchArray.length}</div>
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


// Export.
export default UserBox;