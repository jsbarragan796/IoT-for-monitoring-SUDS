const express = require('express')
const router = express.Router()

const measurementLogic = require('./../logic/measurement')

router.get('/', (req, res, next) => {
  res.sendStatus(200)
})

module.exports = router

const prueba = async () => {
  const Influx = require('influx')
  const influx = new Influx.InfluxDB('https://suds:suds@influx.ingeinsta.com:443/suds', {
    schema: [
      {
        measurement: 'ph',
        fields: {
          value: Influx.FieldType.FLOAT
        },
        tags: [
          'sensor'
        ]
      }
    ]
  })

  // ESCRITURA
  influx.writePoints([
    {
      measurement: 'ph',
      tags: { sensor: 'entrada' },
      fields: { value: 30 },
      timestamp: new Date()
    }
  ])

  // LECTURA
  await influx.query(`
      select * from ph
      where sensor = ${Influx.escape.stringLit('entrada')}
      order by time desc
      limit 1000
  `)
}

// prueba()
// .then(() => {

// })
// .catch(e => {
//   console.log(e)
// })
