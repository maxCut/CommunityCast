//var appID = "794B7BBF";
var appID = "C8E098E5";
var namespace = 'urn:x-cast:communitycast' //this needs to be changed to ours but i want to double check that this is not the issue 
var session = null;

if (!chrome.cast || !chrome.cast.isAvailable) {
    setTimeout(initializeCastApi, 1000);
}

function initializeCastApi(){
    var sessionRequest = new chrome.cast.SessionRequest(appID);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,sessionListener,receiverListener);

    chrome.cast.initialize(apiConfig,onSuccess,onFail);
}

function onSuccess() {
    console.log('woooohooooo');
}


function onFail(message) {
    console.log(':( ... failed to connect');
}

function receiverMessage(namespace,message){
    console.log('message received')
    console.log(JSON.stringify(message))
}

function sessionListener(e) {
        console.log('New session ID:' + e.sessionId);
        session = e;
        session.addUpdateListener(sessionUpdateListener);
        session.addMessageListener(namespace, receiverMessage);
}


function receiverListener(e) {
	if(e === 'available') {
          console.log('receiver found');
        }
        else {
          console.log('receiver list empty');
        }
}

function sessionUpdateListener(state){
    console.log("session updated")
    if(!state){
        session=null
    }

}

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
