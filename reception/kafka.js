const Kafka = require('node-rdkafka')

const { KAFKA_HOST, KAFKA_PORT } = require('./config')

console.log(KAFKA_HOST)

module.exports = {
  getProducer: () => {
    return new Promise((resolve, reject) => {
      const producer = new Kafka.Producer({
        'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`
      })
      producer.connect()

      producer.on('ready', () => {
        resolve(producer)
      })
    })
  }
}
