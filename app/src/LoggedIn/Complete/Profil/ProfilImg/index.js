// Modules imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';


// ProfilImg Component.
class ProfilImg extends Component {
  state = {
    index: 0
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  upImg = () => {
    const { images } = this.props;
    const { index } = this.state;

    if (images.length - 1 === index)
      return;

    if (!this._unmount)
      this.setState({ index: index + 1 });
  }

  downImg = () => {
    const { index } = this.state;

    if (index === 0)
      return;

    if (!this._unmount)
      this.setState({ index: index - 1 });
  }

  render() {
    const { images } = this.props;
    const { index } = this.state;
    return (
      <div id='lgi-complete-profil-img'>
        <div id='lgi-complete-profil-img-btn'>
          <div id='lgi-complete-profil-img-btn-down' onClick={this.downImg}>
            <div id='lgi-complete-profil-img-btn-down-icon'></div>
          </div>
          <div id='lgi-complete-profil-img-btn-up' onClick={this.upImg}>
            <div id='lgi-complete-profil-img-btn-up-icon'></div>
          </div>
        </div>
        <div id='lgi-complete-profil-img-position'>
          <div id='lgi-complete-profil-img-position-box'>{index + 1} / {images.length}</div>
        </div>
        <img id='lgi-complete-profil-img-element' src={images[index].path} alt='user-image' />
      </div>
    );
  }
};


// Redux connection.
const mapStateToProps = state => ({
  images: state.currentUserProfilInfo.images
});


// Export.
export default connect(mapStateToProps, null)(ProfilImg);