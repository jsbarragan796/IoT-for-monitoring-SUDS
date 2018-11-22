const isDev = !!process.env.DEV

module.exports = {
  KAFKA_HOST: isDev ? process.env.KAFKA_HOST_DEV : process.env.KAFKA_HOST,
  KAFKA_PORT: isDev ? process.env.KAFKA_PORT_DEV : process.env.KAFKA_PORT,
  KAFKA_TOPIC: isDev ? process.env.KAFKA_TOPIC_DEV : process.env.KAFKA_TOPIC,
  KAFKA_GROUP: isDev ? process.env.KAFKA_GROUP_DEV : process.env.KAFKA_GROUP,

  NOTIFICATION_STARTED_RAINING: '0',

  MONGODB_URI: process.env.MONGODB_URI
}
