const Kafka = require('node-rdkafka')

const { KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC_EVENT_FINISHED, KAFKA_GROUP } = require('./config')

module.exports = {
  getConsumer: () => {
    return new Promise((resolve, reject) => {
      const consumer = new Kafka.KafkaConsumer({
        'group.id': KAFKA_GROUP,
        'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`
      }, {})

      consumer.connect()

      consumer
        .on('ready', () => {
          console.log('Aggregate data ready to consume')
          consumer.subscribe([KAFKA_TOPIC_EVENT_FINISHED])
          consumer.consume()
          resolve(consumer)
        })
    })
  }
}
