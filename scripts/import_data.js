const fs = require('fs')
const { SENSOR_SECRET_TOKEN  } = require('../config')
const csv = require('fast-csv')

let entry = []

let exit = []

fs.createReadStream('entrada.csv')
    .pipe(csv())
    .on('data', function(data){
        data[0] = Number(data[0])
        data[1] = Number(data[1])
        data[2] = Number(data[2])
        data[3] = Number(data[3])
        entry.push(data);
    })
    .on('end', function(){
        console.log(entry[2234]);
    });

fs.createReadStream('salida.csv')
    .pipe(csv())
    .on('data', function(data){
        data[0] = Number(data[0])
        data[1] = Number(data[1])
        data[2] = Number(data[2])
        data[3] = Number(data[3])
        exit.push(data);
    })
    .on('end', function(){
        console.log(exit[2234]);
    });

let events = [
    [1496925000,1496930700],
    [1431854100,1431869700],
    [1494859800,1494872100],
    [1494578400,1494605700] ]

const http = require('http')


  
  const options = {
    hostname: 'localhost',
    port: 4400,
    path: '/mesuarement',
    method: 'POST',
    headers: {
      'authorization': SENSOR_SECRET_TOKEN,
      'Content-Type':'application/json'
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  


  const postBody = (sensorId,value,timestamp) => {
    return querystring.stringify({
        'measurementType': 'level',
        'sensorId': sensorId,
        'value':  value,
        'timestamp': timestamp
      })
  } 
  // write data to request body
  req.write(postBody);
  req.end();