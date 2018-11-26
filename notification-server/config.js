const isDev = !!process.env.DEV

module.exports = {
  KAFKA_HOST: isDev ? process.env.KAFKA_HOST_DEV : process.env.KAFKA_HOST,
  KAFKA_PORT: isDev ? process.env.KAFKA_PORT_DEV : process.env.KAFKA_PORT,
  KAFKA_GROUP: process.env.KAFKA_GROUP,

  KAFKA_TOPIC_EVENT: 'event',
  KAFKA_TOPIC_MEASUREMENT: 'measurement',
  KAFKA_TOPIC_HEALTHCHECK: 'healthcheck',
  KAFKA_TOPIC_NOTIFICATION: 'notification',

  NOTIFICATION_STARTED_RAINING: '0',

  MONGODB_URI: isDev ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI
}
