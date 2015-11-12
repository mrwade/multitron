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
      <GameListener>
        {game =>
          <div>
            {JSON.stringify(game)}
            {this.renderCurrentView(game)}
          </div>
        }
      </GameListener>
    );
  }

  renderCurrentView(game) {
    if (game.players[GameSocket.getPlayerId()])
      return <div>Joined!</div>;
    else
      return this.renderJoin();
  }

  renderJoin() {
    return <Join onJoin={::this.onJoin} />;
  }

  onJoin(name) {
    GameSocket.channel
    .push('join', { name })
    .receive('ok', ({ player_id }) => GameSocket.setPlayerId(player_id));
  }
}
