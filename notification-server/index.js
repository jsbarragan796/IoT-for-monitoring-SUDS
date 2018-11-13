(async () => {
  require('dotenv').config()

  const { getConsumer } = require('./kafka')

  const { sendEventStartAlarm } = require('./tools')

  const { NOTIFICATION_STARTED_RAINING } = require('./config')

  const consumer = await getConsumer()

  consumer.connect()

  consumer
    .on('data', async (data) => {
      const { value } = data
      const message = value.toString()

      console.log(`Notification got message ${message}`)

      if (message === NOTIFICATION_STARTED_RAINING) {
        await sendEventStartAlarm()
      }
    })
})()
