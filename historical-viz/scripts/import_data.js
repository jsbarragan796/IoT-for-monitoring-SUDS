require('dotenv').config()
const fs = require('fs')
const { SENSOR_SECRET_TOKEN } = require('../config')
const csv = require('fast-csv')
const http = require('http')
const fileNames = ['entrada', 'salida']

const getDataFromFile = (fileName) => {
  return new Promise((resolve, reject) => {
    let allData = []
    fs.createReadStream(`${fileName}.csv`)
      .pipe(csv())
      .on('data', function (data) {
        data[0] = Number(data[0])
        data[1] = Number(data[1])
        data[2] = Number(data[2])
        data[3] = Number(data[3])
        data[4] = fileName
        allData.push(data)
      })
      .on('end', function () {
        resolve(allData)
      })
      .on('error', (e) => {
        reject(e)
      })
  })
}
// // [inicio, fin, ajuste Entrada, ajuste salida  ]
// const events = [
//     [1494578400,1494605700, 0.95 , 0.4],
//     [1494857340,1494929940, 0.95, 0.45 ],
//     [1495012500,1495029000, 1, 1.35],
//     [1496922300,1496965500, 0.32 , 1.33]
//     ]
// [inicio, fin, ajuste Entrada, ajuste salida  ]
const events = [
  [1494578400, 1494605700, 0.95, 0.4]
]

const future = 31536000

const postOptions = {
  hostname: 'localhost',
  port: 4400,
  path: '/measurement',
  method: 'POST',
  headers: {
    'authorization': SENSOR_SECRET_TOKEN,
    'Content-Type': 'application/json'
  }
}

const postData = (body) => {
  return new Promise((resolve, reject) => {
    const req = http.request(postOptions, (res) => {
      res.setEncoding('utf8')
    })
    req.on('error', (e) => {
      console.error(`problem with post request: ${e.message}`)
      reject(e.message)
    })
    req.on('response', (e) => {
      // console.log("Status Code",e.statusCode);
      resolve(e.statusCode)
    })
    req.write(body)
    req.end()
  })
}

const buildPostBody = (sensorId, value, timestamp) => {
  return JSON.stringify({
    'measurementType': 'level',
    'sensorId': sensorId,
    'value': value,
    'timestamp': timestamp + future
  })
}

const postEventData = async (event) => {
  let entry = await getDataFromFile(fileNames[0])
  let exit = await getDataFromFile(fileNames[1])

  let entryEventData = entry.filter((row) => {
    return (row[0] >= event[0] && row[0] <= event[1])
  })
  let exitEventData = exit.filter((row) => {
    return (row[0] >= event[0] && row[0] <= event[1])
  })

  entryEventData = entryEventData.map((row) => {
    row[3] = row[3] * event[2]
    return row
  })

  exitEventData = exitEventData.map((row) => {
    row[3] = row[3] * event[3]
    return row
  })

  let allData = entryEventData.concat(exitEventData).sort((a, b) => {
    if (a[0] < b[0]) {
      return -1
    } else if (a[0] > b[0]) {
      return 1
    } else {
      return 0
    }
  })

  for (let index = 0; index < Math.ceil(allData.length / 8); index++) {
    const row = allData[index]
    // row[4] sensorId
    // row[3] value
    // row[0] +18000 to convert to UTC (input data is in colombian time)
    const body = buildPostBody(row[4], row[3], row[0] + 18000)
    await postData(body)
  }
}

const loadEvents = async () => {
  for (let index = 0; index < events.length; index++) {
    const event = events[index]
    await postEventData(event).catch((e) => {})
    console.log('Termino evento')
  }
}
loadEvents()
