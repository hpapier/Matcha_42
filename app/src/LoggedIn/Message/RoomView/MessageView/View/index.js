// Modules imports.
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { SEND_MSG_MUTATION } from '../../../../../../query';
import { clearStore } from '../../../../../../store/action/synchronous';


// View Component.
class View extends Component {
  state = {
    inputMsg: '',
    inputErrorMsg: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  componentDidMount() {
    if (this.props.currentMsgRoom.length > 0)
      this.bodyRef.scrollTo(0, this.bodyRef.scrollHeight);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentMsgRoom.length > 0 && prevProps.currentMsgRoom.length !== this.props.currentMsgRoom.length)
      this.bodyRef.scrollTo(0, this.bodyRef.scrollHeight);
  }

  handleSubmitMsg = (e, mutation) => {
    e.preventDefault();

    if (!this.state.inputMsg) {
      if (!this._unmount)
        this.setState({ inputErrorMsg: 'Veuillez remplir le champs pour envoyer un message..' });
      return;
    }

    mutation({ variables: { toUser: this.props.roomInfo.partnerId, content: this.state.inputMsg }})
    .then(r => {
      if (!this._unmount)
        this.setState({ inputMsg: '', inputErrorMsg: '' });
    })
    .catch(e => {
      if (e.graphQLErrors && e.graphQLErrors[0]) {
        if (e.graphQLErrors[0].message === 'Not auth') {
          localStorage.removeItem('auth_token');
          this.props.clearStore();
          this.props.history.push('/');
        }
      }

      if (!this._unmount) {
        this.setState({ inputErrorMsg: 'Oups! Une erreur est survenu..'});
      }
    });
  }

  getDate = date => {
    if (!date)
      return 'Unknow date..';

    const notifDate = new Date(date);
    const timestamp = Math.abs(new Date() - notifDate);

    const diffH = new Date().getHours() - new Date(timestamp).getHours();
    if (diffH > 0) {
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
          month = 'févr.';
          break;
        case 2:
          month = 'mars';
          break;
        case 3:
          month = 'avr.';
          break;
        case 4:
          month = 'mai';
          break;
        case 5:
          month = 'juin';
          break;
        case 6:
          month = 'juil.';
          break;
        case 7:
          month = 'août';
          break;
        case 8:
          month = 'sept.';
          break;
        case 9:
          month = 'oct.';
          break;
        case 10:
          month = 'nov.';
          break;
        case 11:
          month = 'déc.';
          break;

        default: 'janv.'
      }

      return `${day} ${month}, ${hours}h${minutes}`;
    }
  };

  render() {
    const { user, currentMsgRoom, roomInfo } = this.props;
    return (
      <Mutation mutation={SEND_MSG_MUTATION}>
      {
        (sendUserMsg, { client }) => {
          this.client = client;
          return (
            <div id='lgi-message-message-view-box'>
              <div id='lgi-message-message-view-box-list'>
              {
                currentMsgRoom.length > 0 ?
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
                <div id='lgi-message-message-view-box-list-box-empty'>Aucun message disponible</div>
              }
              </div>

              <form id='lgi-message-message-view-box-input' onSubmit={e => this.handleSubmitMsg(e, sendUserMsg)}>
                <div id='lgi-message-message-view-box-input-element'>
                  <input autoComplete='off' type='text' value={this.state.inputMsg} placeholder='Écrivez quelque chose, un bonjour par exemple…' id='lgi-message-message-view-box-input-element-input' onChange={e => this.setState({ inputMsg: e.target.value })} />
                  <button disabled={this.state.inputMsg ? false : true} type='submit' id='lgi-message-message-view-box-input-element-submit'>envoyer</button>
                </div>
                { this.state.inputErrorMsg ? <div id='lgi-message-message-view-box-input-element-error'>{this.state.inputErrorMsg}</div> : null }
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

const mapDispatchToProps = dispatch => ({
  clearStore: () => dispatch(clearStore())
})

// Export.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(View));