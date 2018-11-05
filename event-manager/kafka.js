const Kafka = require('node-rdkafka')

const { KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC_CONSUMER } = require('./config')

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
        'group.id': 'kafka',
        'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`
      }, {})

      consumer.connect()

      consumer
      .on('ready', () => {
        console.log('Event manager ready to consume')
        consumer.subscribe([KAFKA_TOPIC_CONSUMER])
        consumer.consume()
        resolve(consumer)
      })
    })
  }
}
