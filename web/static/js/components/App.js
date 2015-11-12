import React from 'react';
import * as GameSocket from '../game-socket';
import GameListener from './GameListener';
import Board from './Board';
import Join from './Join';
import styles from './App.scss';

export default class App extends React.Component {
  render() {
    return (
      <GameListener>
        {game =>
          <div>
            {this.renderCurrentView(game)}
            <br />
            {JSON.stringify(game)}
          </div>
        }
      </GameListener>
    );
  }

  renderCurrentView(game) {
    if (game.players[GameSocket.getPlayerId()])
      return this.renderBoard(game);
    else
      return this.renderJoin();
  }

  renderBoard(game) {
    return <Board game={game} />;
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
