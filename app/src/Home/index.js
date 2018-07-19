import React, { Component } from 'react';
import DashboardPref from '../DashboardPref';
import SelectionList from '../SelectionList';
import UncompleteProfil from '../UncompleteProfil';
import { connect } from 'react-redux';

class Home extends Component {
  state = {};

  UIAction = () => {
    const { popularityScore } = this.props.userPref;
    if (popularityScore < 10)
      return false;
    return true;
  }

  render() {
    return (
      <div>
        {
          (this.UIAction())
          ?
          (
            <div>
              <DashboardPref />
              <SelectionList />
            </div>
          )
          :
          (
            <div>
              <UncompleteProfil />
            </div>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userPref: state.userInfo
});

export default connect(mapStateToProps, null)(Home);