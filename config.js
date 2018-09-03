const isDev = process.env.DEV

module.exports = {
  LOGGER_MODE: isDev ? 'dev' : 'prod',
  BACKEND_PORT: process.env.BACKEND_PORT,
  INFLUX_DB_URL: isDev ? process.env.INFLUX_DB_URL_DEV : process.env.INFLUX_DB_URL,
  PUBLIC_PATH: process.env.PUBLIC_PATH,

  QUERY_MUST_HAVE_MEASUREMENT_TYPE: 'Debe especificar el tipo de medición'
}
