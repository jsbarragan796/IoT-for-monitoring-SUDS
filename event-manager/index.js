(async () => {
  require('dotenv').config()

  const fs = require('fs')

  const { LOG_DIRECTORY } = require('./config')

  fs.existsSync(LOG_DIRECTORY) || fs.mkdirSync(LOG_DIRECTORY)

  const { log, findMostRecentEvent, endEventAndCreateOne, updateLastMeasurementDate } = require('./tools')
  const { getConsumer, getProducer } = require('./kafka')

  const consumer = await getConsumer()
  const producer = await getProducer()

  consumer
    .on('data', async (data) => {
      try {
        log.info(data.value.toString())
        const { value: valueMsg } = data

        const message = valueMsg.toString()
        const parts = message.split('_$_')
        const timestamp = Number(parts[3])

        console.log(`Event manager got message ${message}`)

        const { _id, lastMeasurementDate: mostRecentEventLastMeasurementDate } = await findMostRecentEvent()

        if (mostRecentEventLastMeasurementDate + 1000000000 * 60 * 30 < timestamp) await endEventAndCreateOne(producer, _id, timestamp)
        else await updateLastMeasurementDate(_id, timestamp)
      } catch (e) {
        log.error(e.message)
      }
    })
})()
