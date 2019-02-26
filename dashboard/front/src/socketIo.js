import openSocket from 'socket.io-client';

let socket;
const connectionHandler = {
  subscribeToTimer: (cb) => {
    if (!socket) socket = openSocket('http://localhost:8000');
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 3000);
  },
  close: () => {
    if (socket) {
      socket.close();
      socket = undefined;
    }
  }
};

export default connectionHandler;
