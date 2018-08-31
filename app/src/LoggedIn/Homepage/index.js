// Modules imports.
import React from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Local import
import { GET_USER_INFO_QUERY } from '../../../query';
import Logout from '../Utils/Logout';
import { saveUserInfo, saveInterest } from '../../../store/action/synchronous';
import NotComplete from '../NotComplete';
import Complete from '../Complete';


// Homepage Component
const Homepage = props => {
  const onCompletedHandler = data => {
    props.saveUserInfo(data.userInformations);
    props.saveInterest(data.getInterests);
  };

  return (
    <Query query={GET_USER_INFO_QUERY} fetchPolicy='cache-and-network' onCompleted={data => onCompletedHandler(data)}>
    {
      ({ loading, data, error }) => {
        if (loading)
          return <div id='profil-loading-box'><div id='profil-loading'></div></div>;

        if (error) {
          if (error.graphQLErrors[0].message === 'Not auth')
            return <Logout />;
          else
            return <div id='lgi-profil-error'>Oups! Une erreur est survenu, veuillez réessayer plus tard..</div>;
        } 

        const getComponent = () => {
          const { isComplete, bio, location, interests, images, profilPicture  } = data.userInformations;
          if (isComplete)
            return <Complete />;
          else
            return <NotComplete data={{ bio, location, images, interests, profilPicture }} />;
        };

        return (
          <div>
            { getComponent() }
          </div>
        );
      }
    }
    </Query>
  );
};

const mapDispatchToProps = dispatch => ({
  saveUserInfo: data => dispatch(saveUserInfo(data)),
  saveInterest: data => dispatch(saveInterest(data))
})

// Export.
export default connect(null, mapDispatchToProps)(Homepage);