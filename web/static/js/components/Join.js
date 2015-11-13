import React from 'react';
import styles from './Join.scss';

export default class Join extends React.Component {
  render() {
    return (
      <div>
        Nickname: <input type="text" onKeyUp={::this.onKeyUp} />
      </div>
    );
  }

  onKeyUp(event) {
    if (event.keyCode === 13) {
      const { value } = event.target;

      if (value.length)
        this.props.onJoin(value);
      else
        alert('You must enter a nickname');
    }
  }
}
