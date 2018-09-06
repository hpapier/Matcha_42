// Module imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { changeStatusView } from '../../../../../store/action/synchronous';
import Suggestion from '../Suggestion';
import Searchable from '../Searchable';


// Main Component.
class Main extends Component {
  state = {
    isLoading: true,
    list: []
  };

  _unmount = false;

  componentDidMount() {
    // console.log('COMPONENT DID UPDATE');

    this.getUserList();
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
    if (!this._unmount)
      this.setState({ isLoading: false, list: userSuggestion });
  }

  componentWillUnmount() {
    this._unmount = true;
  }

  render() {
    const { statusView, changeStatusView } = this.props;
    const { isLoading, list } = this.state;
    return (
      <div>
        <div id='lgi-random-choice-header'>
          <div className={statusView === 'suggestion' ? 'lgi-random-choice-header-title-active' : 'lgi-random-choice-header-title'} onClick={() => changeStatusView('suggestion')}>Suggestion</div>
          <div className={statusView === 'search' ? 'lgi-random-choice-header-title-active' : 'lgi-random-choice-header-title'} onClick={() => changeStatusView('search')}>Recherche</div>
        </div>

        { isLoading ? <div>Loading.......</div> : null }
        { statusView === 'suggestion' && !isLoading ? <Suggestion data={list} /> : null }
        { statusView === 'search' && !isLoading ? <Searchable data={list} /> : null }
      </div>
    );
  }
};


// Redux connexion.
const mapStateToProps = state => ({
  statusView: state.homepage.statusView,
  simpleUserList: state.simpleUserList,
  userTags: state.user.userTags,
  userBd: state.user.birthDate,
  popularityScore: state.user.popularityScore,
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data))
});

// Export.
export default connect(mapStateToProps, mapDispatchToProps)(Main);