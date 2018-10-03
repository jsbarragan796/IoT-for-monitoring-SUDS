const express = require('express')
const router = express.Router()

const measurementLogic = require('./../logic/measurement')

const { QUERY_MUST_HAVE_MEASUREMENT_TYPE, QUERY_MUST_HAVE_FUNCTION_AND_TIME_RANGE } = require('../config')

// measurementLogic.getAllMeasurements('ph')
// .then(h => {
//   console.log(h.length + ' puntos')
// })

router.get('/', async (req, res, next) => {
  const { measurementType, sensorId, fromDate, toDate, aggregate, timeRange } = req.query

  try {
    if (!measurementType) throw new Error(QUERY_MUST_HAVE_MEASUREMENT_TYPE)
    else if (!!aggregate !== !!timeRange) throw new Error(QUERY_MUST_HAVE_FUNCTION_AND_TIME_RANGE)
    else {
      const time = new Date().getTime()
      const measurements = await measurementLogic.getMeasurements(measurementType, sensorId, fromDate, toDate, aggregate, timeRange)
      res.send({
        time: `${Math.round((new Date().getTime() - time) / 1000)} secs`,
        records: measurements.length,
        results: measurements
      })
      // res.send(measurements.length)
    }
  } catch (e) {
    // console.log(e)
    res.status(400).send(e.message)
  }
})

router.post('/', async (req, res, next) => {
  const { sensorType, sensorId, measurementType, value, timestamp } = req.body
  const ts = new Date(timestamp * 1000)
  console.log('getting data ', req.body)
  const val = Number(value)
  try {
    await measurementLogic.saveMeasurement(sensorType, sensorId, measurementType, val, ts)
    res.sendStatus(200)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

module.exports = router

// const prueba = async () => {
//   const Influx = require('influx')
//   const influx = new Influx.InfluxDB('https://suds:suds@influx.ingeinsta.com:443/suds', {
//     schema: [
//       {
//         measurement: 'ph',
//         fields: {
//           value: Influx.FieldType.FLOAT
//         },
//         tags: [
//           'sensor'
//         ]
//       }
//     ]
//   })

//   // ESCRITURA
//   influx.writePoints([
//     {
//       measurement: 'ph',
//       tags: { sensor: 'entrada' },
//       fields: { value: 30 },
//       timestamp: new Date()
//     }
//   ])

//   // LECTURA
//   await influx.query(`
//       select * from ph
//       where sensor = ${Influx.escape.stringLit('entrada')}
//       order by time desc
//       limit 1000
//   `)
// }

// prueba()
// .then(() => {

// })
// .catch(e => {
//   console.log(e)
// })
