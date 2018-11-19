
const { MONGODB_URI } = require('../config')
const MongoClient = require('mongodb').MongoClient

const { sendEventStartAlarm } = require('./alarm')

module.exports = {
  findAllEvents: () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
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

  endEventAndCreateOne: (lastEventData, newEventData) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          const { _id, finishDate, inputMeasurements, outputMeasurements } = lastEventData
          const Events = client.db().collection('Event')

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

          let 
           = 0
          minuteAverageOutputFlows.forEach(flow => {
            volumeOutput += flow * 60
          })

          const didNotGoOut = volumeInput - volumeOutput

          const efficiency = volumeInput !== 0 ? parseInt(100 * didNotGoOut / volumeInput) : 0

          await Events.updateOne({ _id }, {
            $set: { finishDate, volumeInput, volumeOutput, efficiency }
          })

          const { startDate } = newEventData

          await Events.insertOne({
            startDate, lastMeasurementDate: startDate
          })

          // await sendEventStartAlarm()
          client.close()
          resolve()
        }
      })
    })
  },

  updateLastMeasurementDate: (eventToUpdate) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          await Events.updateOne({ _id: eventToUpdate._id }, {
            $set: { 'lastMeasurementDate': eventToUpdate.lastMeasurementDate }
          })
          client.close()
          resolve()
        }
      })
    })
  },
  findFinishedEvents: (firstEventPage,eventsInPage) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          Events.find({ finishDate: { $exists: true }},{ sort: { _id: 1 },skip: firstEventPage, limit: eventsInPage }).toArray((err, points) => {
            if (err) reject(err)
            else resolve(points)
            client.close()
          })
        }
      })
    })
  },

  numberOfEvents: () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          const numberOfEvents = Events.find({ finishDate: { $exists: true }}).count()
          client.close()
          resolve(numberOfEvents)
        }
      })
    })
  },
  
}

const parseLevelIntoFlow = (level) => {
  return level * 1
}
