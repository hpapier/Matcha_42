// Modules imports.
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';


// MessageSubscriberView Component.
class MessageSubscriberView extends Component {
  componentDidMount() {
    this.props.subscribeToMoreNotification();
  }

  render() {
    const { count } = this.props.data;
    if (count === 0)
      return null;

    return <div className={`lgi-notification-subscriber-view ${this.props.location.pathname === '/message' ? '-active' : ''}`}>{count}</div>
  }
}


// Export.
export default withRouter(MessageSubscriberView);