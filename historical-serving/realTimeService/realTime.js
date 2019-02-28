
const io = require('socket.io')()
const EventLogic = require('../logic/event')
const convertor = require('./../logic/convertor')

let eventsWithMeasurements = []
let numberOfEvents = 0
let lastEventSendData = null
let currentEventStokets
convertor.setupSensors()

setInterval(async () => {
  numberOfEvents = await EventLogic.numberOfNotEndedEvents()
  if (numberOfEvents > 0) {
    const notEndedEvents = await EventLogic.findNotFinishedEvents(0, numberOfEvents)
    if (eventsWithMeasurements.lenght > 0) {

    } else {

    }
    const lastMeasurementDate = notEndedEvents[0].lastMeasurementDate
    eventsWithMeasurements = await convertor.loadRealtimeMesuarementsEvents(notEndedEvents)
    eventsWithMeasurements[0]
    if (currentEventStokets) {
      currentEventStokets.emit('eventUpdate')
    }
    console.log('actualizando 223123')
  } else {
    eventsWithMeasurements = []
    lastEventSendData = null
  }
}, 900)

const currentsEvents = async (pageNumberParameter, client) => {
  const pageNumber = Number(pageNumberParameter)
  if (numberOfEvents > 0 && pageNumber < numberOfEvents) {
    const eventsWithMeasurementsToSend = eventsWithMeasurements[0]
    const paginator = { 'currentPage': pageNumber, 'totalPages': numberOfEvents, 'events': [eventsWithMeasurementsToSend] }
    client.emit('current-events', paginator)
  } else {
    const paginator = { 'currentPage': 0, 'totalPages': 0, 'events': [] }
    client.emit('current-events', paginator)
  }
}

const areCurrentEvents = (client) => {
  let lastSent
  setInterval(async () => {
    if (!lastSent) {
      if (numberOfEvents > 0) {
        lastSent = 'true'
        client.emit('are-current-events', true)
      } else {
        lastSent = 'false'
        client.emit('are-current-events', false)
      }
    } else {
      if (numberOfEvents > 0 && lastSent === 'false') {
        lastSent = 'true'
        client.emit('are-current-events', true)
      }
      if (numberOfEvents === 0 && lastSent === 'true') {
        lastSent = 'false'
        client.emit('are-current-events', false)
      }
    }
  }, 1000)
}

module.exports = {
  startSocket: (PORT_SOCKET) => {
    console.log(PORT_SOCKET)
    io.of('/events').on('connection', (client) => {
      client.on('subscribeToTimer', (interval) => {
        setInterval(() => {
          client.emit('timer', `${new Date()}-servidor`)
        }, interval)
      })
      client.on('current-events', (pageNumberParameter) => {
        currentsEvents(pageNumberParameter, client)
      })
    })
    io.of('/current').on('connection', (client) => {
      client.on('are-current-events', () => {
        areCurrentEvents(client)
      })
    })
    io.listen(PORT_SOCKET)
  }
}
