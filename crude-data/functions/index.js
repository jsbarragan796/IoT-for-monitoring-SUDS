var bunyan = require('bunyan')
var RotatingFileStream = require('bunyan-rotating-file-stream')

const { LOG_DIRECTORY } = require('../config')

const log = bunyan.createLogger({
  name: 'log',
  streams: [{
    stream: new RotatingFileStream({
      path: `${LOG_DIRECTORY}/log.log`,
      period: '1d',
      rotateExisting: true,
      threshold: '10m'
    })
  }]
})

module.exports = {
  log
}
