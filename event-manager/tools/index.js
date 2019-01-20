
const { KAFKA_TOPIC_EVENT_FINISHED } = require('../config')
const ObjectID = require('mongodb').ObjectID

module.exports = (producer, client) => {
  const findMostRecentOpenEvent = async () => {
    const Events = client.db().collection('Event')
    const event = await Events.findOne({ finishDate: null }, { sort: { startDate: -1 } })
    return event
  }

  const endEvent = async (_id, timestamp) => {
    const Events = client.db().collection('Event')

    await Events.updateOne({ _id: ObjectID(_id) }, {
      $set: { finishDate: timestamp }
    })

    producer.produce(KAFKA_TOPIC_EVENT_FINISHED, null, Buffer.from(_id.toString()))
  }

  const createEvent = async (timestamp) => {
    const Events = client.db().collection('Event')

    await Events.insertOne({
      startDate: timestamp, lastMeasurementDate: timestamp
    })
  }

  const updateLastMeasurementDate = async (timestamp) => {
    const Events = client.db().collection('Event')
    const event = await Events.findOne({ finishDate: null }, { sort: { startDate: -1 } })

    if (event) {
      const { _id } = event

      await Events.updateOne({ _id }, {
        $set: { lastMeasurementDate: timestamp }
      })
    }
  }

  const healthCheck = async (sensorId, timestamp) => {
    const Sensor = client.db().collection('Sensor')

    await Sensor.updateOne({ id: sensorId }, {
      $set: { lastMeasurementDate: timestamp }
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
