const express = require('express')
const router = express.Router()

const { sendMeasurementMessage } = require('../tools')

const { SENSOR_SECRET_TOKEN } = require('../config')

router.post('/', async (req, res, next) => {
  const { body, headers: { authorization } } = req
  if (authorization !== SENSOR_SECRET_TOKEN) res.sendStatus(401)
  else {
    const { sensorId, measurementType, value, timestamp } = body

    const ts = timestamp * 1000000000
    const val = Number(value)

    try {
      await sendMeasurementMessage(sensorId, measurementType, val, ts)
      res.sendStatus(200)
    } catch (e) {
      console.log(e)
      res.status(400).send(e.message)
    }
  }
})

module.exports = router
