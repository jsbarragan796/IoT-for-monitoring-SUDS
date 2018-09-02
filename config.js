const isDev = process.env.DEV

module.exports = {
  LOGGER_MODE: isDev ? 'dev' : 'prod',
  BACKEND_PORT: process.env.BACKEND_PORT
}
