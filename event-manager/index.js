(async () => {
  require('dotenv').config()

  const cron = require('node-cron')
  const fs = require('fs')
  const bunyan = require('bunyan')
  const RotatingFileStream = require('bunyan-rotating-file-stream')

  const { LOG_DIRECTORY, KAFKA_TOPIC_EVENT_STARTED, KAFKA_TOPIC_MEASUREMENT, CRON_SCHEDULE } = require('./config')

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

  const { findMostRecentEvent, createEvent, endEvent, updateLastMeasurementDate } = require('./tools')(producer)

  consumer.on('data', async (data) => {
    try {
      log.info(data.value.toString())
      const { value: valueMsg, topic } = data

      const message = valueMsg.toString()
      const parts = message.split('_$_')
      const timestamp = Number(parts[0])

      console.log(`Event manager got message ${message} from topic ${topic}`)

      if (topic === KAFKA_TOPIC_EVENT_STARTED) await createEvent(timestamp)
      else if (topic === KAFKA_TOPIC_MEASUREMENT) {
        const { _id } = await findMostRecentEvent()

        await updateLastMeasurementDate(_id, timestamp)
      }
    } catch (e) {
      log.error(e.message)
    }
  })

  cron.schedule(CRON_SCHEDULE, async () => {
    const { _id, lastMeasurementDate } = await findMostRecentEvent()
    const timestamp = new Date().getTime() * 1000

    if (lastMeasurementDate + 1000000000 * 60 * 30 < timestamp) await endEvent(_id, timestamp)
  })
})()

// if (topic === EVENT_FINISHED) await endEvent(_id, timestamp)
