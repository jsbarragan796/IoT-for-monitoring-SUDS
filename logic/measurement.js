
const Influx = require('influx')

// const influx = new Influx.InfluxDB('http://root:root@localhost:8086/suds', {
const influx = new Influx.InfluxDB('https://suds:suds@influx.ingeinsta.com:443/suds', {
  schema: [
    {
      measurement: 'ph',
      fields: {
        value: Influx.FieldType.FLOAT
      },
      tags: [
        'sensorType',
        'sensorId'
      ]
    }
  ]
})

module.exports = {
  getMeasurements: async (measurementType, sensorType, sensorId, fromDate, toDate) => {
    let whereClause

    if (sensorType || sensorId || fromDate || toDate) {
      whereClause = 'where '
      if (sensorType) whereClause += `sensorType = ${sensorType} `
      if (sensorId) whereClause += (sensorType ? ` and ` : ``) + `sensorId = ${sensorId}`
      if (fromDate) whereClause += ((sensorType || sensorId) ? ` and ` : ``) + `time >= ${fromDate}`
      if (toDate) {
        whereClause += ((sensorType || sensorId || fromDate) ? ` and ` : ``) +
          `time <= ${toDate}`
      }
    }

    const query = `
    select * from ${measurementType}
    ${whereClause || ''}
    order by time desc
    `

    return influx.query(query)
  },

  /**
  * Sabes a measurement
  * @param sensorId id of the sensor
  * @param measurementType type of measure
  * @param value value of the measure
  * @param timestamp time of the measure
  * @returns {Promise <Object, Error>} A promise that resolves with the client or rejects an error
  */
  saveMeasurement: async (sensorType, sensorId, measurementType, value, timestamp) => {
    // MEASUREMENT

    await influx.writePoints([{
      measurement: measurementType,
      tags: { sensorType, sensorId },
      fields: { value },
      timestamp
    }])
  }
}

// influx.writePoints([{
//   measurement: 'ph',
//   tags: { sensorType: 'entrada', sensorId: '1' },
//   fields: { value: 11 },
//   timestamp: new Date()
// }])
// .then(() => {
//   console.log('coronamos')
// })
