import classNames from 'classnames';
import React from 'react';
import _ from 'underscore';
import { channel } from '../game-socket';
import styles from './Board.scss';

const SCALE = 3;

const SPAWN_KEY = 32;
const DIRECTION_KEYS = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    _.bindAll(this, 'onKeyDown');
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    const { game } = this.props;
    const [width, height] = game.board_size;

    return (
      <div className={classNames(this.props.className, styles.board)}
        style={{ width: width * SCALE, height: height * SCALE }}>
        {_.map(game.players, (player, id) =>
          <div key={id} style={{ position: 'relative' }}>
            {_.map(player.positions, (position, i) =>
              <div key={i} style={this.styleForPosition(position)} />
            )}
          </div>
        )}
      </div>
    );
  }

  styleForPosition(position) {
    const [left, top] = position;
    return {
      background: 'red',
      left: left * SCALE,
      height: SCALE,
      position: 'absolute',
      top: top * SCALE,
      width: SCALE
    };
  }

  onKeyDown(event) {
    let direction = DIRECTION_KEYS[event.keyCode];
    if (direction) {
      channel.push('direction', direction);
    } else if (event.keyCode === SPAWN_KEY) {
      channel.push('spawn');
    }
  }
}
