import React from 'react';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { withApollo } from 'react-apollo';
import { updatePrefStore } from '../../store/reducer';
import './index.scss';

const MUTATION_PREFERENCE = gql`
  mutation ($id: String!, $ageStart: Int!, $ageEnd: Int!, $scoreStart: Int!, $scoreEnd: Int!, $location: Int!, $tags: String!) {
    updatePreferences(id: $id, ageStart: $ageStart, ageEnd: $ageEnd, scoreStart: $scoreStart, scoreEnd: $scoreEnd, location: $location, tags: $tags) {
      state
    }
  }
`;

class DashboardPref extends React.Component {
  state = {
    age: this.props.pref.age,
    popularityScore: this.props.pref.popularityScore,
    location: this.props.pref.location,
    interestTags: this.props.pref.interestTags,
    tags: '',
    reqLoading: false
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


  // Save the preferences
  savePreferences = () => {
    this.setState({ reqLoading: true });
    const tagsObject = { data: this.state.interestTags };
    const tagsJson = JSON.stringify(tagsObject);
    this.props.client.mutate({
      mutation: MUTATION_PREFERENCE,
      variables: {
        id: this.props.id,
        ageStart: this.state.age[0],
        ageEnd: this.state.age[1],
        scoreStart: this.state.popularityScore[0],
        scoreEnd: this.state.popularityScore[1],
        location: this.state.location,
        tags: tagsJson
      }
    })
    .then(res => {
      this.setState({ reqLoading: false });
      this.props.updatePrefStore({ age: this.state.age, popularityScore: this.state.popularityScore, location: this.state.location, interestTags: this.state.interestTags });
    })
    .catch(err => {
      this.setState({ error: 'Errorrrrrrr', reqLoading: false });
    });
  }


  // Display error msg
  errorMsg = () => {
    if (this.state.error)
      return (<div>{this.state.error}</div>);
  }


  // Render the UI
  render() {
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

        <div>
          <button type="button" onClick={this.savePreferences} disabled={this.state.reqLoading}>Sauvegarder</button>
        </div>

        {this.errorMsg()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  id: state.userInfo.id,
  pref: state.preferences
});

const mapDispatchToProps = dispatch => ({
  updatePrefStore: data => dispatch(updatePrefStore(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withApollo(DashboardPref));