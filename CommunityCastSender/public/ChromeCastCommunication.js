var appID = "C8E098E5"//app id. corosponds to registered google cast application
var namespace = 'urn:x-cast:communitycast' //urn used for messaging protocol
var session = null //current cast session variable

//Sets timeout to connect to chromecast if it can't find a chromecast now
if (!chrome.cast || !chrome.cast.isAvailable) {
    setTimeout(initializeCastApi, 1000)
}

//connects to chromecast
function initializeCastApi(){
    var sessionRequest = new chrome.cast.SessionRequest(appID)
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,sessionListener,receiverListener)

    chrome.cast.initialize(apiConfig,onSuccess,onFail)
}

//General sucess event handler
function onSuccess() {
    console.log('Sucess')
}

//General error handler
function onFail(message) {
    console.log('Error' + message)
}

//General cast message received handler
function receiverMessage(namespace,message){
    console.log('message received')
    console.log(JSON.stringify(message))
}

//Sends the value of the message box to the receiver
function grabMessage() {
    var message = document.getElementById("message-box")
    sendMessage(message.value)
}

//Sends messages to cast receiver
function sendMessage(message){
    if(session!=null)
    {
        session.sendMessage(namespace,message)
        console.log('message sent')
    }
    else
    {
        console.log('not connected to a session!')
    }
}


//Session handler for cast communication
function sessionListener(e) {
        console.log('New session ID:' + e.sessionId)
        session = e
        session.addUpdateListener(sessionUpdateListener)
        session.addMessageListener(namespace, receiverMessage)
}

//Logger function checks if receivers are available
function receiverListener(e) {
	if(e === 'available') {
          console.log('receiver found')
        }
        else {
          console.log('receiver list empty')
        }
}

//Handles session updates
function sessionUpdateListener(state){
    console.log("session updated")
    if(!state){
        session=null
    }

}
