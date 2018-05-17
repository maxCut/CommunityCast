//Dependencies
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const http = require('http')
const bodyParser = require("body-parser")
const WebSocketServer = require('websocket').server

const chunkSize = 1000

var buffer  = "" //handles temporary state of incomplete file chunks
var dataBase = ""//most recent full set of file chunks

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

var ws = new WebSocketServer({httpServer:server})

function chunkMessage(connection,msg){
    msgLength = msg.length
    numChunks = msgLength/chunkSize

    //send main chunks
    for (i = 0; i< numChunks-1;i++){
        connection.send(msg.slice(i*chunkSize,(i+1)*chunkSize))
    }
    //last bit of msg
    connection.send(msg.slice(msgLength-msgLength%chunkSize,msgLength))
    connection.send('end')    // lets the reciever know that this is the last message

}

ws.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');
  var connection = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event
  console.log((new Date()) + ' Connection accepted.');

  //Handle recieving messages
  connection.on('message',function(message){
      if(message.utf8Data == 'end'){
          dataBase = buffer
          buffer = ''
          console.log(dataBase)
      }
      else if (message.utf8Data == 'load')
      {
          chunkMessage(connection,dataBase)
          //connection.send(dataBase)
          //connection.sendUTF(dataBase)
      }
      else{
          buffer+=message.utf8Data
      }
  });
});

//Configure body parser as middle ware
app.use(bodyParser.urlencoded({extended: true, limit: '500mb'}))
app.use(bodyParser.json({limit: '500mb'}))

//set up root direcrtory
app.get('/', function(req, res){
    res.sendFile(__dirname + '/CommunityCastSender/index.html')
})//post sender page

app.get('/reciever', function(req, res){
    res.sendFile(__dirname + '/CommunityCastReciever/index.html')
    //res.sendFile(__dirname + '/publicStream.html')
})//post reciever page

//Determine hosting port (leave at 3000)
http.Server(app).listen((process.env.PORT || 3000), function(){
  console.log('listening on *:3000')
})

//post files in the public folders
app.use(express.static(__dirname+ '/CommunityCastSender/public'))
app.use(express.static(__dirname+ '/CommunityCastReciever/public'))
