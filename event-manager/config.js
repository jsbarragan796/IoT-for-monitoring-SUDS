const isDev = !!process.env.DEV

module.exports = {
  PORT: process.env.PORT,
  LOG_DIRECTORY: process.env.LOG_DIRECTORY,

  KAFKA_HOST: isDev ? process.env.KAFKA_HOST_DEV : process.env.KAFKA_HOST,
  KAFKA_PORT: isDev ? process.env.KAFKA_PORT_DEV : process.env.KAFKA_PORT,
  KAFKA_GROUP: isDev ? process.env.KAFKA_GROUP_DEV : process.env.KAFKA_GROUP,
  KAFKA_TOPIC_CONSUMER: isDev ? process.env.KAFKA_TOPIC_CONSUMER_DEV : process.env.KAFKA_TOPIC_CONSUMER,
  KAFKA_TOPIC_PRODUCER_CLOSING_EVENT: isDev ? process.env.KAFKA_TOPIC_PRODUCER_CLOSING_EVENT_DEV : process.env.KAFKA_TOPIC_PRODUCER_CLOSING_EVENT,
  KAFKA_TOPIC_PRODUCER_NOTIFICATION: isDev ? process.env.KAFKA_TOPIC_PRODUCER_NOTIFICATION_DEV : process.env.KAFKA_TOPIC_PRODUCER_NOTIFICATION,

  NOTIFICATION_STARTED_RAINING: '0',

  MONGODB_URI: process.env.MONGODB_URI
}
