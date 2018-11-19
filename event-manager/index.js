(async () => {
  require('dotenv').config()

  const fs = require('fs')
  const bunyan = require('bunyan')
  const RotatingFileStream = require('bunyan-rotating-file-stream')

  const { LOG_DIRECTORY } = require('./config')

  fs.existsSync(LOG_DIRECTORY) || fs.mkdirSync(LOG_DIRECTORY)

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

  const { getConsumer, getProducer } = require('./kafka')

  const consumer = await getConsumer()
  const producer = await getProducer()

  const { findMostRecentEvent, endEventAndCreateOne, updateLastMeasurementDate } = require('./tools')(producer)

  consumer.on('data', async (data) => {
    try {
      log.info(data.value.toString())
      const { value: valueMsg } = data

      const message = valueMsg.toString()
      const parts = message.split('_$_')
      const timestamp = Number(parts[3])

      console.log(`Event manager got message ${message}`)

      const { _id, lastMeasurementDate: mostRecentEventLastMeasurementDate } = await findMostRecentEvent()

      if (mostRecentEventLastMeasurementDate + 1000000000 * 60 * 30 < timestamp) await endEventAndCreateOne(_id, timestamp, mostRecentEventLastMeasurementDate)
      else await updateLastMeasurementDate(_id, timestamp)
    } catch (e) {
      log.error(e.message)
    }
  })
})()
