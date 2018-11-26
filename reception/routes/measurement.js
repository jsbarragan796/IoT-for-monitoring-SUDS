
module.exports = (producer) => {
  const express = require('express')
  const router = express.Router()

  const { sendMeasurementMessage, sendHealdCheck, eventBegun } = require('../tools')

  const { SENSOR_SECRET_TOKEN } = require('../config')

  const getMeasurementType = (sensorId, cannel) => {
    if (sensorId === '4D1089') {
      if (cannel === '2') return 'rain'
      else { return 'NaN' }
    // 4D10B3
    } else {
      if (cannel === '0') {
        return 'conductivity'
      } else if (cannel === '1') {
        return 'level'
      } else {
        return 'NaN'
      }
    }
  }
  const getMessageValue = (message) => {
    return String(message).substr(2, 6)
  }
  const getCannel = (message) => {
    return String(message).substr(1, 1)
  }

  router.post('/', async (req, res, next) => {
    const { body, headers: { authorization } } = req

    if (authorization !== SENSOR_SECRET_TOKEN) res.sendStatus(401)
    else {
      const { sensorId, value, timestamp } = body
      const ts = timestamp * 1000000000
      try {
        if (Number(value) === 0) await sendHealdCheck(producer, sensorId, ts)
        else if (String(value).substr(0, 0) === '9' && String(value).substr(2, 2) === '1') {
          await eventBegun(producer, sensorId, ts)
        } else {
          const messagePart1 = String(value).substr(0, 6)
          const messagePart2 = String(value).substr(6, 11)

          const valM1 = getMessageValue(messagePart1)
          const cannelM1 = getCannel(messagePart1)
          const measurementTypeM1 = getMeasurementType(sensorId, cannelM1)

          await sendMeasurementMessage(producer, sensorId, measurementTypeM1, valM1, ts)

          if (messagePart1 !== messagePart2) {
            const valM2 = getMessageValue(messagePart2)
            const cannelM2 = getCannel(messagePart2)
            const measurementTypeM2 = getMeasurementType(sensorId, cannelM2)
            await sendMeasurementMessage(producer, sensorId, measurementTypeM2, valM2, ts)
          }
        }
        res.sendStatus(200)
      } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
      }
    }
  })

  return router
}
