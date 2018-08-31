// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';


// Local import.
import './index.sass';
import bottomArrowIcon from '../../../../../assets/bottom-arrow.svg';
import { UPDATE_USER_PREFERENCE_MUTATION } from '../../../../../query';


// SearchMutation Component.
class SearchMutation extends Component {
  state = {
    isActive: false,
    ageStart: 18,
    ageEnd: 100
  };

  selectAgeStart = () => {
    let arrayOption = [];
    for (let i = 0; i < this.state; i++) {
      arrayOption.push(i);
    }

    return arrayOption.map(item => <option key={item}>{item}</option>);
  }

  selectAgeEnd = () => {
    let arrayOption = [];
    for (let i = 0; i < 10; i++) {
      arrayOption.push(i);
    }

    return arrayOption.map(item => <option key={item}>{item}</option>);
  }

  render() {
    const { isActive } = this.state;
    return (
      <Mutation mutation={UPDATE_USER_PREFERENCE_MUTATION}>
      {
        () => {
          return (
            <div id='lgi-complete-search'>
              <div id='lgi-complete-search-header' onClick={() => this.setState({ isActive: !isActive })}>
                <div id='lgi-complete-search-header-title'>Recherche</div>
                <img id='lgi-complete-search-header-arrow' className={isActive ? 'search-box-active' : ''} src={bottomArrowIcon} />
              </div>
      
              {
                isActive ?
                <div id='lgi-complete-search-body'>
                  <div className='lgi-complete-search-body-box'>
                    <div className='lgi-complete-search-body-box-title'>âge</div>
                    <div className='lgi-complete-search-body-box-content'>
                      <select className='lgi-complete-search-body-box-content-selector'>{this.selectAgeStart()}</select>
                      <select className='lgi-complete-search-body-box-content-selector'>{this.selectAgeEnd()}</select>
                    </div>
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <button>sauvegarder</button>
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
};


export default SearchMutation;