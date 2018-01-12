//Dependencies
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const bodyParser = require("body-parser")

var dataBase
//var dataBase = new Map()//temp hashmap until mongodb is set up. TODO replace this

//Configure body parser as middle ware
app.use(bodyParser.urlencoded({extended: true, limit: '500mb'}))
app.use(bodyParser.json({limit: '500mb'}))

//set up root direcrtory
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})//post main page

//Updates steam data on the database TODO make this a put request
app.put('/api/updateStream',updateStream)
function updateStream(req,res){
    console.log("here")
    //dataBase.set(req.body.streamID,
    //        req.body.snapshotRawData)
    dataBase = req.body.snapshotRawData
}

//Allows data retreival
app.get('/api/dataStream/:streamID', function(req, res) {
    res.send(dataBase)
    //res.send(JSON.parse(dataBase.get(req.params.streamID)))
})


//Determine hosting port (leave at 3000)
http.listen((process.env.PORT || 3000), function(){
  console.log('listening on *:3000')
})

//post files in the public folder
app.use(express.static(__dirname+ '/public'))
