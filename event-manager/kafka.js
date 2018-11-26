const Kafka = require('node-rdkafka')

const { KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC_MEASUREMENT, KAFKA_GROUP } = require('./config')

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
  },
  getConsumer: () => {
    return new Promise((resolve, reject) => {
      const consumer = new Kafka.KafkaConsumer({
        'group.id': KAFKA_GROUP,
        'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`
      }, {})

      consumer.connect()

      consumer
        .on('ready', () => {
          console.log('Event manager ready to consume\n')
          consumer.subscribe([KAFKA_TOPIC_MEASUREMENT])
          consumer.consume()
          resolve(consumer)
        })
    })
  }
}
