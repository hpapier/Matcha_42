// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { UPDATE_GENRE_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateGenreMechanism, clearStore } from '../../../../../../store/action/synchronous';


// Genre Component
class Genre extends Component {
  state = {
    modifActive: false,
    genreSelection: '',
    errorMsg: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  updateMechanism = mutation => {
    const { genreSelection } = this.state;
    if (!genreSelection) {
      this.setState({ errorMsg: 'Veuillez choisir un genre. '});
      return;
    }

    if (this.props.genre === genreSelection) {
      this.setState({ modifActive: false, errorMsg: '', genreSelection: '' });
      return;
    }

    mutation({ variables: { genre: genreSelection }})
    .then(r => {
      if (!this._unmount) {
        this.setState({ modifActive: false, errorMsg: '', genreSelection: '' });
        this.props.updateGenreMechanism(r.data.updateUserGenre.data);
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
        this.setState({ modifActive: true, errorMsg: "Oups! Une erreur est survenue.." });
      }
    });
  }

  render() {
    return (
      <Mutation mutation={UPDATE_GENRE_MUTATION}>
      {
        (updateUserGenre, { loading, client }) => {
          this.client = client;
          const { modifActive, errorMsg } = this.state;
          const { genre } = this.props;
          return (
            <div id='lgi-profil-view-pi-genre'>
              <div id='lgi-profil-view-pi-genre-box1'>
                <div id='lgi-profil-view-pi-genre-box1-title'>genre</div>
                {
                  !modifActive ?
                  <div id='lgi-profil-view-pi-genre-box1-content'>{genre === 'man' ? 'Homme' : 'Femme'}</div> :
                  <select
                    id='lgi-profil-view-pi-genre-box1-input'
                    defaultValue='no-value'
                    onChange={e => loading ? null : this.setState({ genreSelection: e.target.value })}
                  >
                    <option value='no-value' hidden>Sélectionner un genre</option>
                    <option value='man'>Homme</option>
                    <option value='woman'>Femme</option>
                  </select>
                }
                { errorMsg && modifActive ? <div id='lgi-profil-view-pi-genre-box1-error'>{errorMsg}</div> : null }
              </div>
              <div id='lgi-profil-view-pi-genre-box2'>
              {
                loading ? 
                <div id='lgi-profil-view-pi-genre-box2-loading'></div> :
                  !modifActive ?
                  <button
                    onClick={() => this.setState({ modifActive: true })}
                    id='lgi-profil-view-pi-genre-box2-edit'
                  >
                    <img src={editIcon} alt='edit' id='lgi-profil-view-pi-genre-box2-edit-icon' />
                  </button> :
                  <div id='lgi-profil-view-pi-genre-box2-update'>
                    <button
                      id='lgi-profil-view-pi-genre-box2-update-validate'
                      onClick={() => this.updateMechanism(updateUserGenre)}
                    >
                      <img src={validateIcon} alt='validate' />
                    </button>
                    <button
                      id='lgi-profil-view-pi-genre-box2-update-cancel'
                      onClick={() => this.setState({ modifActive: false, genreSelection: '', errorMsg: '' })}
                    >
                      <img src={cancelIcon} alt='cancel' />
                    </button>
                  </div>
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
  genre: state.user.genre
});

const mapDispatchToProps = dispatch => ({
  updateGenreMechanism: genre => dispatch(updateGenreMechanism(genre)),
  clearStore: () => dispatch(clearStore())
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Genre));