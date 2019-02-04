require('dotenv').config()

const http = require('http')
const cors = require('cors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const { PORT } = require('./config')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, './front/build/')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './front/build/', 'index.html'))
})

const server = http.createServer(app)
server.listen(PORT)
server.on('listening', () => {
  console.log('Web client is running on port ' + PORT)
})
