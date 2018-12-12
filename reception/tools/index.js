
const { KAFKA_TOPIC_MEASUREMENT, KAFKA_TOPIC_HEALTHCHECK, KAFKA_TOPIC_EVENT_STARTED } = require('../config')

module.exports = (producer) => {
  const sendMeasurementMessage = (sensorId, measurementType, val, ts) => {
    const message = `${ts}_$_${sensorId}_$_${measurementType}_$_${val}`
    producer.produce(KAFKA_TOPIC_MEASUREMENT, null, Buffer.from(message))
  }

  const eventBegun = (sensorId, ts) => {
    const message = `${ts}`
    producer.produce(KAFKA_TOPIC_EVENT_STARTED, null, Buffer.from(message))
  }

  const sendHealthCheck = (sensorId, ts) => {
    const message = `${sensorId}_$_${ts}`
    producer.produce(KAFKA_TOPIC_HEALTHCHECK, null, Buffer.from(message))
  }

  return {
    sendMeasurementMessage,
    eventBegun,
    sendHealthCheck
  }
}
