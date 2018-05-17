var socketURL = location.origin.replace(/^http/,'ws')//may need to handle case of https
//socketURL = 'ws://127.0.0.1:3000'
$(function(){
    webSocketConnection = new WebSocket(socketURL)
    webSocketConnection.onopen = function (){
        console.log('websocket open')
        setInterval(function(){loadRequest(webSocketConnection)},500)
    }
    //Handle recieving chunked messages
    buffer = '' 
    webSocketConnection.onmessage = function(message) {
    if(message.data== 'end')//end message char
    {
        if(buffer!='')
        {
            postVideo(buffer)
            buffer = ''
        }
        else
        {
            //null message (do nothing)
        }
    }
    else
    {
        buffer+=message.data
    }

    }

});

function loadRequest(connection)
{
    connection.send('load')
}

function postVideo(vidData)
{
    var vidCanvas = document.getElementById('vid')
    var ctx = vidCanvas.getContext('2d')     
    var parsed = JSON.parse(vidData)

    var dataArray = new Uint8ClampedArray($.map(parsed, function(el) { return el }))

    console.log("parsed")
    console.log(parsed)
    
    var imageData = new ImageData(dataArray,100,100)
    ctx.putImageData(imageData,0,0) //draw frame data on vid element
}

