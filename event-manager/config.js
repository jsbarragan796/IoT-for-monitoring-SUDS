
module.exports = {
  PORT: process.env.PORT,
  LOG_DIRECTORY: process.env.LOG_DIRECTORY,

  KAFKA_HOST: process.env.KAFKA_HOST,
  KAFKA_PORT: process.env.KAFKA_PORT,
  KAFKA_TOPIC_CONSUMER: process.env.KAFKA_TOPIC_CONSUMER,
  KAFKA_TOPIC_PRODUCER: process.env.KAFKA_TOPIC_PRODUCER,

  MONGODB_URI: process.env.MONGODB_URI
}
