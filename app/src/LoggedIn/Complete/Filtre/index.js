// Modules imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import bottomArrow from '../../../../assets/bottom-arrow.svg';
import { updateFiltre } from '../../../../store/action/synchronous';


// Filtre Components.
class Filtre extends Component {
  state = {
    isActive: false
  };

  toggleFiltre = item => {
    const { filtre } = this.props;
    let isPresent = false;
    filtre.forEach(el => {
      if (el === item)
        isPresent = true;
      return;
    });

    let newFiltre;
    if (isPresent)
      newFiltre = filtre.filter(e => e !== item);
    else
      newFiltre = [...filtre, item];

    this.props.updateFiltre(newFiltre);
    return;
  }

  tradText = text => {
    if (text === 'age')
      return 'âge';
    else if (text === 'localisation')
      return 'proximité géographique';
    else if (text === 'interest')
      return 'centre d\'intérêt';
    else if (text === 'popularity')
      return 'score de popularité';
  }

  getStyleOptions = () => {
    const { filtre } = this.props;
    const option = ['age', 'localisation', 'popularity', 'interest'];

    return option.map(item => {
      let isPresent = false;
      filtre.forEach(el => {
        if (el === item)
          isPresent = true;
      });

      return (
        <div
          key={item}
          onClick={() => this.toggleFiltre(item)}
          className={isPresent ? 'lgi-complete-filtre-body-item-active' : 'lgi-complete-filtre-body-item-inactive'}
        >
          <div className={isPresent ? 'lgi-complete-filtre-body-item-icon-active' : 'lgi-complete-filtre-body-item-icon-inactive'}></div>
          <div className={isPresent ? 'lgi-complete-filtre-body-item-content-active' : 'lgi-complete-filtre-body-item-content-inactive'}>{this.tradText(item)}</div>
        </div>
      );
    });
  }

  render() {
    const { isActive } = this.state;
    return (
      <div id='lgi-complete-filtre'>
        <div id='lgi-complete-filtre-header' onClick={() => this.setState({ isActive: !isActive })}>
          <div id='lgi-complete-filtre-header-title'>Filtres</div>
          <img id='lgi-complete-filtre-header-icon' className={isActive ? 'filtre-box-active' : ''} src={bottomArrow} alt='bottom-arrow-icon' />
        </div>
  
        {
          isActive ?
          <div id='lgi-complete-filtre-body'>
            <div id='lgi-complete-filtre-body-title'>Filtrer par..</div>
            <div id='lgi-complete-filtre-body-box'>
              {this.getStyleOptions()}
            </div>
          </div> :
          null
        }
      </div>
    );
  }
};


// Redux connexion.
const mapStateToProps = state => ({
  filtre: state.currentFiltre
});

const mapDispatchToProps = dispatch => ({
  updateFiltre: data => dispatch(updateFiltre(data))
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(Filtre);