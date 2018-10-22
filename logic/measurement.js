
const Influx = require('influx')

const { INFLUX_DB_DATABASE, INFLUX_DB_HOST, INFLUX_DB_PORT,
  INFLUX_DB_USERNAME, INFLUX_DB_PASSWORD, INFLUX_DB_PROTOCOL } = require('../config')

const eventLogic = require('./event')

const influx = new Influx.InfluxDB({
  database: INFLUX_DB_DATABASE,
  host: INFLUX_DB_HOST,
  port: INFLUX_DB_PORT,
  username: INFLUX_DB_USERNAME,
  password: INFLUX_DB_PASSWORD,
  protocol: INFLUX_DB_PROTOCOL
}, {
  schema: [ {
    measurement: 'ph',
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
      if (sensorId) whereClause += `sensorId = ${sensorId}`
      if (fromDate) whereClause += (sensorId ? ` and ` : ``) + `time >= ${fromDate}`
      if (toDate) {
        whereClause += ((sensorId || fromDate) ? ` and ` : ``) +
          `time <= ${toDate}`
      }
    }

    if (timeRange) {
      groupClause = `GROUP BY time(${timeRange})`
    }

    const query = `
    SELECT ${aggregate ? `${aggregate}(${'value'})` : '*'} 
    FROM ${measurementType}
    ${whereClause || ''}
    ${groupClause || ''}
    ORDER BY time desc
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
    const { _id, lastMeasurementDate: mostRecentEventFinishDate, startDate: mostRecentEventStartDate } = await eventLogic.findMostRecentEvent()
 
    if (mostRecentEventFinishDate + 1000000000 * 60 * 30 < timestamp) {
      const inputQuery = `
        SELECT MEAN(value)
        FROM level
        WHERE time >= ${mostRecentEventStartDate} AND time <= ${mostRecentEventFinishDate}
          AND sensorId = '0'
        GROUP BY time(1m)
      `
      const lastEventInputMeasurements = await influx.query(inputQuery)

      const outputQuery = `
        SELECT MEAN(value)
        FROM level
        WHERE time >= ${mostRecentEventStartDate} AND time <= ${mostRecentEventFinishDate}
          AND sensorId= '1'
        GROUP BY time(1m)
      `
      const lastEventOutputMeasurements = await influx.query(outputQuery)

      const lastEventData = { _id, finishDate: mostRecentEventFinishDate, startDate: mostRecentEventStartDate, inputMeasurements: lastEventInputMeasurements, outputMeasurements: lastEventOutputMeasurements }
      const newEventData = { startDate: timestamp }

      await eventLogic.endEventAndCreateOne(lastEventData, newEventData)
    } else {
      const eventToUpdate = { _id, lastMeasurementDate: timestamp }
      await eventLogic.updateLastMeasurementDate(eventToUpdate)
    }

    await influx.writePoints([{
      measurement: measurementType,
      tags: { sensorId },
      fields: { value },
      timestamp
    }]).catch((e) => console.log(e))
  }
}
