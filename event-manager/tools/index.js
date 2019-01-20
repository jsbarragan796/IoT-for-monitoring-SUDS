
const { MONGODB_URI, KAFKA_TOPIC_EVENT_FINISHED } = require('../config')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

module.exports = (producer) => {
  const findMostRecentOpenEvent = () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          let Events = client.db().collection('Event')
          const event = await Events.findOne({ finishDate: null }, { sort: { startDate: -1 } })

          client.close()
          resolve(event)
        }
      })
    })
  }

  const endEvent = (_id, timestamp) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          const Events = client.db().collection('Event')

          await Events.updateOne({ _id: ObjectID(_id) }, {
            $set: { finishDate: timestamp }
          })

          producer.produce(KAFKA_TOPIC_EVENT_FINISHED, null, Buffer.from(_id.toString()))

          client.close()
          resolve()
        }
      })
    })
  }

  const createEvent = (timestamp) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          const Events = client.db().collection('Event')

          await Events.insertOne({
            startDate: timestamp, lastMeasurementDate: timestamp
          })

          client.close()
          resolve()
        }
      })
    })
  }

  const updateLastMeasurementDate = (timestamp) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          const Events = client.db().collection('Event')
          const event = await Events.findOne({ finishDate: null }, { sort: { startDate: -1 } })

          if (event) {
            const { _id } = event

            await Events.updateOne({ _id }, {
              $set: { lastMeasurementDate: timestamp }
            })

            client.close()
            resolve()
          }
        }
      })
    })
  }

  const healthCheck = (sensorId, timestamp) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          const Sensor = client.db().collection('Sensor')

          await Sensor.updateOne({ id: sensorId }, {
            $set: { lastMeasurementDate: timestamp }
          })

          client.close()
          resolve()
        }
      })
    })
  }

  return {
    findMostRecentOpenEvent,
    endEvent,
    createEvent,
    updateLastMeasurementDate,
    healthCheck
  }
}
