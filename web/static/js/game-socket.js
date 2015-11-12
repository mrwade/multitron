import uuid from 'uuid';
import DataSocket from './data-socket';

let playerId;

export const channel = DataSocket.getChannel('game:lobby');

export function getPlayerId() { return playerId; }
export function setPlayerId(id) { playerId = id; }
