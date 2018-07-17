import React, { Component } from 'react';
import DashboardPref from '../DashboardPref';
import SelectionList from '../SelectionList';

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

export default Home;