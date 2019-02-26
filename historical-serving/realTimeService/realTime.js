
const io = require('socket.io')()
const EventLogic = require('../logic/event')
const measurementLogic = require('./../logic/measurement')

let realtimeEventPaginator = {}
let dateGotRealtimeEvent = new Date().getTime()

const currentsEvents = async (pageNumberParameter) => {
  const currentDate = new Date().getTime()
  if (currentDate - dateGotRealtimeEvent > 2500) {
    const pageNumber = Number(pageNumberParameter)
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
    })
    io.listen(PORT)
  }
}
