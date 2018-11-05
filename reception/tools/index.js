
const { KAFKA_TOPIC } = require('../config')

module.exports = {
  sendMeasurementMessage: (producer, sensorId, measurementType, val, ts) => {
    const message = `${sensorId}_$_${measurementType}_$_${val}_$_${ts}`
    producer.produce(KAFKA_TOPIC, null, Buffer.from(message))
  }
}
