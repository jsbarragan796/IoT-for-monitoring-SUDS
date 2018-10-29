
require('dotenv').config()

const Kafka = require('node-rdkafka')

const { KAFKA_GROUP_ID, KAFKA_BROKER_HOST, KAFKA_BROKER_PORT, KAFKA_TOPIC } = require('./config')

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': 'localhost:9092'
}, {})

consumer.connect()

consumer
  .on('ready', () => {
    consumer.subscribe(['test'])

    // Consume from the librdtesting-01 topic. This is what determines
    // the mode we are running in. By not specifying a callback (or specifying
    // only a callback) we get messages as soon as they are available.
    consumer.consume()
  })
  .on('data', (data) => {
    // Output the actual message contents
    console.log(data.value.toString())
  })
