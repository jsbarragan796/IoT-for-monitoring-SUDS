
const io = require('socket.io')()
const EventLogic = require('../logic/event')
const convertor = require('./../logic/convertor')

let eventsWithMeasurements = []
let numberOfEvents = 0
let numberOfClients = 0 
let interval = undefined


const validatorFunction =  () =>{
  return new Promise(async (resolve, reject) => {
  // console.log("interval executing")
  if(numberOfClients > 0 ){
    const currentNumberOfEvents = await EventLogic.numberOfNotEndedEvents()
    if ( numberOfEvents && !currentNumberOfEvents) { 
      io.sockets.in('subsCurrentEvent').emit('are-current-events', false)
      io.sockets.in('subsCurrentEventData').emit('current-events', { currentPage: 0, totalPages: 0, events: []})
      eventsWithMeasurements = []
      numberOfEvents = 0 
    }
    if ( !numberOfEvents && currentNumberOfEvents) { 
      const notEndedEvents = await EventLogic.findNotFinishedEvents(0, currentNumberOfEvents)
      eventsWithMeasurements = await convertor.loadRealtimeMesuarementsEvents(notEndedEvents)
      const paginator = { currentPage: 1, totalPages: 1, events: eventsWithMeasurements }
      io.sockets.in('subsCurrentEvent').emit('are-current-events', true)
      io.sockets.in('subsCurrentEventData').emit('current-events', paginator)
      numberOfEvents = 1
    }
    if (numberOfEvents === 1 && currentNumberOfEvents === 1) {
      const notEndedEvents = await EventLogic.findNotFinishedEvents(0, currentNumberOfEvents)
      const lastEventsWithMeasurements = [...eventsWithMeasurements]
      eventsWithMeasurements = await convertor.loadRealtimeMesuarementsEvents(notEndedEvents)
      const event = lastEventsWithMeasurements[0]
      const eventFound = eventsWithMeasurements[0]
      if ( eventFound.lastMeasurementDate !== event.lastMeasurementDate) {
        const dataEventToUpdate = await convertor.newMeasurementsEvents(event, eventFound)
        io.sockets.in("subsCurrentEventData").emit('update-current-events', { data: dataEventToUpdate})
      }      
    }
  }
  resolve()})
}


const setEventChecker = () => {
  return new Promise(async (resolve, reject) => {
    if ( numberOfClients && !interval) {
      await validatorFunction()
      interval = setInterval( validatorFunction , 1000)
      console.log("interval alive")
    }
    else {
      if (!numberOfClients && interval ) {
        clearInterval(interval)
        interval = undefined
        eventsWithMeasurements = []
        numberOfEvents = 0
        console.log("interval killed")
      }
    }
    resolve()
  })
}

module.exports = {
  startSocket: (PORT_SOCKET) => {
    console.log('socket start on port ',PORT_SOCKET)
    io.on('connection', (client) => {
      numberOfClients++
      console.log("Entro numberOfClients", numberOfClients)
      client.on('sub-are-current-events',  async (join) => {
        await setEventChecker()
        console.log("Entro  sub-are-current-events", numberOfEvents)
        client.emit('are-current-events', Boolean(numberOfEvents))
        if (join) client.join('subsCurrentEvent');
      }) 
      client.on('sub-current-events', async (join) => {
        console.log("Entro  ")
        console.log("numberOfEvents  ",  numberOfEvents)
        await setEventChecker()
        console.log("numberOfEvents derspues ",  numberOfEvents)
        if (numberOfEvents) {
          console.log("caso 1")
          const paginator = { currentPage: 1, totalPages: 1, events: eventsWithMeasurements }
          client.emit('current-events', paginator)
        } else {
          console.log("caso 2", numberOfEvents)
          client.emit('current-events', { currentPage: 0, totalPages: 0, events: []}) 
        }
        if (join) client.join('subsCurrentEventData');
      }) 
      client.on('disconnect', async() => {
        numberOfClients--
        console.log(" disconed numberOfClients ", numberOfClients)
        if (numberOfClients < 0 ) numberOfClients = 0
        await setEventChecker()
      });
    })
    io.listen(PORT_SOCKET)
  }
}
