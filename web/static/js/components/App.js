import React from 'react';
import * as GameSocket from '../game-socket';
import GameListener from './GameListener';
import Join from './Join';
import styles from './App.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <GameListener>
          {game =>
            <div>{JSON.stringify(game)}</div>
          }
        </GameListener>
        {this.renderJoin()}
      </div>
    );
  }

  renderJoin() {
    return <Join onJoin={::this.onJoin} />;
  }

  onJoin(name) {
    const { playerId } = GameSocket;
    GameSocket.channel.push('join', { id: playerId, name });
  }
}
