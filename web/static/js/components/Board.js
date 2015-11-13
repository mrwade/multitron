import classNames from 'classnames';
import React from 'react';
import { Group, Layer, Surface } from 'react-canvas';
import _ from 'underscore';
import { channel, getPlayerId } from '../game-socket';
import styles from './Board.scss';

const SCALE = 5;

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
    const boardStyle = { width: width * SCALE, height: height * SCALE };

    return (
      <div className={classNames(this.props.className, styles.board)}
        style={boardStyle}>
        <Surface {...boardStyle} left={0} top={0}>
          {_.map(game.players, (player, id) =>
            <Group key={id}>
              {_.map(player.positions, (position, i) =>
                <Layer key={i}
                  style={this.styleForPosition(player, position)} />
              )}
            </Group>
          )}
        </Surface>
        {this.renderInstruction()}
      </div>
    );
  }

  renderInstruction() {
    const { game } = this.props;
    if (!game.players[getPlayerId()].positions) {
      return (
        <div key="instruction" className={styles.instruction}>
          Press [space] to start
        </div>
      );
    }
  }

  styleForPosition(player, position) {
    const retinaCorrection = 1.05;
    const [left, top] = position;
    return {
      backgroundColor: player.color,
      left: left * SCALE,
      height: SCALE * retinaCorrection,
      top: top * SCALE,
      width: SCALE * retinaCorrection
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
