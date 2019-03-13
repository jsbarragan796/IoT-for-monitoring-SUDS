
const io = require('socket.io')()
const EventLogic = require('../logic/event')
const convertor = require('./../logic/convertor')

let eventsWithMeasurements = []
let numberOfEvents = 0
let numberOfClients = 0 
let interval = undefined


const validatorFunction = async () =>{
  if(numberOfClients > 0 ){
    const currentNumberOfEvents = await EventLogic.numberOfNotEndedEvents()
    if (Boolean(numberOfEvents) !== Boolean(currentNumberOfEvents)) { 
      io.sockets.in('subsCurrentEvent').emit('are-current-events', Boolean(currentNumberOfEvents))
      io.sockets.in('wait-for-current-events').emit('refresh-current-events', true)
      if ( !currentNumberOfEvents ) {
        eventsWithMeasurements = []
        numberOfEvents = 0 
      }
    }
    numberOfEvents = currentNumberOfEvents
    if (numberOfEvents) {
      const notEndedEvents = await EventLogic.findNotFinishedEvents(0, currentNumberOfEvents)
      const lastEventsWithMeasurements = eventsWithMeasurements
      eventsWithMeasurements = await convertor.loadRealtimeMesuarementsEvents(notEndedEvents)
      console.log("inico ", lastEventsWithMeasurements.length)
      if (lastEventsWithMeasurements.length > 0) {
        console.log("engtro ")
        for (let index = 0; index < lastEventsWithMeasurements.length; index++) {     
          const event = lastEventsWithMeasurements[index];
          const eventId = event._id
          console.log("buscando ", eventId)    
          const eventFound = eventsWithMeasurements.find( event => event._id = eventId)  
          if (eventFound) {
            if ( eventFound.lastMeasurementDate !== event.lastMeasurementDate) {
              const dataEventToUpdate = await convertor.newMeasurementsEvents(event, eventFound)
              console.log("UPDATE!!")
              io.sockets.in(eventId).emit('update-current-events', { data: dataEventToUpdate})
            }
          }
          else {
            io.sockets.in(eventId).emit('refresh-current-events', true)
          }
        }
      }
    }
  }
}


const setEventChecker = async () => {
  if ( numberOfClients && !interval) {
    validatorFunction()
    interval = setInterval( validatorFunction , 1000)
  }
  else {
    if (!numberOfClients && interval ) {
      clearInterval(interval)
      interval = undefined
      eventsWithMeasurements = []
      numberOfEvents = 0
    }
  }

}
const currentsEvents = async (pageNumberParameter, client) => {
  const pageNumber = Number(pageNumberParameter)
  if (numberOfClients === 1 ) await validatorFunction()
  if (numberOfEvents && pageNumber <= numberOfEvents && eventsWithMeasurements.length) {
    const eventsWithMeasurementsToSend = eventsWithMeasurements[pageNumberParameter-1]
    const paginator = { currentPage: pageNumber, totalPages: numberOfEvents, events: [eventsWithMeasurementsToSend] }
    client.emit('current-events', paginator)
    client.join(eventsWithMeasurementsToSend._id);
    client.join('wait-for-current-events');
  } else {
    client.emit('current-events', { currentPage: 0, totalPages: 0, events: []})
  }
}

module.exports = {
  startSocket: (PORT_SOCKET) => {
    console.log('inicio el socket',PORT_SOCKET)
    io.on('connection', (client) => {
      numberOfClients++
      setEventChecker()
      client.on('sub-are-current-events', (join) => {
        if (join) client.join('subsCurrentEvent');
        client.emit('are-current-events', Boolean(numberOfEvents))
      }) 
      client.on('get-current-events', (pageNumberParameter) => {
        currentsEvents(pageNumberParameter, client)
      })
      client.on('disconnect', () => {
        numberOfClients--
        if (numberOfClients < 0 ) numberOfClients = 0
        setEventChecker()
      });
    })
    io.listen(PORT_SOCKET)
  }
}
