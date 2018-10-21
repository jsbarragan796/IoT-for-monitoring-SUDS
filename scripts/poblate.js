
require('dotenv').config()

const Influx = require('influx')

const { INFLUX_DB_DATABASE, INFLUX_DB_HOST, INFLUX_DB_PORT,
  INFLUX_DB_USERNAME, INFLUX_DB_PASSWORD, INFLUX_DB_PROTOCOL } = require('../config')

const influx = new Influx.InfluxDB({
  database: INFLUX_DB_DATABASE,
  host: INFLUX_DB_HOST,
  port: INFLUX_DB_PORT,
  username: INFLUX_DB_USERNAME,
  password: INFLUX_DB_PASSWORD,
  protocol: INFLUX_DB_PROTOCOL
}, {
  schema: [ {
    measurement: 'conductivity',
    fields: {
      value: Influx.FieldType.FLOAT
    },
    tags: [
      'sensorId'
    ]
  }, {
    measurement: 'level',
    fields: {
      value: Influx.FieldType.FLOAT
    },
    tags: [
      'sensorId'
    ]
  }]
})

// 1528264800000000
// 1528264801000000 1s
// 1528264860000000 1m

// 2018/06/06 06:00:00
const initialDate = 1528264800000

const events = 0
const eventDurationMins = 120
const timeBetweenEventsMins = 60 * 8
const sensors = 0
const intervalSecs = 0.5
const batchPercent = 1.5

const before = async () => {
  await influx.dropDatabase(INFLUX_DB_DATABASE)
  console.log('deleted database')
  await influx.createDatabase(INFLUX_DB_DATABASE)
  console.log('created database\n')
}

const init = async (initialDate, events, eventDurationMins, timeBetweenEventsMins, sensors, intervalSecs, batchPercent) => {
  await before()
  let date = initialDate
  const eventDuration = eventDurationMins * 60 * 1000
  const timeBetweenEvents = timeBetweenEventsMins * 60 * 1000
  const interval = intervalSecs * 1000
  let measurements = []
  let conductivity = 0.00
  let level = 0.00

  const time = new Date().getTime()
  const totalMeditionsPerType = events * eventDuration / interval
  let count = 0
  let progress
  let prevProgress = -1

  console.log(`time points: ${totalMeditionsPerType}`)
  console.log(`total meditions: ${totalMeditionsPerType * sensors}`)
  console.log(`total records: ${totalMeditionsPerType * sensors * 2}\n`)

  for (let i = 0; i < events; i++) {
    for (let k = 0; k < eventDuration; k += interval) {
      for (let j = 0; j < sensors; j++) {
        conductivity = Math.round(100 * Math.random() * 10) / 100
        level = Math.round(100 * Math.random() * 10) / 100

        measurements.push({
          measurement: 'conductivity',
          tags: {
            sensorId: j
          },
          fields: {
            value: conductivity
          },
          timestamp: new Date(date)
        })
        measurements.push({
          measurement: 'level',
          tags: {
            sensorId: j
          },
          fields: {
            value: level
          },
          timestamp: new Date(date)
        })
      }

      count++
      progress = Math.round(10000 * count / totalMeditionsPerType) / 100
      if ((progress - batchPercent) >= prevProgress) {
        await influx.writePoints(measurements)
        measurements = []
        console.log(`count: ${count * sensors} -> ${progress}%`)
        prevProgress = progress
      }
      date += interval
    }
    date += timeBetweenEvents
  }

  await influx.writePoints(measurements)
  console.log(`\nfinished in : ${Math.round((new Date().getTime() - time) / (1000 * 60))} mins\n`)
}

init(initialDate, events, eventDurationMins, timeBetweenEventsMins, sensors, intervalSecs, batchPercent)
.catch((e) => {
  console.log(e)
})
