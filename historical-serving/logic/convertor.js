const { MONGODB_URI } = require('../config')
const MongoClient = require('mongodb').MongoClient
const measurementLogic = require('./measurement')
const EVENT_PAGINATION = 5
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
const setupSensors = async () => {
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
          tempMeasurement.exit = sensor.id.split('-')[0]
        }
      })
      MEASUREMENT.push(tempMeasurement)
    }
  }
}

setupSensors()

module.exports = {
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
  loadMesuarementsEvents: async (event) => {
    const finishDate = event.finishDate || event.lastMeasurementDate
    for (let index = 0; index < MEASUREMENT.length; index++) {
      const measurement = MEASUREMENT[index]
      if (measurement.entry && measurement.name !== 'rain') {
        event[`entry${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.entry, event.startDate, finishDate, measurement.aggregationFunction, measurement.timeIntervalMinutes)
      }
      if (measurement.exit) {
        event[`exit${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.exit, event.startDate, finishDate, measurement.aggregationFunction, measurement.timeIntervalMinutes)
      }
      if (measurement.name === 'rain') {
        event[`entry${measurement.name}`] = await measurementLogic.getMeasurements('level', measurement.entry, event.startDate, finishDate, measurement.aggregationFunction, measurement.timeIntervalMinutes)
      }
    }
    return event
  },
  newMeasurementsEvents: async (event, currentEvent) => {
    for (let index = 0; index < MEASUREMENT.length; index++) {
      const measurement = MEASUREMENT[index]
      if (measurement.entry && measurement.name !== 'rain') {
        const toSendIndex = event[`entry${measurement.name}`].length
        const sentIndex = currentEvent[`entry${measurement.name}`].length
        if (sentIndex === toSendIndex){
          const toSend = currentEvent[`entry${measurement.name}`].pop()
          event[`entry${measurement.name}`] = toSend ? [toSend]: []
        } else {
          event[`entry${measurement.name}`] = currentEvent[`entry${measurement.name}`].slice(toSendIndex)
        }     
      }
      if (measurement.exit) {
        const toSendIndex = event[`exit${measurement.name}`].length
        const sentIndex = currentEvent[`exit${measurement.name}`].length
        if (sentIndex === toSendIndex){
          const toSend = currentEvent[`exit${measurement.name}`].pop()
          event[`exit${measurement.name}`] = toSend ? [toSend]: []
        } else {
          event[`exit${measurement.name}`] = currentEvent[`exit${measurement.name}`].slice(toSendIndex)
        }   
      }
      if (measurement.name === 'rain') {
        const toSendIndex = event[`entry${measurement.name}`].length
        const sentIndex = currentEvent[`entry${measurement.name}`].length
        if (sentIndex === toSendIndex){
          const toSend = currentEvent[`entry${measurement.name}`].pop()
          event[`entry${measurement.name}`] = toSend ? [toSend]: []
        } else {
          event[`entry${measurement.name}`] = currentEvent[`entry${measurement.name}`].slice(toSendIndex)
        }
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
