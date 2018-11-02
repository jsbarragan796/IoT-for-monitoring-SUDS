require('dotenv').config()

const fs = require('fs')

const { LOG_DIRECTORY, KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC,
  INFLUX_DB_DATABASE, INFLUX_DB_HOST, INFLUX_DB_PORT,
  INFLUX_DB_USERNAME, INFLUX_DB_PASSWORD, INFLUX_DB_PROTOCOL } = require('./config')

fs.existsSync(LOG_DIRECTORY) || fs.mkdirSync(LOG_DIRECTORY)

const Influx = require('influx')

const influx = new Influx.InfluxDB({
  database: INFLUX_DB_DATABASE,
  host: INFLUX_DB_HOST,
  port: INFLUX_DB_PORT,
  username: INFLUX_DB_USERNAME,
  password: INFLUX_DB_PASSWORD,
  protocol: INFLUX_DB_PROTOCOL
}, {
  schema: [ {
    measurement: 'level',
    fields: {
      value: Influx.FieldType.FLOAT
    },
    tags: [
      'sensorId'
    ]
  } ]
})

const Kafka = require('node-rdkafka')

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`
}, {})

const { log } = require('./functions')

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
      const sensorId = parts[0]
      const measurementType = parts[1]
      const value = Number(parts[2])
      const timestamp = Number(parts[3])

      await influx.writePoints([{
        measurement: measurementType,
        tags: { sensorId },
        fields: { value },
        timestamp
      }])
    } catch (e) {
      log.error(e.message)
    }
  })
