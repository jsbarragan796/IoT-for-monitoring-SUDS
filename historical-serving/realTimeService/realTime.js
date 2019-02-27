
const io = require('socket.io')()
const EventLogic = require('../logic/event')
const convertor = require('./../logic/convertor')

let eventsWithMeasurements = []
let dateGotRealtimeEvent = new Date().getTime()
let numberOfEvents = 0
convertor.setupSensors()

setInterval(async () => {
  numberOfEvents = await EventLogic.numberOfNotEndedEvents()
  const currentDate = new Date().getTime()
  if (numberOfEvents > 0) {
    const notEndedEvents = await EventLogic.findNotFinishedEvents(0, numberOfEvents)
    eventsWithMeasurements = await convertor.loadRealtimeMesuarementsEvents(notEndedEvents)
    dateGotRealtimeEvent = currentDate
  }
  console.log('actualizando 223123')
}, 900)

const currentsEvents = async (pageNumberParameter, lastIndex, client) => {
  const currentDate = new Date().getTime()
  if (currentDate - dateGotRealtimeEvent > 2500) {
    const pageNumber = Number(pageNumberParameter)
    const numberOfEvents = await EventLogic.numberOfNotEndedEvents()
    if (numberOfEvents > 0) {
      const searchRange = await convertor.eventSearchRange(pageNumber, numberOfEvents)
      const events = await EventLogic.findNotFinishedEvents(searchRange.indexFirstEventPage, searchRange.eventsInPage)
      const eventsWithMeasurements = await convertor.loadRealtimeMesuarementsEvents(events)
      const paginator = { 'currentPage': pageNumber, 'totalPages': searchRange.numberOfPages, 'events': eventsWithMeasurements }
      realtimeEventPaginator = paginator
      dateGotRealtimeEvent = currentDate
      return paginator
    } else {
      const paginator = { 'currentPage': 0, 'totalPages': 0, 'events': [] }
      return paginator
    }
  } else {
    return realtimeEventPaginator
  }
}

const areCurrentEnvents = (client) => {
  setInterval(async () => {
    if (numberOfEvents > 0) {
      client.emit('are-current-events', true)
    } else {
      client.emit('are-current-events', false)
    }
  }, 1000)
}

module.exports = {
  startSocket: (PORT) => {
    console.log(PORT)
    io.on('connection', (client) => {
      client.on('subscribeToTimer', (interval) => {
        setInterval(() => {
          client.emit('timer', `${new Date()}-servidor`)
        }, interval)
      })
      client.on('are-current-events', () => {
        areCurrentEnvents(client)
      })
      client.on('current-events', (pageNumberParameter, lastIndex) => {
        currentsEvents(pageNumberParameter, lastIndex, client)
      })
    })
    io.listen(PORT)
  }
}
