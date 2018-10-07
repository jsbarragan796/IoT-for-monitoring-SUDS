
const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'})

module.exports = {
  sendNewRainEventStartedAlert: async (phoneNumber) => {
    const params = {
      Message: 'SUDS-SC -> Ha empezado a llover',
      PhoneNumber: phoneNumber
    }
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise()
    await publishTextPromise
  }
}
