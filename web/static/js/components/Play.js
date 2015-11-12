import React from 'react';
import Board from './Board';
import Leaderboard from './Leaderboard';
import styles from './Play.scss';

export default class Play extends React.Component {
  render() {
    const { game } = this.props;

    return (
      <div className={styles.container}>
        <Board className={styles.board} game={game} />
        <Leaderboard className={styles.leaderboard} game={game} />
      </div>
    );
  }
}
