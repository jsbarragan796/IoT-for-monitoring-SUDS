const express = require('express')
const router = express.Router()

const EventLogic = require('../logic/event')

router.get('/', async (req, res, next) => {
  try {
    const events = await EventLogic.findAllEvents()
    res.send(events)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

module.exports = router
