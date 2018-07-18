import React, { Component } from 'react';
import DashboardPref from '../DashboardPref';
import SelectionList from '../SelectionList';
import { connect } from 'react-redux';

class Home extends Component {
  state = {};

  render() {
    return (
      <div>
        <DashboardPref />
        <SelectionList />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userPref: state.userInfo
});

export default connect(mapStateToProps, null)(Home);