// Modules imports.
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import plusIconGrey from '../../../../../assets/plus-grey.svg';
import { ADD_USER_IMAGE_MUTATION, REMOVE_USER_IMAGE_MUTATION, UPDATE_USER_PROFIL_IMAGE_MUTATION } from '../../../../../query';
import { updateUserImages, updateUserProfilImg } from '../../../../../store/action/synchronous';


// Images Component
class Images extends Component {
  state = {
    loading: false,
    errorMsg: ''
  };

  convertFile = file => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onabort = e => reject('Abort');
      reader.onerror = e => reject('Error');
      reader.onloadend = e => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  uploadFile = async client => {
    const file = this.inputFile.files[0];
    if (file === undefined) {
      return;
    }

    if (this.props.userImages.length >= 5) {
      this.setState({ errorMsg: 'Vous pouvez ajouter 5 photos maximum.' });
      return;
    }

    if (file.size > 2000000) {
      this.setState({ errorMsg: 'Taille de la photo trop élevée. (2MO maximum)' });
      return;
    }

    this.setState({ loading: true, errorMsg: '' });
    const newFile = await this.convertFile(file);
    client.mutate({
      mutation: ADD_USER_IMAGE_MUTATION,
      variables: { img: newFile, type: file.type }
    })
    .then(r => {
      this.setState({ loading: false, errorMsg: '' });
      this.props.updateUserImages(r.data.addUserImage);
      this.inputFile.value = null;
    })
    .catch(e => {
      this.setState({ loading: false, errorMsg: 'Oups! Une erreur est survenue..' });
      this.inputFile.value = null;
    });
  }

  displayUserImages = client => {
    const { userImages } = this.props;
    if (userImages.length === 0)
      return <div className='lgi-profil-view-photos-empty'>Aucunes images..</div>;
    else {
      return userImages.map(item => (
        <div key={item.id} className='lgi-profil-view-photos-box'>
          <img src={window.location.origin + item.path} alt='user-image' className='lgi-profil-view-photos-box-img' />
          <div className='lgi-profil-view-photos-box-btn'>
            <div className='lgi-profil-view-photos-box-btn-delete' onClick={() => this.deleteUserImage(client, item)}>Supprimer</div>
            <div className='lgi-profil-view-photos-box-btn-choose' onClick={() => this.selectProfilImg(client, item)}>Sélectionner</div>
          </div>
        </div>
      ));
    }
  }

  deleteUserImage = (client, image) => {
    this.setState({ loading: true, errorMsg: '' });
    client.mutate({
      mutation: REMOVE_USER_IMAGE_MUTATION,
      variables: { imgId: image.id, name: image.path.split('/')[3] }
    })
    .then(r => {
      this.setState({ loading: false, errorMsg: '' });
      this.props.updateUserImages(r.data.removeUserImage);
      let isPresent = false;
      r.data.removeUserImage.forEach(item => {
        if (item.path === this.props.profilPicture)
          isPresent = true;
      });

      if (!isPresent)
        this.props.updateUserProfilImg(null);
    })
    .catch(e => {
      this.setState({ loading: false, errorMsg: 'Oups! Une erreur est survenue..' });
    });
  }

  selectProfilImg = (client, image) => {
    if (image.path === this.props.profilPicture)
      return;

    this.setState({ loading: true, errorMsg: '' });
    client.mutate({
      mutation: UPDATE_USER_PROFIL_IMAGE_MUTATION,
      variables: { imgId: image.id, name: image.path.split('/')[3], imgPath: image.path }
    })
    .then(r => {
      this.setState({ loading: false, errorMsg: '' });
      this.props.updateUserProfilImg(r.data.updateProfilImg.path);
    })
    .catch(e => {
      this.setState({ loading: false, errorMsg: 'Oups! Une erreur est survenue..' });
    });
  }

  render() {
    const { loading, errorMsg } = this.state;
    return (
      <ApolloConsumer>
      {
        client => {
          return (
          <div id='lgi-profil-view-photos'>
            <div id='lgi-profil-view-photos-box-header'>
              <div id='lgi-profil-view-photos-header'>
                photos
                {
                  loading ?
                  <div className='lgi-profil-view-photo-add-loading'></div> :
                  <button className='lgi-profil-view-photos-header-plus-icon'>
                    <label htmlFor='lgi-profil-view-photos-add-img' className='lgi-profil-view-photos-header-plus-icon-label'>
                      <img src={plusIconGrey} alt='plus-icon' />
                    </label>
                  </button>
                }
                <input type='file' id='lgi-profil-view-photos-add-img' accept='.png,.jpeg,.jpg' onChange={() => this.uploadFile(client)} ref={ref => this.inputFile = ref} />
              </div>
            </div>
            { errorMsg ? <div className='lgi-profil-view-photos-error'>{errorMsg}</div> : null }
            <div id='lgi-profil-view-photos-container'>
              {this.displayUserImages(client)}
            </div>
          </div>
          );
        }
      }
      </ApolloConsumer>
    );
  }
};

const mapStateToProps = state => ({
  userImages: state.user.userImages,
  profilPicture: state.user.profilPicture
});

const mapDispatchToProps = dispatch => ({
  updateUserImages: data => dispatch(updateUserImages(data)),
  updateUserProfilImg: img => dispatch(updateUserProfilImg(img))
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(Images);