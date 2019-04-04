
const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const { MONGODB_URI } = require('../config')
const MongoCLient = require('mongodb').MongoClient

module.exports = {
  sendEventStartAlarm: async () => {
    return new Promise(async (resolve, reject) => {
      MongoCLient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
        if (err) reject(err)
        else {
          const Users = client.db().collection('User')
          Users.find({}).toArray(async (err, users) => {
            if (err) reject(err)
            else {
              for (let user of users) {
                const { phone } = user
                const params = {
                  Message: 'SUDS-SC -> Ha empezado a llover',
                  PhoneNumber: String(phone)
                }
                var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise()
                await publishTextPromise
              }
              resolve()
            }
          })
        }
      })
    })
  },

  sendSensorMightFailAlarm: (to) => {

  }
}
