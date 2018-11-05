var bunyan = require('bunyan')
var RotatingFileStream = require('bunyan-rotating-file-stream')

const { LOG_DIRECTORY, MONGODB_URI, KAFKA_TOPIC_PRODUCER } = require('../config')
const MongoClient = require('mongodb').MongoClient

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
  log,
  findMostRecentEvent: () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          const event = await Events.findOne({}, { sort: { _id: -1 }, limit: 1 })
          client.close()
          resolve(event)
        }
      })
    })
  },
  endEventAndCreateOne: (producer, _id, timestamp) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          const Events = client.db().collection('Event')

          await Events.updateOne({ _id }, {
            $set: { finishDate: timestamp }
          })

          await Events.insertOne({
            startDate: timestamp, lastMeasurementDate: timestamp
          })

          producer.produce(KAFKA_TOPIC_PRODUCER, null, Buffer.from('0'))

          client.close()
          resolve()
        }
      })
    })
  },
  updateLastMeasurementDate: (_id, timestamp) => {
    return new Promise((resolve, reject) => {
      console.log(_id)
      console.log(timestamp)
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          const Events = client.db().collection('Event')

          await Events.updateOne({ _id }, {
            $set: { lastMeasurementDate: timestamp }
          })

          // await sendEventStartAlarm()
          client.close()
          resolve()
        }
      })
    })
  }
}
