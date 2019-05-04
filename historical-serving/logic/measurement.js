
const Influx = require('influx')

const { INFLUX_DB_DATABASE, INFLUX_DB_HOST, INFLUX_DB_PORT,
  INFLUX_DB_USERNAME, INFLUX_DB_PASSWORD, INFLUX_DB_PROTOCOL } = require('../config')

const influx = new Influx.InfluxDB({
  database: INFLUX_DB_DATABASE,
  host: INFLUX_DB_HOST,
  port: INFLUX_DB_PORT,
  username: INFLUX_DB_USERNAME,
  password: INFLUX_DB_PASSWORD,
  protocol: INFLUX_DB_PROTOCOL
}, {
  schema: [ {
    measurement: 'conductivity',
    fields: {
      value: Influx.FieldType.FLOAT
    },
    tags: [
      'sensorId'
    ]
  }, {
    measurement: 'rain',
    fields: {
      value: Influx.FieldType.FLOAT
    },
    tags: [
      'sensorId'
    ]
  }, {
    measurement: 'level',
    fields: {
      value: Influx.FieldType.FLOAT
    },
    tags: [
      'sensorId'
    ]
  }]
})

module.exports = {
  getMeasurements: async (measurementType, sensorId, fromDate, toDate, aggregate, timeRange) => {
    let whereClause
    let groupClause

    if (sensorId || fromDate || toDate) {
      whereClause = 'WHERE '
      if (sensorId) whereClause += `"sensorId" = '${sensorId}'`
      if (fromDate) whereClause += (sensorId ? ` and ` : ``) + `time >= ${fromDate}`
      if (toDate) {
        whereClause += ((sensorId || fromDate) ? ` and ` : ``) +
          `time <= ${toDate}`
      }
    }

    if (timeRange) {
      groupClause = `GROUP BY time(${timeRange}) fill(none)`
    }

    const query = `
    SELECT ${aggregate ? `${aggregate}(${'value'})` : '*'} as value
    FROM ${measurementType}
    ${whereClause || ''}
    ${groupClause || ''}
    ORDER BY time asc
    `
    return influx.query(query)
  }
}
