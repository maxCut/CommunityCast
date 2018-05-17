var streamRate = 10000//controls how frequently the stream is updated
var mediaURL = "" //used to make a screen capture of the users desktop. Data is stored in this blob:url
var webSocketConnection = null//current web socket to send data to
var chunkSize = 1000 //Max Packet Size used



//This function sends a screenshot of the passed video
function postVideoSnapshot(vid){
    //first get 2d context in raw data by posting video on canvas (this is realy memory intensive, there may be a better way)
    var canvas = document.createElement('canvas')
    canvas.height = vid.videoHeight
    canvas.width = vid.videoWidth
    canvas.height = 1000
    canvas.width = 1000
    var ctx = canvas.getContext('2d')
    ctx.drawImage(vid,0,0,canvas.width,canvas.height)
    var rawData = ctx.getImageData(0,0,canvas.width,canvas.height).data

    console.log('sending data')
    //webSocketConnection.send({snapshotRawData:JSON.stringify(rawData),streamID:"1"})
    //webSocketConnection.send(JSON.stringify(rawData))
    sendChunkedMessage(JSON.stringify(rawData))
    //$.post('/api/updateStream',{snapshotRawData:JSON.stringify(rawData),streamID:"1"},function(data){})
}

//Chunks up msg into packets to be sent via the web socket
function sendChunkedMessage(msg)
{
    msgLength = msg.length
    numChunks = msgLength/chunkSize
    
    //send the main chunks
    for (i = 0; i<numChunks-1;i++){
        webSocketConnection.send(msg.slice(i*chunkSize,(i+1)*chunkSize))
    }

    //send last bit of msg

    webSocketConnection.send(msg.slice(msgLength-msgLength%chunkSize,msgLength))
    webSocketConnection.send('')//lets server know that it is done recieving chunks
}

//Websocket handler
$(function () {
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  webSocketConnection = new WebSocket('ws://127.0.0.1:8080');

  webSocketConnection.onopen = function () {
	console.log('websocket open')
    // connection is opened and ready to use
  };

  webSocketConnection.onerror = function (error) {
	console.log('error')
    // an error occurred when sending/receiving data
  };
});



//This captures the users screen
getScreenId(function (error, sourceId, screen_constraints) {
        navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia
        navigator.getUserMedia(screen_constraints, function (stream) {
            mediaURL = URL.createObjectURL(stream)
            document.querySelector('video').src = URL.createObjectURL(stream)
            var vid = document.querySelector('video')

            setTimeout(function(){sendStream()},500)//begins stream function once screen is grabbed.
        }, function (error) {
            console.error(error)
        })
    })

//This is the update function for the users stream.
function streamFunction()
{
    postVideoSnapshot(document.querySelector('video'))
}

//This function will call the stream function repeatedly at intervals of streamRate milleseconds
function sendStream(){
    setInterval(streamFunction,streamRate)
}


