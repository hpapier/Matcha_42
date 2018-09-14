// Modules imports.
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { SEND_MSG_MUTATION } from '../../../../../../query';


// View Component.
class View extends Component {
  state = {
    inputMsg: '',
    inputErrorMsg: ''
  };

  componentDidMount() {
    console.log(this.bodyRef.scrollTo(0, this.bodyRef.scrollHeight));
  }

  handleSubmitMsg = mutation => {

  }

  getDate = date => {
    if (!date)
      return 'Unknow date..';

    const notifDate = new Date(date);
    const timestamp = Math.abs(new Date() - notifDate);

    if (timestamp < 86400000) {
      const h = notifDate.getHours() < 10 ? '0' + notifDate.getHours() : notifDate.getHours();
      const m = notifDate.getMinutes() === 0 ? '' : notifDate.getMinutes() < 10 ? '0' + notifDate.getMinutes() : notifDate.getMinutes();

      return `${h}h${m}`;
    } else {
      const day = (notifDate.getDate() < 10) ? '0' + notifDate.getDate() : notifDate.getDate();
      let month;
      const year = notifDate.getFullYear();
      const hours = (notifDate.getHours() < 10) ? '0' + notifDate.getHours() : notifDate.getHours();
      const minutes = (notifDate.getMinutes() < 10) ? '0' + notifDate.getMinutes() : notifDate.getMinutes();

      switch (notifDate.getMonth()) {
        case 1:
          month = 'février';
          break;
        case 2:
          month = 'mars';
          break;
        case 3:
          month = 'avril';
          break;
        case 4:
          month = 'mai';
          break;
        case 5:
          month = 'juin';
          break;
        case 6:
          month = 'juillet';
          break;
        case 7:
          month = 'août';
          break;
        case 8:
          month = 'septembre';
          break;
        case 9:
          month = 'octobre';
          break;
        case 10:
          month = 'novembre';
          break;
        case 11:
          month = 'décembre';
          break;

        default: 'Janvier'
      }

      return `${day} ${month} ${year}, ${hours}h${minutes}`;
    }
  };

  render() {
    const { user, currentMsgRoom, roomInfo } = this.props;
    return (
      <Mutation mutation={SEND_MSG_MUTATION}>
      {
        sendUserMsg => {
          return (
            <div id='lgi-message-message-view-box'>
              <div id='lgi-message-message-view-box-list'>
              {
                currentMsgRoom ?
                <div id='lgi-message-message-view-box-list-box' ref={ref => this.bodyRef = ref}>
                {
                  currentMsgRoom.map(item => (
                    <div className={item.fromUser === user.id ? 'lgi-message-message-view-box-list-box-sender' : 'lgi-message-message-view-box-list-box-receiver'} key={item.id}>
                      <div className={item.fromUser === user.id ? 'lgi-message-message-view-box-list-box-img-sender' : 'lgi-message-message-view-box-list-box-img-receiver'}>
                        <img src={item.fromUser === user.id ? roomInfo.partnerPp : user.profilPicture} alt='profil-img' className='lgi-message-message-view-box-list-box-img-el' />
                      </div>
                      <div className={item.fromUser === user.id ? 'lgi-message-message-view-box-list-box-sender-msg' : 'lgi-message-message-view-box-list-box-receiver-msg'}>
                        <div className={item.fromUser === user.id ? 'lgi-message-message-view-box-list-box-sender-msg-content' : 'lgi-message-message-view-box-list-box-receiver-msg-content'}>{item.content}</div>
                        <div className={item.fromUser === user.id ? 'lgi-message-message-view-box-list-box-sender-msg-date' : 'lgi-message-message-view-box-list-box-receiver-msg-date'}>{this.getDate(item.date)}</div>
                      </div>
                    </div>
                  ))
                }
                </div> :
                <div>Aucun message disponible</div>
              }
              </div>

              <form id='lgi-message-message-view-box-input' onSubmit={() => this.handleSubmitMsg(sendUserMsg)}>
                <div>
                  <input type='text' placeholder='Écrivez quelque chose, un bonjour par exemple…' />
                  <button type='submit'>envoyer</button>
                </div>
                { this.state.inputErrorMsg ? <div>{this.state.inputErrorMsg}</div> : null }
              </form>
            </div>

          )
        }
      }
      </Mutation>
    );
  };
};


// Redux connection.
const mapStateToProps = state => ({
  user: state.user,
  currentMsgRoom: state.currentMsgRoom
});


// Export.
export default connect(mapStateToProps, null)(withRouter(View));