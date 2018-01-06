const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const bodyParser = require("body-parser")

var dataBase

//Configure body parser as middle ware
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'}))

//set up root direcrtory
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})//post main page

//Method from front end that creates a new subdomain to post the stream on
app.post('/api/postStream',postStream)
function postStream(req,res){
    console.log("posting stream")
    const streamSubdomain=req.body.vidDomain //TODO this must be removed before public release

  //allow users to post stream to a front end specified domain
  //TODO this is only for testing purposes in the final version 
  //the user should not be able to create their own subdomain. It
  //should be randomly generated on the backend and then send to the user. (maybe use a hashing function)
  app.get(streamSubdomain, function(req, res) {
      res.sendFile(__dirname + '/publicStream.html')
  })
}

//Updates steam data on the database
app.post('/api/updateStream',updateStream)
function updateStream(req,res){
    dataBase = req.body.snapshotRawData
}


//Determine hosting port (leave at 3000)
http.listen((process.env.PORT || 3000), function(){
  console.log('listening on *:3000')
})

//post files in the public folder
app.use(express.static(__dirname+ '/public'))
