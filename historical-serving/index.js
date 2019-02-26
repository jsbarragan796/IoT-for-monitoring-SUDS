
require('dotenv').config()

const http = require('http')
const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs')
const realTimeService = require('./realTimeService/realTime')
const { PORT, SOCKET_PORT } = require('./config')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

const server = http.createServer(app)
server.listen(PORT)
server.on('listening', () => {
  console.log(`Historical data visualization server is running on port ${PORT}\n`)
})

let routes = fs.readdirSync('./routes')
routes.forEach(routeStr => {
  let routeName = routeStr.slice(0, -3)
  let route = require('./routes/' + routeName)
  app.use('/' + routeName, route)
})
realTimeService.startSocket(SOCKET_PORT)
