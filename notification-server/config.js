const isDev = !!process.env.DEV

module.exports = {
  KAFKA_GROUP_ID: isDev ? process.env.KAFKA_GROUP_ID_DEV : process.env.KAFKA_GROUP_ID,
  KAFKA_BROKER_HOST: isDev ? process.env.KAFKA_BROKER_HOST_DEV : process.env.KAFKA_BROKER_HOST,
  KAFKA_BROKER_PORT: isDev ? process.env.KAFKA_BROKER_PORT_DEV : process.env.KAFKA_BROKER_PORT,
  KAFKA_TOPIC: isDev ? process.env.KAFKA_TOPIC_DEV : process.env.KAFKA_TOPIC
}
