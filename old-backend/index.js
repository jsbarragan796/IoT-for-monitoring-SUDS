
require('dotenv').config()

const http = require('http')
const cors = require('cors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs')

const { BACKEND_PORT, PUBLIC_PATH } = require('./config')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

const server = http.createServer(app)
server.listen(BACKEND_PORT)
server.on('listening', () => {
  console.log('Server is running on port ' + BACKEND_PORT)
})

let routes = fs.readdirSync('./routes')
routes.forEach(routeStr => {
  let routeName = routeStr.slice(0, -3)
  let route = require('./routes/' + routeName)
  app.use('/' + routeName, route)
})

app.use(express.static(path.join(__dirname, PUBLIC_PATH)))
app.get('*', function (req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, PUBLIC_PATH)})
})

// const { sendNewRainEventStartedAlert } = require('./functions')
// sendNewRainEventStartedAlert('+573138296275')
