// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { UPDATE_GEOLOCATION_MUTATION, GEOCODE_USER_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import { updateUserGeolocationMechanism, clearStore } from '../../../../../../store/action/synchronous';


// Geolocation Component
class Geolocation extends Component {
  state = {
    updateView: false,
    geolocationLoading: false,
    errorMsg: '',
    addressInput: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true
  }

  geocoding = () => {
    if (!this._unmount) {
      if (!this.state.addressInput) {
        this.setState({ errorMsg: 'Veuillez remplir le champs.' });
        return;
      }

      this.setState({ geolocationLoading: true, errorMsg: '' });
    }

    if (this.state.addressInput) {
      this.client.mutate({
        mutation: GEOCODE_USER_MUTATION,
        variables: { address: this.state.addressInput}
      })
      .then(r => {
        if (!this._unmount)
          this.setState({ updateView: false, geolocationLoading: false, errorMsg: '', addressInput: '' });
      })
      .catch(error => {
        if (error.graphQLErrors && error.graphQLErrors[0]) {
          if (error.graphQLErrors[0].message === 'Not auth') {
            this.client.resetStore()
              .then(r => { return; })
              .catch(e => { return; })
            localStorage.removeItem('auth_token');
            this.props.clearStore();
            this.props.history.push('/');
          }
          else if (error.graphQLErrors[0].message === 'Incorrect') {
            if (!this._unmount)
              this.setState({ geolocationLoading: false, errorMsg: "Adresse introuvable.." });
          }
        }

        if (!this._unmount)
          this.setState({ geolocationLoading: false, errorMsg: "Oups! Une erreur est survenue.." });
      });
    }
  }

  updateMechanism = (mutation, position) => {
    mutation({ variables: { geolocation: JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude }) }})
    .then(r => {
      if (!this._unmount) {
        this.setState({ updateView: false, geolocationLoading: false, errorMsg: '', addressInput: '' });
        this.props.updateUserGeolocationMechanism(r.data.updateUserGeolocation.data);
      }
    })
    .catch(error => {
      if (error.graphQLErrors && error.graphQLErrors[0]) {
        if (error.graphQLErrors[0].message === 'Not auth') {
          this.client.resetStore()
            .then(r => { return; })
            .catch(e => { return; })
          localStorage.removeItem('auth_token');
          this.props.clearStore();
          this.props.history.push('/');
        }
      }

      if (!this._unmount) {
        this.setState({ geolocationLoading: false, errorMsg: "Oups! Une erreur est survenue.." });
      }
    });
  }

  formatedLocation = geolocation => {
    const locationObject = JSON.parse(geolocation);
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
        (updateUserGeolocation, { loading, client }) => {
          this.client = client;
          const { errorMsg, geolocationLoading } = this.state;
          const { geolocation } = this.props;
          return (
            <div>
              <div id='lgi-profil-view-pi-geolocation'>
                <div id='lgi-profil-view-pi-geolocation-box1'>
                  <div id='lgi-profil-view-pi-geolocation-box1-title'>Localisation</div>
                  <div id='lgi-profil-view-pi-geolocation-box1-content'>{geolocation ? this.formatedLocation(geolocation) : 'Aucune localisation'}</div>
                </div>
                <div id='lgi-profil-view-pi-geolocation-box2'>
                <button
                  disabled={loading || geolocationLoading ? true : false}
                  onClick={() => this.setState({ updateView: !this.state.updateView })}
                  id='lgi-profil-view-pi-geolocation-box2-edit'
                >
                  <img src={editIcon} alt='edit' id='lgi-profil-view-pi-geolocation-box2-edit-icon' />
                </button>
                </div>
              </div>
              {
                this.state.updateView ?
                <div id='lgi-profil-view-pi-geolocation-update'>
                  <div id='lgi-profil-view-pi-geolocation-update-auto' onClick={() => this.getGeolocation(updateUserGeolocation)}>géolocalisation automatique</div>
                  <div id='lgi-profil-view-pi-geolocation-update-or'>ou</div>
                  <input id='lgi-profil-view-pi-geolocation-update-input' type="text" placeholder='Saisissez votre adresse..' value={this.state.addressInput} onChange={e => this.setState({ addressInput: e.target.value })} />
                  {
                    loading || geolocationLoading ?
                    <div id='lgi-profil-view-pi-geolocation-loading-box'><div id='lgi-profil-view-pi-geolocation-loading'></div></div> :
                    <div id='lgi-profil-view-pi-geolocation-update-btn'>
                      <button id='lgi-profil-view-pi-geolocation-update-btn-validate' onClick={() => this.geocoding()}>valider</button>
                      <button id='lgi-profil-view-pi-geolocation-update-btn-cancel' onClick={() => this.setState({ updateView: false, addressInput: '', geolocationLoading: false, errorMsg: '' })}>annuler</button>
                    </div>
                  }
                  { errorMsg ? <div id='lgi-profil-view-pi-geolocation-box1-error'>{errorMsg}</div> : null }
                </div> :
                null
              }
            </div>
          );
        }
      }
      </Mutation>
    );
  }
}

const mapStateToProps = state => ({
  geolocation: state.user.location
});

const mapDispatchToProps = dispatch => ({
  updateUserGeolocationMechanism: geolocation => dispatch(updateUserGeolocationMechanism(geolocation)),
  clearStore: () => dispatch(clearStore())
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Geolocation));