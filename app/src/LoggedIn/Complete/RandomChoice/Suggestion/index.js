// Modules imports.
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';


// Suggestion Component.
class Suggestion extends Component {
  state = {
    limit: 8,
    isLoading: true
  };

  componentDidMount() {
    this.getUserList();
  }

  displayUser = () => {
    const { limit, list } = this.state;
    return list.map((item, index) => {
      if (index < limit) {
        return (
          <div className='lgi-suggestion-list-item' key={item.id}>
            <div className='lgi-suggestion-list-item-img'>
              <img className='lgi-suggestion-list-item-img-element' src={item.profilPicture} id="lol" />
            </div>
            <div>
              <button></button>
              <div>{item.score}</div>
            </div>
            <div>
              <div>{item.username}</div>
              <div>{item.age} ans - {item.distance} km</div>
            </div>
          </div>
        );
      }
      return;
    });
  }

  checkDistance = element => {
    const { distance } = element;
    
    if (distance <= 20)
      return 5;
    else if (distance > 20 && distance <= 40)
      return 4;
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

  getUserList = () => {
    const { simpleUserList } = this.props;
    const userSuggestion = simpleUserList.map(element => {
      let p = 0;

      p += this.checkDistance(element);
      p += this.checkTags(element);
      p += this.checkScore(element);

      return { ...element, ponderation: p };
    });

    userSuggestion.sort((a, b) => b.ponderation - a.ponderation);
    this.setState({ isLoading: false, list: userSuggestion });
  }

  render() {
    const { isLoading } = this.state;
    return (
      <ApolloConsumer>
      {
        client => {
          return (
            <div>
              <div id='lgi-suggestion-list'>
                { isLoading ? 'loading' : this.displayUser() }
              </div>
              <div>
                { isLoading ? 'loading' : (this.state.list.length > 8) ? <div onClick={() => this.setState({ limit: this.state.limit + 8})}>Plus de résultats</div> : null }
              </div>
            </div>
          );
        }
      }
      </ApolloConsumer>
    );
  };
};


// Redux connexion.
const mapStateToProps = state => ({
  simpleUserList: state.simpleUserList,
  userTags: state.user.userTags,
  popularityScore: state.user.popularityScore
});

// const mapDispatchToProps = dispatch => ({
// });


// Export.
export default connect(mapStateToProps, null)(Suggestion);