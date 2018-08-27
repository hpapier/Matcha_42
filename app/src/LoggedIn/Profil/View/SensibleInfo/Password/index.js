// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';


// Locals imports.
import './index.sass';
import { UPDATE_PASSWORD_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';


class Password extends Component {
  state = {
    modifActive: false,
    errorMsg: '',
    previousPwd: '',
    newPwd: '',
    ePrePwd: '',
    eNewPwd: ''
  }

  setNewPwd = mutation => {
    const { modifActive, errorMsg, previousPwd, newPwd, ePrePwd, eNewPwd } = this.state;
    this.setState({ ePrePwd: '', errorMsg: '', eNewPwd: '' });

    if (!previousPwd || !newPwd) {
      if (!previousPwd)
        this.setState({ ePrePwd: 'Veuillez remplir le champs.' });
      if (!newPwd)
        this.setState({ eNewPwd: 'Veuillez remplir le champs.' });
      return;
    }

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (previousPwd.match(regexp) || newPwd.match(regexp)) {
      if (previousPwd.match(regexp))
        this.setState({ ePrePwd: 'Caractères spéciaux interdits.' });
      if (newPwd.match(regexp))
        this.setState({ eNewPwd: 'Caractères spéciaux interdits.' });
      return;
    }

    mutation({ variables: { pPwd: previousPwd, nPwd: newPwd }})
    .then(r => {
      if (r.data.updateUserPassword.data === 'Success')
        this.setState({ modifActive: false, errorMsg: '', previousPwd: '', newPwd: '', ePrePwd: '', eNewPwd: '' });
    })
    .catch(e => {
      if (e.message === 'GraphQL error: Invalid pwd')
        this.setState({ ePrePwd: 'Mot de passe incorrect', newPwd: '', previousPwd: '' });
      else if (e.message !== 'GraphQL error: Invalid pwd')
        this.setState({ ePrePwd: '', errorMsg: 'Oups! Une erreur est survenue..', eNewPwd: '' });
    })
  }

  render() {
    return (
      <Mutation mutation={UPDATE_PASSWORD_MUTATION}>
      {
        (updateUserPassword, { loading }) => {
          const { modifActive, errorMsg, previousPwd, newPwd, ePrePwd, eNewPwd } = this.state;
          return (
            <div>
              <div id='lgi-profil-view-pi-password'>
                <div id='lgi-profil-view-pi-password-box1'>
                  <div id='lgi-profil-view-pi-password-box1-title'>Mot de passe</div>
                  <div id='lgi-profil-view-pi-password-box1-content'>*********</div>
                </div>
                <div id='lgi-profil-view-pi-password-box2'>
                {
                  loading ? 
                  <div id='lgi-profil-view-pi-password-box2-loading'></div> :
                  <button
                    onClick={() => this.setState({ modifActive: !modifActive })}
                    id='lgi-profil-view-pi-password-box2-edit'
                  >
                    <img src={editIcon} alt='edit' id='lgi-profil-view-pi-password-box2-edit-icon' />
                  </button>
                }
                </div>
              </div>

              {
                modifActive ? 
                <div>
                  <div className='lgi-profil-view-pi-password-modif-box'>
                    <div className='lgi-profil-view-pi-password-modif-title'>Mot de passe actuel</div>
                    <input
                      type='password'
                      className='lgi-profil-view-pi-password-modif-input'
                      placeholder='Saisissez votre mot de passe actuel..'
                      onChange={e => this.setState({ previousPwd: e.target.value })}
                      autoFocus
                      value={previousPwd}
                    />
                    { ePrePwd ? <div className='lgi-profil-view-pi-password-modif-error'>{ePrePwd}</div> : null }
                  </div>
                  <div className='lgi-profil-view-pi-password-modif-box'>
                    <div className='lgi-profil-view-pi-password-modif-title'>Nouveau mot de passe</div>
                    <input type='password' className='lgi-profil-view-pi-password-modif-input' placeholder='Saisissez votre nouveau mot de passe..' onChange={e => this.setState({ newPwd: e.target.value })} value={newPwd} />
                    { eNewPwd ? <div className='lgi-profil-view-pi-password-modif-error'>{eNewPwd}</div> : null }
                  </div>
                  <div className='lgi-profil-view-pi-password-modif-box'>
                    <button id='lgi-profil-view-pi-password-modif-submit' onClick={() => this.setNewPwd(updateUserPassword)}>Valider</button>
                    { errorMsg ? <div id='lgi-profil-view-pi-password-modif-error'>{errorMsg}</div> : null }
                  </div>
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


export default Password;