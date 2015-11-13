import classNames from 'classnames';
import React from 'react';
import _ from 'underscore';
import styles from './Leaderboard.scss';

const playerScore = p => p.positions ? p.positions.length : 0

export default class Leaderboard extends React.Component {
  render() {
    const { game } = this.props;
    const players = _.sortBy(_.values(game.players), playerScore).reverse();

    return (
      <table className={classNames(this.props.className, styles.leaderboard)}>
        <tbody>
          {_.map(players, player =>
            <tr key={player.name} className={this.rowClassNames(player)}
              style={this.rowStyle(player)}>
              <td className={styles.scoreCell}>{playerScore(player)}</td>
              <td className={styles.nameCell}>{player.name}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  rowClassNames(player) {
    let names = {};
    names[styles.inactivePlayer] = !playerScore(player);
    return classNames(names);
  }

  rowStyle(player) {
    return { color: player.color };
  }
}
