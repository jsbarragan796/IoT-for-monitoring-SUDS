
const { MONGODB_URI } = require('../config')
const MongoClient = require('mongodb').MongoClient
const MIN_INT = Number.MIN_SAFE_INTEGER
const MAX_INT = Number.MAX_SAFE_INTEGER

const getDateNanoSeconds = (date) => {
  return new Date(date).getTime() * 1000000
}
const getNowNanoSeconds = () => {
  return new Date().getTime() * 1000000
}
const getFilterData = (filter) => {
  const {
    beginStartDate, endStartDate, beginEfficiency, endEfficiency,
    beginVolumeInput, endVolumeInput, beginVolumeOutput, endVolumeOutput,
    beginPeakInputFlow, endPeakInputFlow, beginPeakOutFlow, endPeakOutFlow,
    beginReductionOfPeakFlow, endReductionOfPeakFlow, beginDuration, endDuration
  } = filter
  return { 
    finishDate: { $exists: true },
    startDate: { 
      $gte: beginStartDate ? getDateNanoSeconds(beginStartDate) : 0 ,
      $lte: endStartDate ? getDateNanoSeconds(endStartDate): getNowNanoSeconds(),
    },
    efficiency: { 
      $gte: beginEfficiency ? beginEfficiency : MIN_INT, 
      $lte: endEfficiency ? endEfficiency : MAX_INT
    },
    volumeInput: { 
      $gte: beginVolumeInput ? beginVolumeInput  : MIN_INT, 
      $lte: endVolumeInput ?  endVolumeInput : MAX_INT
    },
    volumeOutput: { 
      $gte: beginVolumeOutput ? beginVolumeOutput : MIN_INT, 
      $lte: endVolumeOutput ? endVolumeOutput : MAX_INT
    },
    peakInputFlow: { 
      $gte: beginPeakInputFlow ? beginPeakInputFlow : MIN_INT, 
      $lte: endPeakInputFlow ? endPeakInputFlow : MAX_INT
    },
    peakOutFlow: { 
      $gte: beginPeakOutFlow ? beginPeakOutFlow : MIN_INT, 
      $lte: endPeakOutFlow ? endPeakOutFlow : MAX_INT},
    reductionOfPeakFlow: { 
      $gte: beginReductionOfPeakFlow? beginReductionOfPeakFlow : MIN_INT, 
      $lte: endReductionOfPeakFlow ? endReductionOfPeakFlow : MAX_INT},
    duration: { 
      $gte: beginDuration? beginDuration : MIN_INT, 
      $lte: endDuration ? endDuration : MAX_INT
    }
  }
}

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
          const { _id, finishDate, inputMeasurements, outputMeasurements, peakImputFlow, peakOutputFlow, duration } = lastEventData
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

          let volumeOutput = 0
          minuteAverageOutputFlows.forEach(flow => {
            volumeOutput += flow * 60
          })

          const didNotGoOut = volumeInput - volumeOutput

          const efficiency = volumeInput !== 0 ? parseInt(100 * didNotGoOut / volumeInput) : 0

          let reductionOfPeakFlow = 0;
          if (peakOutputFlow) {
          reductionOfPeakFlow = peakOutputFlow.max / peakImputFlow.max 
          }

          await Events.updateOne({ _id }, {
            $set: { finishDate, volumeInput, volumeOutput, efficiency, peakImputFlow, peakOutputFlow, reductionOfPeakFlow, duration }
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
  findFinishedEvents: (firstEventPage, eventsInPage) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          Events.find({ finishDate: { $exists: true } }, { sort: { _id: 1 }, skip: firstEventPage, limit: eventsInPage }).toArray((err, points) => {
            if (err) reject(err)
            else resolve(points)
            client.close()
          })
        }
      })
    })
  },

  numberOfNotEndedEvents: () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          const numberOfEvents = Events.find(
            { finishDate: { $exists: false } }).count()
          client.close()
          resolve(numberOfEvents)
        }
      })
    })
  },

  findNotFinishedEvents: (firstEventPage, eventsInPage) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          Events.find({ finishDate: { $exists: false } }, { sort: { _id: 1 }, skip: firstEventPage, limit: eventsInPage }).toArray((err, points) => {
            if (err) reject(err)
            else resolve(points)
            client.close()
          })
        }
      })
    })
  },

  numberOfFilteredEvents: (filter) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          const numberOfEvents = Events.find(
            getFilterData(filter)
            ).count()
          client.close()
          resolve(numberOfEvents)
        }
      })
    })
  },

  findFinishedFilteredEvents: (firstEventPage, eventsInPage, filter) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          Events.find(
            getFilterData(filter),
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
  }

}

const parseLevelIntoFlow = (level) => {
  return level * 1
}
