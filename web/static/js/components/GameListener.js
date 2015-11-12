import React from 'react';
import DataSocket from '../data-socket';

const channel = 'game:lobby';

export default class GameListener extends React.Component {
  componentWillMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe() {
    this.unsubscribe();
    this.channelUnsub = DataSocket.subscribe(channel, () => this.queueRender());
  }

  unsubscribe() {
    if (this.channelUnsub) this.channelUnsub();
  }

  queueRender() {
    this.setState({});
  }

  render() {
    let data = DataSocket.getState(channel);

    if (data) {
      return this.props.children(data);
    } else {
      return <div>Loading...</div>;
    }
  }
}
