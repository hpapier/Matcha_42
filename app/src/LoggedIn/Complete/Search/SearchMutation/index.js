// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Local import.
import './index.sass';
import bottomArrowIcon from '../../../../../assets/bottom-arrow.svg';
import removeIcon from '../../../../../assets/white-cancel.svg';
import { UPDATE_USER_PREFERENCE_MUTATION } from '../../../../../query';
import { saveUserPref, clearStore } from '../../../../../store/action/synchronous';


// SearchMutation Component.
class SearchMutation extends Component {
  state = {
    isActive: false,
    ageStart: 18,
    ageEnd: 100,
    scoreStart: 10,
    scoreEnd: 100,
    location: 10,
    tags: [],
    tagsInput: '',
    errorMsg: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  selectAgeStart = () => {
    let arrayOption = [];
    for (let i = 18; i <= 100; i++)
      arrayOption.push(i);
    return arrayOption.map(item => <option key={item} value={item}>{item}</option>);
  }

  selectAgeEnd = () => {
    const { ageStart } = this.state; 
    let arrayOption = [];
    for (let i = ageStart + 1; i <= 100; i++)
      arrayOption.push(i);
    return arrayOption.map(item => <option key={item} value={item}>{item}</option>);
  }

  selectScoreStart = () => {
    let arrayOption = [];
    for (let i = 10; i <= 100; i++)
      arrayOption.push(i);
    return arrayOption.map(item => <option key={item} value={item}>{item}</option>);
  }

  selectScoreEnd = () => {
    const { scoreStart } = this.state; 
    let arrayOption = [];
    for (let i = scoreStart + 1; i <= 100; i++)
      arrayOption.push(i);
    return arrayOption.map(item => <option key={item} value={item}>{item}</option>);
  }

  addTags = tag => {
    const { tags } = this.state;
    let isPresent = false;
    tags.forEach(item => {
      if (item.id === tag.id)
        isPresent = true;
    });

    if (isPresent)
      this.setState({ tagsInput: '' });
    else
      this.setState({ tags: [ ...tags, tag ], tagsInput: '' });
  }

  removeTags = tag => {
    const { tags } = this.state;
    const list = tags.filter(item => tag.id !== item.id);
    this.setState({ tags: list });
    return;
  }

  getTagsProposition = () => {
    const { interests } = this.props;
    const { tagsInput } = this.state;

    if (!tagsInput)
      return null;

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (tagsInput.match(regexp))
      return <div className='lgi-complete-search-body-box-content-interest-input-noresult'>Aucun résultats</div>;
    
    const reg = new RegExp(tagsInput);
    const list = interests.filter(item => item.name.match(reg));
    if (list.length > 0)
      return <div className='lgi-complete-search-body-box-content-interest-input-result' onClick={() => this.addTags(list[0])}>#{list[0].name}</div>;
    else
      return <div className='lgi-complete-search-body-box-content-interest-input-noresult'>Aucun résultats</div>;
  }

  updateUserPrefMech = (e, mutation) => {
    e.preventDefault();
    const { ageStart, ageEnd, scoreStart, scoreEnd, location, tags } = this.state;
    const tagsToJson = JSON.stringify(tags);
    mutation({ variables: { ageStart, ageEnd, scoreStart, scoreEnd, location, tags: tagsToJson }})
    .then(result => {
      if (!this._unmount)
        this.setState({ ageStart: 18, ageEnd: 100, scoreStart: 10, scoreEnd: 100, location: 10, tags: [], isActive: false, errorMsg: '' });

      this.props.saveUserPref(result.data.updateUserPreferences);
    })
    .catch(error => {
      if (error.graphQLErrors[0].message === 'Not auth') {
        localStorage.removeItem('auth_token');
        this.props.clearStore();
      }

      if (!this._unmount) {
          this.setState({ errorMsg: 'Oups! Une erreur est survenue..' });
      }
    });
  }


  render() {
    const { isActive, location, tagsInput, errorMsg, tags } = this.state;
    return (
      <Mutation mutation={UPDATE_USER_PREFERENCE_MUTATION}>
      {
        (updateUserPreferences, { loading }) => {
          return (
            <div id='lgi-complete-search'>
              <div id='lgi-complete-search-header' onClick={() => this.setState({ isActive: !isActive })}>
                <div id='lgi-complete-search-header-title'>Recherche</div>
                <img id='lgi-complete-search-header-arrow' className={isActive ? 'search-box-active' : ''} src={bottomArrowIcon} />
              </div>
      
              {
                isActive ?
                <form id='lgi-complete-search-body' onSubmit={e => this.updateUserPrefMech(e, updateUserPreferences)}>

                  <div className='lgi-complete-search-body-box'>
                    <div className='lgi-complete-search-body-box-title'>âge</div>
                    <div className='lgi-complete-search-body-box-content'>
                      <select
                        className='lgi-complete-search-body-box-content-selector'
                        onChange={e => this.setState({ ageStart: parseInt(e.target.value), ageEnd: (parseInt(e.target.value) >= this.state.ageEnd) ? parseInt(e.target.value) + 1 : this.state.ageEnd })}
                      >
                        {this.selectAgeStart()}
                      </select>
                      <select
                        className='lgi-complete-search-body-box-content-selector'
                        onChange={e => this.setState({ ageEnd: parseInt(e.target.value) })}
                        defaultValue={100}
                      >
                        {this.selectAgeEnd()}
                      </select>
                    </div>
                  </div>

                  <div className='lgi-complete-search-body-box'>
                    <div className='lgi-complete-search-body-box-title'>score de popularité</div>
                    <div className='lgi-complete-search-body-box-content'>
                      <select
                        className='lgi-complete-search-body-box-content-selector'
                        onChange={e => this.setState({ scoreStart: parseInt(e.target.value), scoreEnd: (parseInt(e.target.value) >= this.state.scoreEnd) ? parseInt(e.target.value) + 1 : this.state.scoreEnd })}
                      >
                        {this.selectScoreStart()}
                      </select>
                      <select
                        className='lgi-complete-search-body-box-content-selector'
                        onChange={e => this.setState({ scoreEnd: parseInt(e.target.value) })}
                        defaultValue={100}
                      >
                        {this.selectScoreEnd()}
                      </select>
                    </div>
                  </div>

                  <div className='lgi-complete-search-body-box'>
                    <div className='lgi-complete-search-body-box-title'>proximité géographique: {location}km</div>
                    <div className='lgi-complete-search-body-box-content'>
                      <input
                        type='range'
                        className='lgi-complete-search-body-box-content-input'
                        min={10}
                        max={100}
                        onChange={e => this.setState({ location: parseInt(e.target.value) })}
                        value={location}
                      />
                    </div>
                  </div>

                  <div className='lgi-complete-search-body-box'>
                    <div className='lgi-complete-search-body-box-title'>intérêts</div>
                    <div className='lgi-complete-search-body-box-content-interest'>
                      <input 
                        type='text' 
                        placeholder='Saisissez un tag..' 
                        className='lgi-complete-search-body-box-content-interest-input' 
                        onChange={e => this.setState({ tagsInput: e.target.value })} 
                        value={tagsInput}
                      />
                      {this.getTagsProposition()}
                      <div id='lgi-complete-search-body-box-content-interest-tags' className={tags.length > 0 ? 'tags-present' : ''}>
                        {
                          this.state.tags.map(item => (
                            <div className='lgi-complete-search-body-box-content-interest-tags-item' key={item.id}>
                              <div className='lgi-complete-search-body-box-content-interest-tags-text'>{item.name}</div>
                              <button className='lgi-complete-search-body-box-content-interest-tags-btn' onClick={() => this.removeTags(item)}>
                                <img className='lgi-complete-search-body-box-content-interest-tags-icon' src={removeIcon} alt='remove-icon' />
                              </button>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>

                  {
                    loading ?
                    <div className='lgi-complete-search-body-submit-loading'><div className='lgi-complete-search-body-submit-loading-animation'></div></div> :
                    <button className='lgi-complete-search-body-submit' type='submit'>sauvegarder</button>
                  }

                  {errorMsg ? <div className='lgi-complete-search-body-error'>{errorMsg}</div> : null}
                </form> :
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


const mapStateToProps = state => ({
  interests: state.interests
});

const mapDispatchToProps = dispatch => ({
  saveUserPref: data => dispatch(saveUserPref(data)),
  clearStore: () => dispatch(clearStore())
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchMutation);