
const { REDIS_URL, MONGODB_URI } = require('./config')

const Redis = require('ioredis')
const redis = new Redis(REDIS_URL)

const MongoClient = require('mongodb').MongoClient

const mongoConnect = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, async (err, client) => {
      if (err) reject(err)
      else {
        resolve(client)
      }
    })
  })
}

module.exports = async () => {
  const mongo = await mongoConnect()

  const Sensor = mongo.db().collection('Sensor')
  const sensors = await Sensor.find({}).toArray()

  const MeasurementType = mongo.db().collection('MeasurementType')
  const measurementTypes = await MeasurementType.find({}).toArray()

  for (let sensor of sensors) {
    const type = measurementTypes.filter(({ _id }) => {
      return sensor.type.toString() === _id.toString()
    })[0]

    if (type) await redis.set(sensor.id, type.name)
    console.log(`${sensor.id} - ${type.name} - isEntrance: ${sensor.isEntrance}`)
  }

  return redis
}
