import React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { valueToObjectRepresentation } from '../../../node_modules/apollo-utilities';

class DashboardPref extends React.Component {
  state = {
    age: this.props.pref.age,
    popularityScore: this.props.pref.popularityScore,
    location: this.props.pref.location,
    interestTags: this.props.pref.interestTags,
    tags: ''
  };


  // Display a SELECT view
  selectInterval = (func, pointer, state, type) => {
    const values = [];
    let it;

    if (pointer === 1) {
      it = state[0] + 1;
      if (it === 101)
      it = 100;
    }
    
    let intType = (type === 'age') ? 18 : 10;

    for(let i = (it !== undefined) ? it : intType; i <= 100; i++)
      values.push(i);

    const changeState = e => {
      let params1 = (pointer === 0) ? parseInt(e.target.value) : state[0];
      let params2 = (pointer === 1) ? parseInt(e.target.value) : state[1];

      if (params1 >= params2)
        params2 = params1 + 1;

      if (params1 === 100)
        params2 = 100;
      func(params1, params2);
    }

    return (
      <select value={state[pointer]} onChange={e => changeState(e)}>
        {values.map(data => <option key={data} value={data}>{data}</option>)}
      </select>
    );
  }


  // Display all tag selected in preferences
  displayTags = () => {
    const tags = this.state.interestTags;
    return tags.map(data => <div onClick={() => this.deleteTags(data)} key={this.state.interestTags.length * Math.random()}>{data}</div>);
  }


  // Handle the submition form
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ interestTags: [...this.state.interestTags, this.state.tags], tags: ''});
  }


  // Delete a tag
  deleteTags = data => {
    const datas = this.state.interestTags.filter(item => (item !== data) ? item : null);
    this.setState({ interestTags: datas });
  }


  // Render the UI
  render() {
    console.log('--- PREF ---');
    console.log(this.props);
    console.log(this.state);

    // Utils function
    const setAgeState = (first, second) => {
      this.setState({ age: [first, second] });
    }

    const setPopularityScoreState = (first, second) => {
      this.setState({ popularityScore: [first, second] });
    }

    return (
      <div id="dashboard-pref-box">
        <div>
          {this.selectInterval(setAgeState, 0, this.state.age, 'age')}
          {this.selectInterval(setAgeState, 1, this.state.age, 'age')}
        </div>

        <div>
          {this.selectInterval(setPopularityScoreState, 0, this.state.popularityScore, 'score')}
          {this.selectInterval(setPopularityScoreState, 1, this.state.popularityScore, 'score')}
        </div>

        <div>
          <input type="range" min="0" max="100" defaultValue={this.state.location} onChange={e => this.setState({ location: parseInt(e.target.value) })} />
          location: {this.state.location} km
        </div>

        <div>
          <form onSubmit={e => this.handleSubmit(e)}>
            <input type="text" value={this.state.tags} onChange={e => this.setState({ tags: e.target.value })} />
          </form>
          <div>{this.displayTags()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pref: state.preferences
});

// const mapDispatchToProps = dispatch => ({
  
// });

export default connect(mapStateToProps, null)(DashboardPref);