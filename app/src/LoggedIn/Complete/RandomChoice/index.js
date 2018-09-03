// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { GET_LIST_OF_USER_QUERY } from '../../../../query';
import { saveListOfUser, changeStatusView } from '../../../../store/action/synchronous';
import Logout from '../../Utils/Logout';
import Suggestion from './Suggestion';


// RandomChoice Component.
class RandomChoice extends Component {
  onCompletedHandler = data => {
    console.log(data);
    this.props.saveListOfUser(data.getListOfUser);
  }

  render() {
    return (
      <Query query={GET_LIST_OF_USER_QUERY} onCompleted={data => this.onCompletedHandler(data)} fetchPolicy='cache-and-network'>
      {
        ({ loading, error }) => {
          if (loading)
            return <div id='lgi-random-choice-loading'><div id='lgi-random-choice-loading-animation'></div></div>;

          if (error) {
            if (error.graphQLErrors[0].message === 'Not auth')
              return <Logout />;
            else
              return <div>Oups! Une erreur est survenu, veuillez réessayer plus tard..</div>;
          }

          const { statusView, changeStatusView } = this.props;
          return (
            <div>
              <div id='lgi-random-choice-header'>
                <div className={statusView === 'suggestion' ? 'lgi-random-choice-header-title-active' : 'lgi-random-choice-header-title'} onClick={() => changeStatusView('suggestion')}>Suggestion</div>
                {/* <div className='lgi-random-choice-header-title'>|</div> */}
                <div className={statusView === 'search' ? 'lgi-random-choice-header-title-active' : 'lgi-random-choice-header-title'} onClick={() => changeStatusView('search')}>Recherche</div>
              </div>

              { statusView === 'suggestion' || statusView === 'search' ? <Suggestion /> : null }
            </div>
          );
        }
      }
      </Query>
    );
  }
};


// Redux connexion.
const mapStateToProps = state => ({
  statusView: state.homepage.statusView
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data)),
  saveListOfUser: data => dispatch(saveListOfUser(data))
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(RandomChoice);