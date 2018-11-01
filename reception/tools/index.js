const Kafka = require('node-rdkafka')

const { KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC } = require('../config')

const producer = new Kafka.Producer({
  'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`
})

module.exports = {
  sendMeasurementMessage: (sensorId, measurementType, val, ts) => {
    producer.connect()

    producer.on('ready', () => {
      try {
        const message = `${sensorId}_$_${measurementType}_$_${val}_$_${ts}`
        producer.produce(KAFKA_TOPIC, null, Buffer.from(message))
      } catch (e) {
        console.error('A problem occurred when sending our message')
        console.error(e)
      }
    })
  }
}
