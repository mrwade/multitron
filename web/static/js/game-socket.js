import uuid from 'uuid';
import DataSocket from './data-socket';

export const playerId = uuid.v4();
export const channel = DataSocket.getChannel('game:lobby');
