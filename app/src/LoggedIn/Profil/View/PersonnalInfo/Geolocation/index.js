// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { UPDATE_GEOLOCATION_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import { updateUserGeolocationMechanism } from '../../../../../../store/action/synchronous';


// Geolocation Component
class Geolocation extends Component {
  state = {
    geolocationLoading: false,
    errorMsg: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true
  }

  updateMechanism = (mutation, position) => {
    mutation({ variables: { geolocation: JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude }) }})
    .then(r => {
      console.log(r);
      if (!this._unmount)
        this.setState({ geolocationLoading: false, errorMsg: '' });
      this.props.updateUserGeolocationMechanism(r.data.updateUserGeolocation.data);
    })
    .catch(e => {
      if (!this._unmount) {
        this.setState({ geolocationLoading: false, errorMsg: "Oups! Une erreur est survenue.." });
      }
    });
  }

  formatedLocation = location => {
    const locationObject = JSON.parse(location);
    return (locationObject.formatedName.length > 33 ? locationObject.formatedName.substring(0, 33) + '..' : locationObject.formatedName);
  }

  getGeolocation = mutation => {
    if (!this._unmount)
      this.setState({ geolocationLoading: true, errorMsg: '' });
    navigator.geolocation.getCurrentPosition(
      position => {
        if (!this._unmount)
          this.updateMechanism(mutation, position)
      },
      () => {
        if (!this._unmount)
          this.setState({ geolocationLoading: false, errorMsg: 'Veuillez autoriser la localisation.' });
      }
    );
  }

  render() {
    return (
      <Mutation mutation={UPDATE_GEOLOCATION_MUTATION}>
      {
        (updateUserGeolocation, { loading, error, data }) => {
          const { errorMsg, geolocationLoading } = this.state;
          const { location } = this.props;
          return (
            <div id='lgi-profil-view-pi-geolocation'>
              <div id='lgi-profil-view-pi-geolocation-box1'>
                <div id='lgi-profil-view-pi-geolocation-box1-title'>Localisation</div>
                <div id='lgi-profil-view-pi-geolocation-box1-content'>{location ? this.formatedLocation(location) : 'Aucune localisation'}</div>
                { errorMsg ? <div id='lgi-profil-view-pi-geolocation-box1-error'>{errorMsg}</div> : null }
              </div>
              <div id='lgi-profil-view-pi-geolocation-box2'>
              {
                loading || geolocationLoading ? 
                <div id='lgi-profil-view-pi-geolocation-box2-loading'></div> :
                <button
                  onClick={() => this.getGeolocation(updateUserGeolocation)}
                  id='lgi-profil-view-pi-geolocation-box2-edit'
                >
                  <img src={editIcon} alt='edit' id='lgi-profil-view-pi-geolocation-box2-edit-icon' />
                </button>
              }
              </div>
            </div>
          );
        }
      }
      </Mutation>
    );
  }
}

const mapStateToProps = state => ({
  location: state.user.location
});

const mapDispatchToProps = dispatch => ({
  updateUserGeolocationMechanism: geolocation => dispatch(updateUserGeolocationMechanism(geolocation))
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(Geolocation);