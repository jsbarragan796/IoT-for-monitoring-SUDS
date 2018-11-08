const express = require('express')
const router = express.Router()

const measurementLogic = require('./../logic/measurement')

const { QUERY_MUST_HAVE_MEASUREMENT_TYPE, QUERY_MUST_HAVE_FUNCTION_AND_TIME_RANGE } = require('../config')

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
    res.status(400).send(e.message)
  }
})

router.get('/events', async (req, res, next) => {
  const { measurementType, sensorId, fromDate, toDate, aggregate, timeRange } = req.query

  try {
    
      const measurements = await measurementLogic.getMeasurements(measurementType, sensorId, fromDate, toDate, aggregate, timeRange)
      res.send({
        time: `${Math.round((new Date().getTime() - time) / 1000)} secs`,
        records: measurements.length,
        results: measurements
      })
      // res.send(measurements.length)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

module.exports = router
