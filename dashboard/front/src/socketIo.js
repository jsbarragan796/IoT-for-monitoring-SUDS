import io from 'socket.io-client';

let socket;
const connectionHandler = {
  subCurrentEvent: (cb) => {
    if (!socket) socket = io(`${process.env.REACT_APP_HISTORICAL_SERVING_SOCKET}`);
    socket.emit('sub-are-current-events', true)
    socket.on('are-current-events', bool => cb(bool));
  },
  subRealTimeEvents: (update, enter ) => {
    if (!socket) socket = io(`${process.env.REACT_APP_HISTORICAL_SERVING_SOCKET}`);
    socket.emit('sub-current-events', true)
    socket.on('update-current-events', event => update(event));
    socket.on('current-events', event => enter(event));
  }
};

export default connectionHandler;
