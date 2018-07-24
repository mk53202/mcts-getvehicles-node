// Libraries
const config = require('dotenv').config(); // For API key .env
const request = require('request-promise')
const parseXML = require('xml2js').parseString
const express = require('express')

// Globals
const BUSTIME_URL = 'http://realtime.ridemcts.com/bustime/api/v1/getvehicles'
const BUSTIME_API_KEY = process.env.BUSTIME_API_KEY // Get unique key and store it in .env
const SERVER_PORT = 7300
const bus_route = 'GRE'
const bus_direction = 'NORTH'

const app = express()

app.get('/', function (req, res) {
  getVehicles( function(my_results) {
    res.send(JSON.stringify(my_results))
  });
})

app.listen(SERVER_PORT, function() {
  console.log('Example app listening on port {SERVER_PORT}')
});

// Format and options for the request
var request_options = {
  method: 'GET',
  uri: BUSTIME_URL,
  qs: {
    key: BUSTIME_API_KEY,
    rt: bus_route,
    dir: bus_direction
  },
  headers: {
    'cache-control': 'no-cache'
  },
  json: false // the response comes back as xml not json, see below
}

function getVehicles( callback ) {
  request( request_options )
    .then(function (response) {  // Request was successful
      parseXML(response, function (err, result) { // from xml2js
        var json_result = result['bustime-response']
        callback( json_result )
      })
    })
    .catch(function (err) {
      console.log( err ) // Something bad happened, handle the error
    })
}
