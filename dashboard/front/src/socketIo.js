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
    socket.on('are-current-events', bool => cb(bool));
    console.log("subcreov")
  },
  close: () => {
    if (socket) {
      socket.close();
      socket = undefined;
    }
  }
};

export default connectionHandler;
