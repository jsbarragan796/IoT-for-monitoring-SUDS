const express = require('express')
const router = express.Router()

const EventLogic = require('../logic/event')

const measurementLogic = require('./../logic/measurement')

const EVENT_PAGINATION = 3
const TIME_INTERVAL_MINUTES = '5m'
const AGGREGATION_FUNCTION = 'max'
// const ENTRY_SENSOR_ID = '4D10B3'
// const EXIT_SENSOR_ID = '4D10B3'
const ENTRY_SENSOR_ID = 'entrada'
const EXIT_SENSOR_ID = 'salida'
const MEASUREMENT = 'level'

const eventSearchRange = async (pageNumber, numberOfEvents) => {
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
}

const loadHistoricalMesuarementsEvents = async (events) => {
  for (let index = 0; index < events.length; index++) {
    const entry = await measurementLogic.getMeasurements(MEASUREMENT, ENTRY_SENSOR_ID, events[index].startDate, events[index].finishDate, AGGREGATION_FUNCTION, TIME_INTERVAL_MINUTES)
    const exit = await measurementLogic.getMeasurements(MEASUREMENT, EXIT_SENSOR_ID, events[index].startDate, events[index].finishDate, AGGREGATION_FUNCTION, TIME_INTERVAL_MINUTES)
    events[index]['entry'] = entry
    events[index]['exit'] = exit
  }
  return events
}

const loadRealtimeMesuarementsEvents = async (events) => {
  const eventsWithMeasurements = []
  for (let index = 0; index < events.length; index++) {
    const event = { startDate: parseInt(events[index].startDate),
      _id: events[index]._id,
      lastMeasurementDate: parseInt(events[index].lastMeasurementDate),
      entry: [],
      exit: [] }
    const entry = await measurementLogic.getMeasurements(MEASUREMENT, ENTRY_SENSOR_ID, events[index].startDate, events[index].finishDate)
    const exit = await measurementLogic.getMeasurements(MEASUREMENT, EXIT_SENSOR_ID, events[index].startDate, events[index].finishDate)
    event.entry = entry
    event.exit = exit
    eventsWithMeasurements.push(event)
  }
  return eventsWithMeasurements
}

router.get('/current-events', async (req, res, next) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber)
    const numberOfEvents = await EventLogic.numberOfNotEndedEvents()
    const searchRange = await eventSearchRange(pageNumber, numberOfEvents)
    const events = await EventLogic.findNotFinishedEvents(searchRange.indexFirstEventPage, searchRange.eventsInPage)
    const eventsWithMeasurements = await loadRealtimeMesuarementsEvents(events)
    const paginator = { 'currentPage': pageNumber, 'totalPages': searchRange.numberOfPages, 'events': eventsWithMeasurements }
    res.send(paginator)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.post('/filtered-data', async (req, res) => {
  // const { beginStartDate, endStartDate, beginEfficiency, endEfficiency,
  //   beginVolumeInput, endVolumeInput, beginPeakInputFlow, endPeakInputFlow,
  //   beginVolumeOutput, endVolumeOutput, beginPeakOutFlow, endPeakOutFlow,
  //   beginReductionOfPeakFlow, endReductionOfPeakFlow, beginDuration, endDuration } = req.body
  try {
    const { pageNumber } = req.body
    const filterData = req.body
    const numberOfEvents = await EventLogic.numberOfFilteredEvents(filterData)
    console.log("numberOfEvents",numberOfEvents)
    const searchRange = await eventSearchRange(pageNumber, numberOfEvents)
    const events = await EventLogic.findFinishedFilteredEvents(searchRange.indexFirstEventPage, searchRange.eventsInPage, filterData)
    const eventsWithMeasurements = await loadHistoricalMesuarementsEvents(events)
    const paginator = { 'currentPage': pageNumber, 'totalPages': searchRange.numberOfPages, 'events': eventsWithMeasurements }
    res.send(paginator)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

module.exports = router
