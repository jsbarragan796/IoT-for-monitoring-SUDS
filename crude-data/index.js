require('dotenv').config()

const rfs = require('rotating-file-stream')
const morgan = require('morgan')

const { LOG_DIRECTORY } = require('./config')

const pad = (num) => {
  return (num > 9 ? '' : '0') + num
}

const generator = (time, index) => {
  if (!time) return 'tmp.log'
  else {
    const year = time.getFullYear()
    const month = pad(time.getMonth() + 1)
    const day = pad(time.getDate())
    const hour = pad(time.getHours())
    const minute = pad(time.getMinutes())

    return `${year}/${month}/${year}-${month}-${day}-${hour}-${minute}_${index}.log`
  }
}

fs.existsSync(LOG_DIRECTORY) || fs.mkdirSync(LOG_DIRECTORY)
const accessLogStream = rfs(generator, {
  size: '10M',
  interval: '1d',
  initialRotation: true,
  rotationTime: true,
  path: LOG_DIRECTORY
})

app.use(morgan(':date[iso] :method :url :status - :response-time ms'))
app.use(morgan(':date[iso] :method :url :status - :response-time ms', { stream: accessLogStream }))

const routes = fs.readdirSync('./routes')
routes.forEach(routeStr => {
  const routeName = routeStr.slice(0, -3)
  const route = require('./routes/' + routeName)
  app.use('/' + routeName, route)
})
