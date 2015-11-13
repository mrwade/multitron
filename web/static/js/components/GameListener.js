import raf from 'raf';
import React from 'react';
import _ from 'underscore';
import DataSocket from '../data-socket';

const channel = 'game:lobby';

export default class GameListener extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    _.bindAll(this, 'queueRender');
  }

  componentDidMount() {
    raf(this.queueRender);
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
    raf.cancel(this.queueRender);
  }

  subscribe() {
    this.unsubscribe();
    this.channelUnsub = DataSocket.subscribe(channel, function() {});
  }

  unsubscribe() {
    if (this.channelUnsub) this.channelUnsub();
  }

  queueRender() {
    let data = DataSocket.getState(channel);
    if (this.lastData != data) {
      this.setState({ data });
      this.lastData = data;
    }
    raf(this.queueRender);
  }

  render() {
    const { data } = this.state;
    if (data) {
      return this.props.children(data);
    } else {
      return <div>Loading...</div>;
    }
  }
}
