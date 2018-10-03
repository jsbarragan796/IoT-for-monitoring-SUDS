const express = require('express')
const router = express.Router()

const EventLogic = require('../logic/event')

router.get('/', async (req, res, next) => {
  try {
    const events = await EventLogic.findAllEvents()
    console.log(events)

    res.send([{
      startDate: 33,
      finishDate: 44
    }, {
      startDate: 55,
      finishDate: 77
    }])
  } catch (e) {
    res.status(400).send(e.message)
  }
})

module.exports = router
