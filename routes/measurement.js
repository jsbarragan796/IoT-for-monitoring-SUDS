const express = require('express')
const router = express.Router()

const measurementLogic = require('./../logic/measurement')

router.get('/', (req, res, next) => {
  res.sendStatus(200)
})

module.exports = router
