
const { MONGODB_URI } = require('../config')

const MongoCLient = require('mongodb').MongoClient

module.exports = {
  findAllEvents: () => {
    return new Promise((resolve, reject) => {
      MongoCLient.connect(MONGODB_URI, (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('event')
          Events.find({}).toArray((err, points) => {
            if (err) reject(err)
            else resolve(points)
            client.close()
          })
        }
      })
    })
  },

  findMostRecentEvent: () => {
    return new Promise((resolve, reject) => {
      MongoCLient.connect(MONGODB_URI, (err, client) => {
        if (err) reject(err)
        else {
          let Events = client.db().collection('event')
          Events.find({}).toArray((err, points) => {
            if (err) reject(err)
            else resolve(points)
            client.close()
          })
        }
      })
    })
  }
}
