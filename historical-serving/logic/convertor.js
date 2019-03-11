const { MONGODB_URI } = require('../config')
const MongoClient = require('mongodb').MongoClient
const measurementLogic = require('./measurement')
const EVENT_PAGINATION = 3

// const ENTRY_SENSOR_ID = '4D1089'
// const EXIT_SENSOR_ID = '4D1080'
// const ENTRY_SENSOR_ID = '4D10B3'
// const EXIT_SENSOR_ID = '4D10B4'
// const MEASUREMENT = [
//   { name: 'level', entry: '4D10B3', exit: '4D10B4', timeIntervalMinutes: '1m', aggregationFunction: 'mean' },
//   { name: 'rain', entry: '4D10B3', timeIntervalMinutes: '60m', timeIntervalMinutesRealTime: '10m', aggregationFunction: 'sum' },
//   { name: 'conductivity', entry: '4D10B3', exit: '4D10B4', timeIntervalMinutes: '1m', aggregationFunction: 'mean' }
// ]

const MEASUREMENT = []

const mongoConnect = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
      if (err) reject(err)
      else {
        resolve(client)
      }
    })
  })
}

module.exports = {
  setupSensors: async () => {
    if (MEASUREMENT.length === 0) {
      const mongo = await mongoConnect()
      const Sensor = mongo.db().collection('Sensor')
      const sensors = await Sensor.find({}).toArray()
      const MeasurementType = mongo.db().collection('MeasurementType')
      const measurementTypes = await MeasurementType.find({}).toArray()
      mongo.close()

      for (let measurement of measurementTypes) {
        const locationSensors = sensors.filter(({ type }) => {
          return measurement._id.toString() === type.toString()
        })
        const tempMeasurement = measurement
        locationSensors.forEach(sensor => {
          if (sensor.isEntrance) {
            tempMeasurement.entry = sensor.id.split('-')[0]
          }
          if (!sensor.isEntrance) {
            tempMeasurement.entry = sensor.id.split('-')[0]
          }
        })
        MEASUREMENT.push(tempMeasurement)
      }
    }
  },
  eventSearchRange: async (pageNumber, numberOfEvents) => {
    const numberOfPages = Math.ceil(numberOfEvents / EVENT_PAGINATION)
    if (!pageNumber) {
      throw new Error('No number page given')
    } else if (pageNumber > numberOfPages || pageNumber <= 0) {
      throw new Error('Page out of range')
    } else {
      const indexFirstEventPage = (pageNumber - 1) * EVENT_PAGINATION
      const eventsInPage = indexFirstEventPage + EVENT_PAGINATION > numberOfEvents ? numberOfEvents - indexFirstEventPage : EVENT_PAGINATION
      return { numberOfPages, indexFirstEventPage, eventsInPage }
    }
  },
  loadHistoricalMesuarementsEvents: async (event) => {
    for (let index = 0; index < MEASUREMENT.length; index++) {
      const measurement = MEASUREMENT[index]
      if (measurement.entry && measurement.name !== 'rain') {
        event[`entry${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.entry, event.startDate, event.finishDate, measurement.aggregationFunction, measurement.timeIntervalMinutes)
      }
      if (measurement.exit) {
        event[`exit${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.exit, event.startDate, event.finishDate, measurement.aggregationFunction, measurement.timeIntervalMinutes)
      }
      if (measurement.name === 'rain') {
        event[`entry${measurement.name}`] = await measurementLogic.getMeasurements('level', measurement.entry, event.startDate, event.finishDate, measurement.aggregationFunction, measurement.timeIntervalMinutes)
      }
    }
    return event
  },
  newMeasurementsEvents: async (event, currentEvent) => {
    for (let index = 0; index < MEASUREMENT.length; index++) {
      const measurement = MEASUREMENT[index]
      if (measurement.entry && measurement.name !== 'rain') {
        const sentIndex = event[`entry${measurement.name}`].length
        event[`entry${measurement.name}`] = currentEvent[`entry${measurement.name}`].slice(sentIndex)
      }
      if (measurement.exit) {
        const sentIndex = event[`exit${measurement.name}`].length
        event[`exit${measurement.name}`] = currentEvent[`exit${measurement.name}`].slice(sentIndex)
      }
      if (measurement.name === 'rain') {
        const sentIndex = event[`entry${measurement.name}`].length
        event[`entry${measurement.name}`] = currentEvent[`entry${measurement.name}`].slice(sentIndex)
      }
    }
    return event
  },
  loadRealtimeMesuarementsEvents: async (events) => {
    const eventsWithMeasurements = []
    for (let index = 0; index < events.length; index++) {
      const event = { startDate: parseInt(events[index].startDate),
        _id: events[index]._id,
        lastMeasurementDate: parseInt(events[index].lastMeasurementDate)
      }
      for (let i = 0; i < MEASUREMENT.length; i++) {
        const measurement = MEASUREMENT[i]
        if (measurement.entry && measurement.name !== 'rain') {
          event[`entry${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.entry, event.startDate, event.lastMeasurementDate, measurement.aggregationFunction, measurement.timeIntervalMinutes)
        }
        if (measurement.exit) {
          event[`exit${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.exit, event.startDate, event.lastMeasurementDate, measurement.aggregationFunction, measurement.timeIntervalMinutes)
        }
        if (measurement.name === 'rain') {
          event[`entry${measurement.name}`] = await measurementLogic.getMeasurements('level', measurement.entry, event.startDate, event.lastMeasurementDate, measurement.aggregationFunction, measurement.timeIntervalMinutesRealTime)
        }
      }
      eventsWithMeasurements.push(event)
    }
    return eventsWithMeasurements
  }
}
