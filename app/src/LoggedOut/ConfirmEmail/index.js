// Modules imports.
import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';


// Local import.
import { EMAIL_TOKEN_VERIFICATION_QUERY } from '../../../query';
import backgroundImage1 from '../../../assets/bg-1.jpg';
import heartIcon from '../../../assets/heart.svg';
import './index.sass';


// Confirm Email Component
const ConfirmEmail = props => {
  const emailToken = props.match.params.token;

  const getCorrectMsg = msg => {
    if (msg === 'Success')
      return 'Votre compte a bien été confirmé.'
    else if (msg === 'Invalid token')
      return 'Code invalide';
    else
      return 'Une erreur de serveur est survenue.';
  }

  return (
    <Query query={EMAIL_TOKEN_VERIFICATION_QUERY} variables={{ emailToken }}>
    {
      ({ loading, error, data }) => {
        return (
          <div id='lgo-homepage-email-page'>
            <img id='lgo-homepage-background-email-page' src={backgroundImage1} alt='background' />
            <div id='lgo-homepage-view-email-page'>
              <div id='lgo-homepage-view-response-email-page'>
                {
                  loading ? 
                  <div id='lgo-homepage-view-response-loading-email-page'>loading</div> :
                    error ?
                    <div className='lgo-homepage-view-response-error-email-page'>{typeof error === 'object' ? 'Une erreur de serveur est survenue.' : error}</div> :
                      data ?
                      <div id='lgo-homepage-view-response-box-email-page'>
                        <div className={ data.emailTokenVerification.message !== 'Success' ? 'lgo-homepage-view-response-error-email-page' : 'lgo-homepage-view-response-success-email-page'}>{getCorrectMsg(data.emailTokenVerification.message)}</div>
                      </div> : 
                      null
                }
                { !loading ? <Link id='lgo-homepage-view-response-box-link-email-page'to='/'>Retour au site</Link> : null }
              </div>
            </div>
            <div id='lgo-homepage-box-email-page'>
              <div id='lgo-homage-box-copyright-email-page'>©hpapier 2017-2018</div>
            </div>
          </div>
        );
      }
    }
    </Query>
  );
}


// Export.
export default ConfirmEmail;