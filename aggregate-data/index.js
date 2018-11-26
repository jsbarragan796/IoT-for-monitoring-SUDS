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

  const { getConsumer } = require('./kafka')

  const consumer = await getConsumer()

  const MongoClient = require('mongodb').MongoClient
  const ObjectID = require('mongodb').ObjectID

  const Influx = require('influx')

  const { INFLUX_DB_DATABASE, INFLUX_DB_HOST, INFLUX_DB_PORT,
    INFLUX_DB_USERNAME, INFLUX_DB_PASSWORD, INFLUX_DB_PROTOCOL, MONGODB_URI } = require('./config')

  const influx = new Influx.InfluxDB({
    database: INFLUX_DB_DATABASE,
    host: INFLUX_DB_HOST,
    port: INFLUX_DB_PORT,
    username: INFLUX_DB_USERNAME,
    password: INFLUX_DB_PASSWORD,
    protocol: INFLUX_DB_PROTOCOL
  }, {
    schema: [ {
      measurement: 'ph',
      fields: {
        value: Influx.FieldType.FLOAT
      },
      tags: [
        'sensorId'
      ]
    }, {
      measurement: 'level',
      fields: {
        value: Influx.FieldType.FLOAT
      },
      tags: [
        'sensorId'
      ]
    }]
  })

  consumer.on('data', async (data) => {
    try {
      log.info(data.value.toString())
      const { value: valueMsg } = data

      const _id = valueMsg.toString()
      console.log(`Aggregate data got ${_id}`)

      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) throw err
        else {
          const Events = client.db().collection('Event')
          const { finishDate, startDate } = await Events.findOne({ _id: ObjectID(_id) })

          const inputQuery = `
              SELECT MEAN(value)
              FROM level
              WHERE time >= ${startDate} AND time <= ${finishDate}
              AND sensorId = '0'
              GROUP BY time(1m)
            `
          const inputMeasurements = await influx.query(inputQuery)

          const outputQuery = `
            SELECT MEAN(value)
            FROM level
            WHERE time >= ${startDate} AND time <= ${finishDate}
            AND sensorId= '1'
            GROUP BY time(1m)
          `
          const outputMeasurements = await influx.query(outputQuery)

          const minuteAverageInputFlows = inputMeasurements
            .filter(m => {
              const { mean } = m
              return mean
            }).map(m => {
              const { mean } = m
              return parseLevelIntoFlow(mean)
            })

          const minuteAverageOutputFlows = outputMeasurements
            .filter(m => {
              const { mean } = m
              return mean
            })
            .map(m => {
              const { mean } = m
              return parseLevelIntoFlow(mean)
            })

          let volumeInput = 0
          minuteAverageInputFlows.forEach(flow => {
            volumeInput += flow * 60
          })

          let volumeOutput = 0
          minuteAverageOutputFlows.forEach(flow => {
            volumeOutput += flow * 60
          })

          const didNotGoOut = volumeInput - volumeOutput

          const efficiency = volumeInput !== 0 ? parseInt(100 * didNotGoOut / volumeInput) : 0

          const peakImputFlowQuery = `
            SELECT max(value)
            FROM level
            WHERE time >= ${startDate} AND time <= ${finishDate}
              AND sensorId= 'entrada'
          `
          const peakImputFlow = await influx.query(peakImputFlowQuery)

          const peakOutputFlowQuery = `
            SELECT max(value)
            FROM level
            WHERE time >= ${startDate} AND time <= ${finishDate}
              AND sensorId= 'salida'
          `
          const peakOutputFlow = await influx.query(peakOutputFlowQuery)

          const duration = ((startDate - finishDate) / 1000000000) / (60 * 60)

          await Events.updateOne({ _id: ObjectID(_id) }, {
            $set: { volumeInput, volumeOutput, efficiency, peakImputFlow, peakOutputFlow, duration }
          })

          client.close()
        }
      })
    } catch (e) {
      log.error(e.message)
    }
  })

  const parseLevelIntoFlow = (level) => {
    return level * 1
  }
})()
