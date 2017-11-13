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
        
        // initialize the CastReceiverManager with an application status message
        window.castReceiverManager.start({statusText: 'Application is starting'});
        console.log('Receiver Manager started');

 	window.messageBus =
          window.castReceiverManager.getCastMessageBus(
              'urn:x-cast:com.google.cast.sample.helloworld');

        // handler for the CastMessageBus message event
        window.messageBus.onMessage = function(event) {
          console.log('Message [' + event.senderId + ']: ' + event.data);
          // display the message from the sender
          displayText(event.data);
          // inform all senders on the CastMessageBus of the incoming message event
          // sender message listener will be invoked
          window.messageBus.send(event.senderId, event.data);
        }

	//starting
        window.castReceiverManager.start({statusText: 'Application is starting'});
      };
      // utility function to display the text message in the input field
      function displayText(text) {
        console.log(text);
        document.getElementById('message').innerText = text;
        window.castReceiverManager.setApplicationState(text);
      };

