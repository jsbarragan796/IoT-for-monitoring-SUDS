const express = require('express')
const router = express.Router()

const measurementLogic = require('./../logic/measurement')

router.get('/', (req, res, next) => {
  res.sendStatus(200)
})

module.exports = router

const prueba = async () => {
  const Influx = require('influx')
  const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'suds',
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

  influx.writePoints([
    {
      measurement: 'ph',
      tags: { sensor: 'entrada' },
      fields: { value: 30 },
      timestamp: new Date()
    },
    {
      measurement: 'ph',
      tags: { sensor: 'entrada' },
      fields: { value: 30 },
      timestamp: new Date()
    }
  ])

  let rows = await influx.query(`
      select * from ph
      where sensor = ${Influx.escape.stringLit('entrada')}
      order by time desc
      limit 1000
  `)

  console.log(rows)
}

// prueba()
// .then(() => {

// })
