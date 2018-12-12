const isDev = !!process.env.DEV

module.exports = {
  KAFKA_HOST: isDev ? process.env.KAFKA_HOST_DEV : process.env.KAFKA_HOST,
  KAFKA_PORT: isDev ? process.env.KAFKA_PORT_DEV : process.env.KAFKA_PORT,

  KAFKA_GROUP: 'notification',

  KAFKA_TOPIC_EVENT_STARTED: 'event-started',
  KAFKA_TOPIC_EVENT_FINISHED: 'event-finished',
  KAFKA_TOPIC_MEASUREMENT: 'measurement',
  KAFKA_TOPIC_HEALTHCHECK: 'healthcheck',

  NOTIFICATION_STARTED_RAINING: '0',

  MONGODB_URI: isDev ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI
}
