import io from 'socket.io-client';

let socket;
const connectionHandler = {
  subscribeToTimer: (cb) => {
    if (!socket) socket = io(`${process.env.REACT_APP_HISTORICAL_SERVING_SOCKET}`);
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 3000);
  },
  subCurrentEvent: (cb) => {
    if (!socket) socket = io(`${process.env.REACT_APP_HISTORICAL_SERVING_SOCKET}`);
    socket.emit('sub-are-current-events', true)
    socket.on('are-current-events', bool => cb(bool));
  },
  subRealTimeEvents: (pageNumber, enter, update, exit ) => {
    if (!socket) socket = io(`${process.env.REACT_APP_HISTORICAL_SERVING_SOCKET}`);
    socket.emit('get-current-events', pageNumber)
    socket.on('current-events', event => enter(event));
    socket.on('update-current-events', event => update(event));
    socket.on('refresh-current-events', bool => exit(bool));
  },
  close: () => {
    if (socket) {
      socket.close();
      socket = undefined;
    }
  }
};

export default connectionHandler;
