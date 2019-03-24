const express = require('express')
const router = express.Router()
const csv = require('fast-csv')

const EventLogic = require('../logic/event')

const convertor = require('./../logic/convertor')

router.post('/filtered-data', async (req, res) => {
  try {
    const { pageNumber } = req.body
    const filterData = req.body
    const numberOfEvents = await EventLogic.numberOfFilteredEvents(filterData)

    const searchRange = await convertor.eventSearchRange(pageNumber, numberOfEvents)

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
    const eventsWithMeasurements = await convertor.loadMesuarementsEvents(event)
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
    const eventsWithMeasurements = await convertor.loadMesuarementsEvents(event)
    const date = new Date(event.startDate / 1e6).toLocaleDateString().replace(/\//g, '_')
    const fileName = `evento_${date}.csv`
    res.writeHead(200, {
      'Access-Control-Expose-Headers': 'filename, Content-Disposition',
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=' + fileName,
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
      data.push([entry.time._nanoISO, entry.value, out.value, entryC.value, entryE.value, rain.value])
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
