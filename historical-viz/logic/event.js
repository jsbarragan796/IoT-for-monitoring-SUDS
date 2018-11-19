
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

  numberOfEvents: (filter) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          const numberOfEvents = Events.find(
            { finishDate: { $exists: true },
            startDate: { $gte: new Date(filter.beginStartDate).getTime()*1000000, 
                         $lte: new Date(filter.endStartDate).getTime()*1000000},
            efficiency: { $gte: filter.beginEfficiency,  $lte: filter.endEfficiency},
            volumeInput: { $gte: filter.beginVolumeInput,  $lte: filter.endVolumeInput},
            volumeOutput: { $gte: filter.beginVolumeOutput,  $lte: filter.endVolumeOutput},
            peakInputFlow: { $gte: filter.beginPeakInputFlow,  $lte: filter.endPeakInputFlow},
            peakOutFlow: { $gte: filter.beginPeakOutFlow,  $lte: filter.endPeakOutFlow} , 
            reductionOfPeakFlow: { $gte: filter.beginReductionOfPeakFlow,  $lte: filter.endReductionOfPeakFlow},
            duration: { $gte: filter.beginDuration,  $lte: filter.endDuration}
           }).count()
          client.close()
          resolve(numberOfEvents)
        }
      })
    })
  },

  findFinishedEventsFilter: (firstEventPage,eventsInPage, filter) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          console.log(new Date(filter.beginStartDate).getTime()*1000000)
          console.log(new Date(filter.endStartDate).getTime()*1000000)
          Events.find(
            { finishDate: { $exists: true },
              startDate: { $gte: new Date(filter.beginStartDate).getTime()*1000000, 
                           $lte: new Date(filter.endStartDate).getTime()*1000000},
              efficiency: { $gte: filter.beginEfficiency,  $lte: filter.endEfficiency},
              volumeInput: { $gte: filter.beginVolumeInput,  $lte: filter.endVolumeInput},
              volumeOutput: { $gte: filter.beginVolumeOutput,  $lte: filter.endVolumeOutput},
              peakInputFlow: { $gte: filter.beginPeakInputFlow,  $lte: filter.endPeakInputFlow},
              peakOutFlow: { $gte: filter.beginPeakOutFlow,  $lte: filter.endPeakOutFlow} , 
              reductionOfPeakFlow: { $gte: filter.beginReductionOfPeakFlow,  $lte: filter.endReductionOfPeakFlow},
              duration: { $gte: filter.beginDuration,  $lte: filter.endDuration}  },
            { sort: { _id: 1 },
            skip: firstEventPage, 
            limit: eventsInPage }).toArray((err, points) => {
            if (err) reject(err)
            else resolve(points)
            client.close()
          })
        }
      })
    })
  },
  
}

const parseLevelIntoFlow = (level) => {
  return level * 1
}
