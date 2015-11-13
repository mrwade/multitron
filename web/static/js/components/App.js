import React from 'react';
import _ from 'underscore';
import * as GameSocket from '../game-socket';
import GameListener from './GameListener';
import Play from './Play';
import Join from './Join';
import styles from './App.scss';

export default class App extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.title}>multitron</div>
        <GameListener>
          {game =>
            <div>
              {this.renderCurrentView(game)}
            </div>
          }
        </GameListener>
      </div>
    );
  }

  renderCurrentView(game) {
    if (game.players[GameSocket.getPlayerId()])
      return this.renderPlay(game);
    else
      return this.renderJoin();
  }

  renderPlay(game) {
    return <Play game={game} />;
  }

  renderJoin() {
    return <Join onJoin={::this.onJoin} />;
  }

  onJoin(name) {
    const color = _.sample(["#f00","#0f0","#ff0","#0ff","#f0f","#fff"]);

    GameSocket.channel
    .push('join', { name, color })
    .receive('ok', ({ player_id }) => GameSocket.setPlayerId(player_id));
  }
}
