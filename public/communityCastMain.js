window.onload = function() {
        cast.receiver.logger.setLevelValue(0);
        window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        console.log('Starting Session');
        // handler for the 'ready' event
        castReceiverManager.onReady = function(event) {
          console.log('Session Ready');
          window.castReceiverManager.setApplicationState('Community Cast Enabled');
        };
        // handler for 'senderconnected' event
        castReceiverManager.onSenderConnected = function(event) {
          console.log('Sender Connected');
        };
        // handler for 'senderdisconnected' event
        castReceiverManager.onSenderDisconnected = function(event) {
          console.log('Sender Disconnected');
          if (window.castReceiverManager.getSenders().length == 0) {
            window.close();
          }
        };
        
	//Messaging Protocol
	window.messageBus =
          window.castReceiverManager.getCastMessageBus('urn:x-cast:communitycast');
        // handler for the CastMessageBus message event
        window.messageBus.onMessage = function(event) {
          console.log('From : ' + event.senderId + " message is : " + event.data);
          // display the message from the sender
          displayText(event.data);
          // inform all senders of the incoming message
          // sender message listener will be invoked
          window.messageBus.broadcast("from : " + event.senderId + " message is : " + event.data);
        }

    //Media Protocol

    window.mediaElement = document.getElementById('vid');
    window.mediaManager = new cast.receiver.MediaManager(window.mediaElement);
    
    window.mediaManager.onLoad = function(event){
        console.log("received video");
        window.messageBus.broadcast("received video");
        data = event.data.media.customData;
        window.messageBus.broadcast(data);
    };
    //starting text display on cast menu
        window.castReceiverManager.start({statusText: 'Application is starting'});
        console.log('Receiver Manager started');
        };

    //This function will modify the text on the receiver to be the message it received
      function displayText(text) {
        console.log(text);
        document.getElementById('message').innerText = text+"\n"+document.getElementById('message').innerText;
        window.castReceiverManager.setApplicationState(text);
      };

