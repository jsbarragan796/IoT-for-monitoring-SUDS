(async () => {
  require('dotenv').config()

  const { getConsumer } = require('./kafka')

  const { sendEventStartAlarm } = require('./tools')

  const { KAFKA_TOPIC_EVENT_STARTED } = require('./config')

  const consumer = await getConsumer()

  consumer.connect()

  consumer
    .on('data', async (data) => {
      const { value, topic } = data
      const message = value.toString()

      console.log(`Notification got message ${message} from topic ${topic}`)

      if (topic === KAFKA_TOPIC_EVENT_STARTED) {
        await sendEventStartAlarm()
      }
    })
})()
