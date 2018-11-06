(async () => {
  require('dotenv').config()

  const fs = require('fs')

  const { LOG_DIRECTORY, INFLUX_DB_DATABASE, INFLUX_DB_HOST, INFLUX_DB_PORT,
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

  const { getConsumer } = require('./kafka')

  const consumer = await getConsumer()

  const { log } = require('./functions')

  consumer.connect()

  consumer.on('data', async (data) => {
    try {
      log.info(data.value.toString())
      const { value: valueMsg } = data

      const message = valueMsg.toString()
      console.log(`Crude data got ${message}`)
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
})()
