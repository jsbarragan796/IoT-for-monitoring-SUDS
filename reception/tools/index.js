
const { KAFKA_TOPIC_MEASUREMENT, KAFKA_TOPIC_HEALTHCHECK, KAFKA_TOPIC_EVENT } = require('../config')

module.exports = {
  sendMeasurementMessage: (producer, sensorId, measurementType, val, ts) => {
    const message = `${sensorId}_$_${measurementType}_$_${val}_$_${ts}`
    producer.produce(KAFKA_TOPIC_MEASUREMENT, null, Buffer.from(message))
  },

  sendHealdCheck: (producer, sensorId, ts) => {
    const message = `${sensorId}_$_${ts}`
    producer.produce(KAFKA_TOPIC_HEALTHCHECK, null, Buffer.from(message))
  },

  eventBegun: (producer, sensorId, ts) => {
    const message = `${sensorId}_$_${ts}`
    producer.produce(KAFKA_TOPIC_EVENT, null, Buffer.from(message))
  }
}
