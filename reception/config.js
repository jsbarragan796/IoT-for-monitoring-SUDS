const isDev = !!process.env.DEV

module.exports = {
  PORT: process.env.PORT,
  LOG_DIRECTORY: process.env.LOG_DIRECTORY,

  SENSOR_SECRET_TOKEN: process.env.SENSOR_SECRET_TOKEN,
  KAFKA_HOST: isDev ? process.env.KAFKA_HOST_DEV : process.env.KAFKA_HOST,
  KAFKA_PORT: isDev ? process.env.KAFKA_PORT_DEV : process.env.KAFKA_PORT,
  KAFKA_TOPIC: isDev ? process.env.KAFKA_TOPIC_DEV : process.env.KAFKA_TOPIC,
  KAFKA_TOPIC_HEALTHCHECK: isDev ? process.env.KAFKA_TOPIC_HEALTHCHECK : process.env.KAFKA_TOPIC_HEALTHCHECK,
  KAFKA_TOPIC_EVENT_BEGUN: isDev ? process.env.KAFKA_TOPIC_EVENT_BEGUN : process.env.KAFKA_TOPIC_EVENT_BEGUN
}
