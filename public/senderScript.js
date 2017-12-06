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
    console.log('Sucess');
}


function onFail(message) {
    console.log('Error' + message);
}

function receiverMessage(namespace,message){
    console.log('message received')
    console.log(JSON.stringify(message))
}

function sendMedia(url) {
    console.log('sending media')
    
    var mediaInfo = new chrome.cast.media.MediaInfo(url)
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.contentType = 'video/mp4';
    mediaInfo.metadata.title = 'title';
    mediaInfo.metadata.images = [{'url':url}];
            
    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;
    request.currentTime = 0;
    session.loadMedia(request,onSuccess,onFail)
    //session.sendMessage(namespace,request)
}

getScreenId(function (error, sourceId, screen_constraints) {
        navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        navigator.getUserMedia(screen_constraints, function (stream) {
            var mediaURL = URL.createObjectURL(stream);
            // sendMedia(mediaURL);
            document.querySelector('video').src = URL.createObjectURL(stream);
        }, function (error) {
            console.error(error);
        });
    });


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

function grabMessage() {
    var message = document.getElementById("message-box");
    sendMessage(message.value);
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
