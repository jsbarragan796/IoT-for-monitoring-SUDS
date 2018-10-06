
const { MONGODB_URI } = require('../config')

const MongoCLient = require('mongodb').MongoClient

module.exports = {
  findAllEvents: () => {
    return new Promise((resolve, reject) => {
      MongoCLient.connect(MONGODB_URI, (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          Events.find({}).toArray((err, points) => {
            if (err) reject(err)
            else resolve(points)
            client.close()
          })
        }
      })
    })
  },

  findMostRecentEvent: () => {
    return new Promise((resolve, reject) => {
      MongoCLient.connect(MONGODB_URI, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          const event = await Events.findOne({}, { sort: { _id: -1 }, limit: 1 })
          resolve(event)
        }
      })
    })
  },

  endEventAndCreateOne: (data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
      MongoCLient.connect(MONGODB_URI, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')

          await Events.updateOne({_id: data._id},
            {
              $set: { 'finishDate': data.finishDate }
            })

          await Events.insertOne({
            'startDate': data.startDate, 'lastMeasurementDate': data.startDate}
          )
          resolve()
          // client.close()
        }
      })
    })
  },

  updateLastMeasurementDate: (eventToUpdate) => {
    return new Promise((resolve, reject) => {
      MongoCLient.connect(MONGODB_URI, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          await Events.updateOne({_id: eventToUpdate._id},
            {
              $set: { 'lastMeasurementDate': eventToUpdate.lastMeasurementDate }
            })
          resolve()
        }
      })
    })
  }
}
