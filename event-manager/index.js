require('dotenv').config()

const fs = require('fs')

const { LOG_DIRECTORY, KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC } = require('./config')

fs.existsSync(LOG_DIRECTORY) || fs.mkdirSync(LOG_DIRECTORY)

const Kafka = require('node-rdkafka')

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`
}, {})

const { log, findMostRecentEvent, endEventAndCreateOne, updateLastMeasurementDate } = require('./functions')

consumer.connect()

consumer
  .on('ready', () => {
    consumer.subscribe([KAFKA_TOPIC])
    consumer.consume()
  })
  .on('data', async (data) => {
    try {
      log.info(data.value.toString())
      const { value: valueMsg } = data

      const message = valueMsg.toString()
      const parts = message.split('_$_')
      const timestamp = Number(parts[3])

      const { _id, lastMeasurementDate: mostRecentEventLastMeasurementDate } = await findMostRecentEvent()

      if (mostRecentEventLastMeasurementDate + 1000000000 * 60 * 30 < timestamp) await endEventAndCreateOne(_id, timestamp)
      else await updateLastMeasurementDate(_id, timestamp)
    } catch (e) {
      log.error(e.message)
    }
  })
