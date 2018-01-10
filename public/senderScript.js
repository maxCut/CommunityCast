var appID = "C8E098E5"//app id. corosponds to registered google cast application
var namespace = 'urn:x-cast:communitycast' //urn used for messaging protocol
var session = null //current cast session variable
var streamRate = 10//controls how frequently the stream is updated
var mediaURL = "" //used to make a screen capture of the users desktop. Data is stored in this blob:url

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

//this function sends media urls
function sendMedia(url) {
    console.log('sending media')
    
    var mediaInfo = new chrome.cast.media.MediaInfo(url)
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata()
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC
    mediaInfo.contentType = 'video/mp4'
    mediaInfo.metadata.title = 'title'
    mediaInfo.metadata.images = [{'url':url}]
            
    var request = new chrome.cast.media.LoadRequest(mediaInfo)
    request.autoplay = true
    request.currentTime = 0
    session.loadMedia(request,onSuccess,onFail)
    //session.sendMessage(namespace,request)
}

//This function posts a snapshot of the passed element to the server and hosts in a subdomain
function postVideoSnapshot(vid){
    //first get 2d context in raw data by posting video on canvas (this is realy memory intensive, there may be a better way)
    var canvas = document.createElement('canvas')
    canvas.height = vid.videoHeight
    canvas.width = vid.videoWidth
    canvas.height = 100
    canvas.width = 100
    var ctx = canvas.getContext('2d')
    ctx.drawImage(vid,0,0,canvas.width,canvas.height)
    var rawData = ctx.getImageData(0,0,canvas.width,canvas.height).data
    console.log("raw data: ")
    console.log(rawData)
    //$.post('/api/postStream',vid)
    //$.post('/api/postStream',{vid:"hello world",vidDomain:"/test"},function(data){})
    $.post('/api/updateStream',{snapshotRawData:JSON.stringify(rawData),vidDomain:"/test"},function(data){})
    $.post('/api/postStream',{vidDomain:"/test"},function(data){})
}

//This captures the users screen
getScreenId(function (error, sourceId, screen_constraints) {
        navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia
        navigator.getUserMedia(screen_constraints, function (stream) {
            mediaURL = URL.createObjectURL(stream)
            document.querySelector('video').src = URL.createObjectURL(stream)
            var vid = document.querySelector('video')

            //TODO all the lines from here until the next TODO are for testing development. Should be removed later
            console.log(document.querySelector('video').src)
            console.log("here")
            console.log(vid.videoHeight)
            setTimeout(function(){console.log(vid.videoHeight)},500)
            //$.post("/api/hello",function(data){})
            //$.post("/api/postStream",function(data){})
            //postVideoSnapshot(document.querySelector('video'))
            setTimeout(function(){postVideoSnapshot(document.querySelector('video'))},500)
            //TODO

        }, function (error) {
            console.error(error)
        })
    })

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

//This is the update function for the users stream.
function streamFunction()
{
    packet = "swooohoo"
    sendMessage(packet)
}

//This function will call the stream function repeatedly at intervals of streamRate milleseconds
function sendStream(){
    setInterval(streamFunction,streamRate)
}


