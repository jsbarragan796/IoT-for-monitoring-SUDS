
const { MONGODB_URI, KAFKA_TOPIC_PRODUCER_CLOSING_EVENT } = require('../config')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

module.exports = {
  findMostRecentEvent: () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          const event = await Events.findOne({}, { sort: { startDate: -1 } })

          client.close()
          resolve(event)
        }
      })
    })
  },
  endEventAndCreateOne: (producer, _id, timestamp, mostRecentEventLastMeasurementDate) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          const Events = client.db().collection('Event')

          await Events.updateOne({ _id: ObjectID(_id) }, {
            $set: { finishDate: mostRecentEventLastMeasurementDate }
          })

          await Events.insertOne({
            startDate: timestamp, lastMeasurementDate: timestamp
          })

          producer.produce(KAFKA_TOPIC_PRODUCER_CLOSING_EVENT, null, Buffer.from(_id.toString()))

          client.close()
          resolve()
        }
      })
    })
  },
  updateLastMeasurementDate: (_id, timestamp) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          const Events = client.db().collection('Event')

          await Events.updateOne({ _id }, {
            $set: { lastMeasurementDate: timestamp }
          })

          client.close()
          resolve()
        }
      })
    })
  }
}
