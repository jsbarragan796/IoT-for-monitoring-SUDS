(async () => {
  require('dotenv').config()

  const { NOTIFICATION_STARTED_RAINING } = require('./config')

  const { getConsumer } = require('./kafka')

  console.log('va')

  const consumer = await getConsumer()

  consumer.connect()

  consumer
    .on('data', (data) => {
      const { value } = data
      const message = value.toString()

      if (message === NOTIFICATION_STARTED_RAINING) {

      }
    })
})()
