// Modules imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import matchIcon from '../../../../../assets/match.svg';
import closeIcon from '../../../../../assets/close-white.svg';
import { cleanUserProfil } from '../../../../../store/action/synchronous';
import likeWhiteIcon from '../../../../../assets/heart-white.svg';
import scoreWhiteIcon from '../../../../../assets/cup-white.svg';
import msgWhiteIcon from '../../../../../assets/msg-sending.svg';
import flagIconWhite from '../../../../../assets/flag.svg';
import nonBlockWhiteIcon from '../../../../../assets/non-block.svg';

// ProfilImg Component.
class ProfilBody extends Component {
  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  getLocationName = (location) => {
    const locationName = JSON.parse(location).formatedName;
    const locArr = locationName.split(',');

    return `${locArr[0]}, ${locArr[1]}, ${locArr[2]}`;
  }

  render() {
    const { information } = this.props;
    return (
      <div id='lgi-complete-profil-body'>
        <div id='lgi-complete-profil-body-close'>
          <img id='lgi-complete-profil-body-close-icon' src={closeIcon} alt='close' onClick={this.props.cleanUserProfil} />
        </div>

        {
          information.isMatched ?
          <div id='lgi-complete-profil-body-match'>
            <img id='lgi-complete-profil-body-match-icon' src={matchIcon} alt='match-icon' />
            <div id='lgi-complete-profil-body-match-text'>Vous avez matché avec cette personne</div>
          </div> :
          null
        }

        <div id='lgi-complete-profil-body-user'>
          <div id='lgi-complete-profil-body-user-lastconnexion'>Dernière connexion il y a {information.lastConnexion}</div>
          <div id='lgi-complete-profil-body-user-username'>
            <div id='lgi-complete-profil-body-user-username-text'>{information.username}</div>
            <div id={ information.isConnected ? 'lgi-complete-profil-body-user-username-co-status-active' : 'lgi-complete-profil-body-user-username-co-status-inactive' }></div>
          </div>
          <div id='lgi-complete-profil-body-user-info'>{information.age} ans - {this.getLocationName(information.location)}</div>
        </div>

        <div id='lgi-complete-profil-body-cta'>
          <div id='lgi-complete-profil-body-cta-left'>
            <div id='lgi-complete-profil-body-cta-left-like'>
              <img id='lgi-complete-profil-body-cta-left-like-icon' src={likeWhiteIcon} alt='like-icon' />
            </div>

            <div id='lgi-complete-profil-body-cta-left-score'>
              <img id='lgi-complete-profil-body-cta-left-score-icon' src={scoreWhiteIcon} alt='score-icon' />
              <div id='lgi-complete-profil-body-cta-left-score-score'>{information.popularityScore}</div>
            </div>

            <div id='lgi-complete-profil-body-cta-left-msg'>
              <img id='lgi-complete-profil-body-cta-left-msg-icon' src={msgWhiteIcon} alt='msg-icon'/>
            </div>
          </div>

          <div id='lgi-complete-profil-body-cta-right'>
            <div id='lgi-complete-profil-body-cta-right-block'>
              <img src={nonBlockWhiteIcon} alt='block-icon' id='lgi-complete-profil-body-cta-right-block-icon' />
              <div id='lgi-complete-profil-body-cta-right-block-text'>bloquer</div>
            </div>

            <div id='lgi-complete-profil-body-cta-right-report'>
              <img src={flagIconWhite} alt='report-icon' id='lgi-complete-profil-body-cta-right-report-icon' />
              <div id='lgi-complete-profil-body-cta-right-report-text'>signaler</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};


// Redux connexion.
const mapStateToProps = state => ({
  information: state.currentUserProfilInfo
});

const mapDispatchToProps = dispatch => ({
  cleanUserProfil: () => dispatch(cleanUserProfil())
})


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(ProfilBody);