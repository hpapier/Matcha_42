// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { USER_MATCH_QUERY } from '../../../query';
import { saveUserMatchList, getUserProfil, changeStatusView } from '../../../store/action/synchronous';
import View from './View';
import Logout from '../Utils/Logout';


// UserMatch Component.
class UserMatch extends Component {
  onCompletedHandler = data => {
    this.props.saveUserMatchList(data.getUserMatch);
  }

  handleErrorCallback = () => {
    const { getUserProfil, changeStatusView } = this.props;
    getUserProfil(null);
    changeStatusView('suggestion');
  }

  render() {
    return (
      <Query query={USER_MATCH_QUERY} onCompleted={data => this.onCompletedHandler(data)} fetchPolicy='cache-and-network'>
      {
        ({ loading, error, refetch }) => {
          if (loading)
            return <div id='lgi-complete-user-like-loading'><div id='lgi-complete-user-like-loading-animation'></div></div>;

          if (error) {
            if (error.graphQLErrors && error.graphQLErrors[0]) {
              if (error.graphQLErrors[0].message === 'Not auth')
                return <Logout />;
            }

            return (
              <div className='lgi-complete-profil-error'>
                <div className='lgi-complete-profil-error-text'>Oups! Une erreur est survenu..</div>
                <div className='lgi-complete-profil-error-btn' onClick={this.handleErrorCallback}>Revenir au suggestion</div>
              </div>
            );
          }

          return <View refetch={refetch} />
        }
      }
      </Query>
    );
  };
};


// Redux connection.
const mapDispatchToProps = dispatch => ({
  saveUserMatchList: data => dispatch(saveUserMatchList(data)),
  getUserProfil: data => dispatch(getUserProfil(data)),
  changeStatusView: data => dispatch(changeStatusView(data))
});


// Export.
export default connect(null, mapDispatchToProps)(UserMatch);