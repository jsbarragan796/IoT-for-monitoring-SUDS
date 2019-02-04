const express = require('express')
const router = express.Router()
const csv = require('fast-csv')

const EventLogic = require('../logic/event')

const measurementLogic = require('./../logic/measurement')

const EVENT_PAGINATION = 2
const TIME_INTERVAL_MINUTES = '1m'
const AGGREGATION_FUNCTION = 'max'
// const ENTRY_SENSOR_ID = '4D1089'
// const EXIT_SENSOR_ID = '4D1080'
// const ENTRY_SENSOR_ID = '4D10B3'
// const EXIT_SENSOR_ID = '4D10B4'
const MEASUREMENT = [
  { name: 'level', entry: '4D10B3', exit: '4D10B4' },
  { name: 'rain', entry: '4D10B5' },
  { name: 'conductivity', entry: '4D10B3', exit: '4D10B4' }
]

let realtimeEventPaginator = {}
let dateGotRealtimeEvent = new Date().getTime()

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

const loadHistoricalMesuarementsEvents = async (event) => {
  for (let index = 0; index < MEASUREMENT.length; index++) {
    const measurement = MEASUREMENT[index]
    if (measurement.entry) {
      event[`entry${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.entry, event.startDate, event.finishDate, AGGREGATION_FUNCTION, TIME_INTERVAL_MINUTES)
    }
    if (measurement.exit) {
      event[`exit${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.exit, event.startDate, event.finishDate, AGGREGATION_FUNCTION, TIME_INTERVAL_MINUTES)
    }
  }
  return event
}

const loadRealtimeMesuarementsEvents = async (events) => {
  const eventsWithMeasurements = []
  for (let index = 0; index < events.length; index++) {
    const event = { startDate: parseInt(events[index].startDate),
      _id: events[index]._id,
      lastMeasurementDate: parseInt(events[index].lastMeasurementDate)
    }
    for (let i = 0; i < MEASUREMENT.length; i++) {
      const measurement = MEASUREMENT[i]
      if (measurement.entry) {
        event[`entry${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.entry, event.startDate, event.lastMeasurementDate, AGGREGATION_FUNCTION, TIME_INTERVAL_MINUTES)
      }
      if (measurement.exit) {
        event[`exit${measurement.name}`] = await measurementLogic.getMeasurements(measurement.name, measurement.exit, event.startDate, event.lastMeasurementDate, AGGREGATION_FUNCTION, TIME_INTERVAL_MINUTES)
      }
    }
    eventsWithMeasurements.push(event)
  }
  return eventsWithMeasurements
}

router.get('/current-events', async (req, res) => {
  const currentDate = new Date().getTime()
  try {
    if (currentDate - dateGotRealtimeEvent > 2500) {
      const pageNumber = parseInt(req.query.pageNumber)
      const numberOfEvents = await EventLogic.numberOfNotEndedEvents()
      if (numberOfEvents > 0) {
        const searchRange = await eventSearchRange(pageNumber, numberOfEvents)
        const events = await EventLogic.findNotFinishedEvents(searchRange.indexFirstEventPage, searchRange.eventsInPage)
        const eventsWithMeasurements = await loadRealtimeMesuarementsEvents(events)

        const paginator = { 'currentPage': pageNumber, 'totalPages': searchRange.numberOfPages, 'events': eventsWithMeasurements }
        realtimeEventPaginator = paginator
        dateGotRealtimeEvent = currentDate
        res.send(paginator)
      } else {
        const paginator = { 'currentPage': 0, 'totalPages': 0, 'events': [] }
        res.send(paginator)
      }
    } else {
      res.send(realtimeEventPaginator)
    }
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.get('/are-current-events', async (req, res) => {
  try {
    const numberOfEvents = await EventLogic.numberOfNotEndedEvents()
    if (numberOfEvents > 0) {
      res.send({ RTEvnets: true })
    } else {
      res.send({ RTEvnets: false })
    }
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.post('/filtered-data', async (req, res) => {
  try {
    const { pageNumber } = req.body
    const filterData = req.body
    const numberOfEvents = await EventLogic.numberOfFilteredEvents(filterData)

    const searchRange = await eventSearchRange(pageNumber, numberOfEvents)

    const events = await EventLogic.findFinishedFilteredEvents(searchRange.indexFirstEventPage, searchRange.eventsInPage, filterData)
    const paginator = { 'numberOfEvents': numberOfEvents, 'currentPage': pageNumber, 'totalPages': searchRange.numberOfPages, 'events': events }
    res.send(paginator)
  } catch (e) {
    res.status(200).send({
      currentPage: 1,
      totalPages: 1,
      events: [ ]
    }
    )
  }
})
router.get('/data', async (req, res) => {
  try {
    const eventId = req.query.eventId
    const event = await EventLogic.findEvent(eventId)
    const eventsWithMeasurements = await loadHistoricalMesuarementsEvents(event)
    res.send(eventsWithMeasurements)
  } catch (e) {
    res.status(200).send({
      event: {}
    })
  }
})
router.get('/get-csv', async (req, res) => {
  try {
    const eventId = req.query.eventId
    const event = await EventLogic.findEvent(eventId)
    const eventsWithMeasurements = await loadHistoricalMesuarementsEvents(event)
    const date = new Date(event.startDate / 1e6).toLocaleDateString().replace(/\//g, '_')
    const fileName = `evento_${date}.csv`
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=' + fileName,
      'X-Total-Count': 0,
      'filename': fileName
    })
    const data = [['Fecha', 'Caudal salida', 'Caudal entrada', 'Conductividad entrada', 'Conductividad salida', 'Precipitacion']]
    for (let index = 0; index < eventsWithMeasurements.entrylevel.length; index++) {
      const entry = eventsWithMeasurements.entrylevel[index]
      const out = eventsWithMeasurements.exitlevel[index]
      let entryC = ''
      let entryE = ''
      let rain = ''
      if (eventsWithMeasurements.entryconductivity.length > index) {
        entryC = eventsWithMeasurements.entryconductivity[index]
      }
      if (eventsWithMeasurements.exitconductivity.length > index) {
        entryE = eventsWithMeasurements.exitconductivity[index]
      }
      if (eventsWithMeasurements.entryrain.length > index) {
        rain = eventsWithMeasurements.entryrain[index]
      }
      data.push([entry.time, entry.value, out.value, entryC.value, entryE.value, rain.value])
    }

    csv.write(data, {
      headers: true
    }).pipe(res)
  } catch (e) {
    res.status(200).send({
      event: {}
    })
  }
})

module.exports = router
