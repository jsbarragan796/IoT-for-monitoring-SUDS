const isDev = !!process.env.DEV

module.exports = {
  PORT: process.env.PORT,
  LOG_DIRECTORY: process.env.LOG_DIRECTORY,

  KAFKA_HOST: isDev ? process.env.KAFKA_HOST_DEV : process.env.KAFKA_HOST,
  KAFKA_PORT: isDev ? process.env.KAFKA_PORT_DEV : process.env.KAFKA_PORT,

  CRON_SCHEDULE: isDev ? '* * * * *' : '* * */6 * *',

  KAFKA_GROUP: 'event-manager',

  KAFKA_TOPIC_EVENT_STARTED: 'event-started',
  KAFKA_TOPIC_EVENT_FINISHED: 'event-finished',
  KAFKA_TOPIC_MEASUREMENT: 'measurement',
  KAFKA_TOPIC_HEALTHCHECK: 'healthcheck',

  NOTIFICATION_STARTED_RAINING: '0',

  MONGODB_URI: isDev ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI
}
