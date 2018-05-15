socketURL = 'ws://127.0.0.1:8080'
$(function(){
    webSocketConnection = new WebSocket(socketURL)
    webSocketConnection.onopen = function (){
        console.log('websocket open')
        setInterval(function(){loadRequest(webSocketConnection)},500)
    }
    webSocketConnection.onmessage = function(message) {
    console.log(message.data)
    }

});

function loadRequest(connection)
{
    connection.send('load')
}
