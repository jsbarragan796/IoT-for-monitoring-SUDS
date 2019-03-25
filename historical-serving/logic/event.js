
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
    beginDate, endDate, beginEfficiency, endEfficiency,
    beginVolumeInput, endVolumeInput, beginVolumeOutput, endVolumeOutput,
    beginReductionOfPeakFlow, endReductionOfPeakFlow, beginDuration, endDuration
  } = filter
  return {
    finishDate: { $exists: true },
    startDate: {
      $gte: beginDate ? getDateNanoSeconds(beginDate) : 0,
      $lte: endDate ? getDateNanoSeconds(endDate) + 8.64e13 : getNowNanoSeconds()
    },
    efficiency: {
      $gte: beginEfficiency || MIN_INT,
      $lte: endEfficiency || MAX_INT
    },
    volumeInput: {
      $gte: beginVolumeInput || MIN_INT,
      $lte: endVolumeInput || MAX_INT
    },
    volumeOutput: {
      $gte: beginVolumeOutput || MIN_INT,
      $lte: endVolumeOutput || MAX_INT
    },
    reductionOfPeakFlow: {
      $gte: beginReductionOfPeakFlow || MIN_INT,
      $lte: endReductionOfPeakFlow || MAX_INT
    },
    duration: {
      $gte: beginDuration || MIN_INT,
      $lte: endDuration || MAX_INT
    }
  }
}

module.exports = {
  findEvent: (enventId) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
        let ObjectId = require('mongodb').ObjectId
        if (err) reject(err)
        else {
          let Events = client.db().collection('Event')
          try {
            Events.findOne(ObjectId(enventId), (err, result) => {
              if (err) reject(err)
              client.close()
              resolve(result)
            })
          } catch (err) {
            reject(err)
          }
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

          let reductionOfPeakFlow = 0
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
          const { orderBy }  = filter
          let sort
          try {
            sort = orderBy ? JSON.parse(orderBy) : {_id: 1}
          } catch (error) {
            console.log("invalid sort parameter at filter")
          }
          let Events = client.db().collection('Event')
          Events.find(
            getFilterData(filter),
            { sort: sort,
              skip: firstEventPage,
              limit: eventsInPage }).toArray((err, points) => {
            client.close()
            if (err) reject(err)
            else resolve(points)
          })
        }
      })
    })
  }

}

const parseLevelIntoFlow = (level) => {
  return level * 1
}
