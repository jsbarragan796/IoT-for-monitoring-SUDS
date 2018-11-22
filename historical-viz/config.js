const isDev = !!process.env.DEV

module.exports = {
  PORT: process.env.PORT,

  INFLUX_DB_URL: isDev ? process.env.INFLUX_DB_URL_DEV : process.env.INFLUX_DB_URL,
  INFLUX_DB_DATABASE: isDev ? process.env.INFLUX_DB_DATABASE_DEV : process.env.INFLUX_DB_DATABASE,
  INFLUX_DB_HOST: isDev ? process.env.INFLUX_DB_HOST_DEV : process.env.INFLUX_DB_HOST,
  INFLUX_DB_PORT: isDev ? process.env.INFLUX_DB_PORT_DEV : process.env.INFLUX_DB_PORT,
  INFLUX_DB_USERNAME: isDev ? process.env.INFLUX_DB_USERNAME_DEV : process.env.INFLUX_DB_USERNAME,
  INFLUX_DB_PASSWORD: isDev ? process.env.INFLUX_DB_PASSWORD_DEV : process.env.INFLUX_DB_PASSWORD,
  INFLUX_DB_PROTOCOL: isDev ? process.env.INFLUX_DB_PROTOCOL_DEV : process.env.INFLUX_DB_PROTOCOL,

  PUBLIC_PATH: process.env.PUBLIC_PATH,

  PORT: process.env.PORT,

  MONGODB_URI: isDev ? process.env.MONGODB_URI : process.env.MONGODB_URI_Dev,

  SENSOR_SECRET_TOKEN: process.env.SENSOR_SECRET_TOKEN,
  
  QUERY_MUST_HAVE_MEASUREMENT_TYPE: 'Debe especificar el tipo de medición',
  QUERY_MUST_HAVE_FUNCTION_AND_TIME_RANGE: 'Debe especificar función e intervalos de agrupamiento'
}
