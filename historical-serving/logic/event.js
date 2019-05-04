
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
    volumeEfficiency: {
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
    peakFlowEfficiency: {
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

