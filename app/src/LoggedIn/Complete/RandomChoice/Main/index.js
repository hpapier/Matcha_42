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
  _unmount = false;

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

    let finalList = userSuggestion.slice(0);
    finalList = this.withFiltre(finalList);
    finalList = this.withOrder(finalList);

    return finalList;
  }

  componentWillUnmount() {
    this._unmount = true;
  }

  render() {
    const { statusView, changeStatusView } = this.props;
    const list = this.getUserList();
    return (
      <div>
        <div id='lgi-random-choice-header'>
          <div className={statusView === 'suggestion' ? 'lgi-random-choice-header-title-active' : 'lgi-random-choice-header-title'} onClick={() => changeStatusView('suggestion')}>Suggestion</div>
          <div className={statusView === 'search' ? 'lgi-random-choice-header-title-active' : 'lgi-random-choice-header-title'} onClick={() => changeStatusView('search')}>Recherche</div>
        </div>

        { statusView === 'suggestion' ? <Suggestion data={list} /> : null }
        { statusView === 'search' ? <Searchable data={list} /> : null }
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
  currentFiltre: state.currentFiltre,
  currentOrder: state.currentOrder,
  userPref: state.userPref
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data))
});

// Export.
export default connect(mapStateToProps, mapDispatchToProps)(Main);