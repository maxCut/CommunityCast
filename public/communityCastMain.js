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
      };
      // utility function to display the text message in the input field
      function displayText(text) {
        console.log(text);
        document.getElementById('message').innerText = text;
        window.castReceiverManager.setApplicationState(text);
      };

