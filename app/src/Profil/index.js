import React from 'react';
import './index.scss';

class Profil extends React.Component {
  state = {};

  render() {

    return (
      <div>
        profil
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default Profil;