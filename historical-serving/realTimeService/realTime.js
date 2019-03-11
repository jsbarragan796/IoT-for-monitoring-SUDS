
const io = require('socket.io')()
const EventLogic = require('../logic/event')
const convertor = require('./../logic/convertor')

let eventsWithMeasurements = []
let numberOfEvents = 0
convertor.setupSensors()

let numberOfClients = 0 
let interval = undefined

const setEventChecker = () => {
  if ( numberOfClients && !interval) {
    interval = setInterval(async () => {
      if(numberOfClients > 0 ){
        const currentNumberOfEvents = await EventLogic.numberOfNotEndedEvents()
        
        if (Boolean(numberOfEvents) !== Boolean(currentNumberOfEvents)) { 
          io.sockets.in('subsCurrentEvent').emit('are-current-events', Boolean(currentNumberOfEvents))
        }

        numberOfEvents = currentNumberOfEvents

        if (currentNumberOfEvents > 0) {
          const notEndedEvents = await EventLogic.findNotFinishedEvents(0, currentNumberOfEvents)
          const lastEventsWithMeasurements = eventsWithMeasurements
          eventsWithMeasurements = await convertor.loadRealtimeMesuarementsEvents(notEndedEvents)
          if (lastEventsWithMeasurements.lenght > 0) {
            for (let index = 0; index < lastEventsWithMeasurements.length; index++) {     
              const event = lastEventsWithMeasurements[index];
              const eventId = event._id    
              console.log('actualizando 223123', eventId)
              const eventFound = eventsWithMeasurements.find( event => event._id = eventId)
              if (eventFound.length > 0) {
                if ( eventFound.lastMeasurementDate !== event.lastMeasurementDate) {
                  const dataEventToUpdate = await convertor.newMeasurementsEvents(event, eventFound)
                  io.sockets.in(eventId).emit('current-events', { data: dataEventToUpdate})
                }
              }
              else {
                io.sockets.in(eventId).emit({ data: false})
              }
            }
          }
        } else {
          eventsWithMeasurements = []
          io.sockets.in('subsCurrentEvent').emit('are-current-events', false)
        }
      }
    }, 1000)
    
  }
  else {
    if (!numberOfClients && interval ) {
      clearInterval(interval)
      interval = undefined
      console.log("clearEvent inverval ")
    }
    console.log("nn")
  }

}
const currentsEvents = async (pageNumberParameter, client) => {
  const pageNumber = Number(pageNumberParameter)
  if (numberOfEvents > 0 && pageNumber < numberOfEvents) {
    const eventsWithMeasurementsToSend = eventsWithMeasurements[pageNumberParameter-1]
    const paginator = { currentPage: pageNumber, totalPages: numberOfEvents, events: [eventsWithMeasurementsToSend] }
    client.emit('current-events', paginator)
    socket.join(eventsWithMeasurementsToSend._id);
  } else {
    io.sockets.in('subsCurrentEvent').emit('are-current-events', false)
  }
}

module.exports = {
  startSocket: (PORT_SOCKET) => {
    console.log('inicio el socket',PORT_SOCKET)
    io.on('connection', (client) => {
      numberOfClients++
      setEventChecker()
      client.join('subsCurrentEvent');
      client.emit('are-current-events', Boolean(numberOfEvents))
      client.on('current-events', (pageNumberParameter) => {
        currentsEvents(pageNumberParameter, client)
      })
      client.on('disconnect', (client) => {
        console.log('user disconnected',client);
        numberOfClients--
        setEventChecker()
      });
    })
    io.listen(PORT_SOCKET)
  }
}
