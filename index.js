//Dependencies
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const http = require('http')
const bodyParser = require("body-parser")
/*
const WebSocketServer = require('websocket').server

var buffer  = ""
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

var ws = new WebSocketServer({httpServer:server})

ws.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event
  console.log((new Date()) + ' Connection accepted.');

  //Handle recieving messages
  connection.on('message',function(message){
      console.log('message recieved')
      console.log(message.length)
      if(message.utf8Data == ''){
          dataBase = buffer
          buffer = ''
          console.log(dataBase)
      }
      else{
          buffer+=message.utf8Data
      }
  });
});
*/
//The above is commented out for the demo. Uncomment to continue with websockets
var dataBase = ""
//var dataBase = new Map()//temp hashmap until mongodb is set up. TODO replace this

//Configure body parser as middle ware
app.use(bodyParser.urlencoded({extended: true, limit: '500mb'}))
app.use(bodyParser.json({limit: '500mb'}))

//set up root direcrtory
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})//post main page

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
http.Server(app).listen((process.env.PORT || 3000), function(){
  console.log('listening on *:3000')
})

//post files in the public folder
app.use(express.static(__dirname+ '/public'))
