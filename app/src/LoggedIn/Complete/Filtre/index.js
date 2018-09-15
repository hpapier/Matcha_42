// Modules imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import bottomArrow from '../../../../assets/bottom-arrow.svg';
import { updateFiltre, updateOrder } from '../../../../store/action/synchronous';


// Filtre Components.
class Filtre extends Component {
  state = {
    isActive: false
  };

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

  updateFiltre = element => {
    const { filtre } = this.props;

    let isPresent = false;
    filtre.forEach(item => {
      if (item === element)
        isPresent = true;
    });

    if (isPresent)
      this.props.updateFiltre(filtre.filter(item => item !== element));
    else
      this.props.updateFiltre([ ...filtre, element]);
  }

  getFiltreOptions = () => {
    const { filtre } = this.props;
    const option = ['age', 'localisation', 'popularity', 'interest'];

    return option.map(item => {
      let isActive = false;
      filtre.forEach(element => {
        if (element === item)
          isActive = true;
      });

      return (
        <div
          key={item}
          onClick={() => this.updateFiltre(item)}
          className={isActive ? 'lgi-complete-filtre-body-item-active' : 'lgi-complete-filtre-body-item-inactive'}
        >
          <div className={isActive ? 'lgi-complete-filtre-body-item-icon-active' : 'lgi-complete-filtre-body-item-icon-inactive'}></div>
          <div className={isActive ? 'lgi-complete-filtre-body-item-content-active' : 'lgi-complete-filtre-body-item-content-inactive'}>{this.tradText(item)}</div>
        </div>
      );
    });
  }

  getOrderOptions = () => {
    const { order } = this.props;
    const option = ['age', 'localisation', 'popularity', 'interest'];

    return option.map(item => {
      let isActive = false;
      if (order === item)
        isActive = true;

      return (
        <div
          key={item}
          onClick={() => this.props.updateOrder(item)}
          className={isActive ? 'lgi-complete-filtre-body-item-active' : 'lgi-complete-filtre-body-item-inactive'}
        >
          <div className={isActive ? 'lgi-complete-filtre-body-item-icon-active' : 'lgi-complete-filtre-body-item-icon-inactive'}></div>
          <div className={isActive ? 'lgi-complete-filtre-body-item-content-active' : 'lgi-complete-filtre-body-item-content-inactive'}>{this.tradText(item)}</div>
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
              {this.getFiltreOptions(this.props.filtre)}
            </div>

            <div id='lgi-complete-filtre-body-title'>Trier par..</div>
            <div id='lgi-complete-filtre-body-box'>
              {this.getOrderOptions(this.props.trie, 'trie')}
            </div>
          </div> :
          null
        }
      </div>
    );
  }
};


// Redux connection.
const mapStateToProps = state => ({
  filtre: state.currentFiltre,
  order: state.currentOrder
});

const mapDispatchToProps = dispatch => ({
  updateFiltre: data => dispatch(updateFiltre(data)),
  updateOrder: data => dispatch(updateOrder(data))
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(Filtre);