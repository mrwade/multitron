import _ from 'underscore';
import { Socket } from '../../../deps/phoenix/web/static/js/phoenix';

class DataSocket {
  constructor(onUpdate) {
    this.channels = {};
    this.listeners = {};
    this.state = {};

    this.socket = new Socket('/socket');
    this.socket.connect();

    setInterval(() => this.cleanupChannels(), 15000);
  }

  cleanupChannels() {
    let channelNames = _.keys(this.channels);
    channelNames.map(name => {
      if (!this.listeners[name] || this.listeners[name].length === 0) {
        this.channels[name].leave();
        delete this.channels[name];
        console.log('left channel ', name);
      }
    });
  }

  getChannel(channelName) {
    if (!this.channels[channelName]) {
      let channel = this.socket.channel(channelName, {});
      channel.on('update', data => this.onUpdate(channelName, data));
      channel.join().receive('ok',
        () => console.log('subscribed to: ', channelName));
      this.channels[channelName] = channel;
    }
    return this.channels[channelName];
  }

  getState(channelName) {
    return this.state[channelName];
  }

  subscribe(channelName, onUpdate) {
    this.getChannel(channelName);

    if (!this.listeners[channelName]) {
      this.listeners[channelName] = [];
    }
    this.listeners[channelName].push(onUpdate);

    let unsubscribe = () => {
      let index = this.listeners[channelName].indexOf(onUpdate);
      this.listeners[channelName].splice(index, 1);
    };
    return unsubscribe;
  }

  onUpdate(channelName, data) {
    if (this.listeners[channelName]) {
      this.state[channelName] = data;
      this.listeners[channelName].map(listener => listener(data));
    } else {
      console.log('no listeners for ', channelName);
    }
  }
}

export default new DataSocket();
