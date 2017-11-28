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
    window.mediaSource = new MediaSource();
    window.mediaElement.src = window.URL.createObjectURL(window.mediaSource);
    window.videoQueue = null;

    /**
     * Loads the video and kicks off the processing.
     */
    window.mediaSource.addEventListener('sourceopen', function(){
      window.sourceBuffer = window.mediaSource.addSourceBuffer(
          'video/mp4; codecs="avc1.42c01e"');
    });

    function onLoad(arrayBuffer) {
      console.log("onLoad");
      if (!arrayBuffer) {
        window.mediaElement.src = null;
        return;
      }
      window.videoQueue = new Uint8Array(arrayBuffer);
      window.sourceBuffer.appendBuffer(window.videoQueue);
      console.log("loading media")
      processNextSegment();
    }
    /**
     * Processes the next video segment for the video.
     */
    function processNextSegment() {
      console.log("processing")
      // Wait for the source buffer to be updated
      if (!window.sourceBuffer.updating && window.sourceBuffer.buffered.length > 0) {
          // Only push a new fragment if we are not updating and we have
          // less than 10 seconds in the pipeline
          if (window.sourceBuffer.buffered.end(window.sourceBuffer.buffered.length - 1) - window.video.currentTime < 10) {
            // Append the video segments and adjust the timestamp offset forward
            window.sourceBuffer.timestampOffset = window.sourceBuffer.buffered.end(this.sourceBuffer.buffered.length - 1);
            window.sourceBuffer.appendBuffer(window.allSegments);
          }
          // Start playing the video
          if (window.video.paused) {
            window.video.play();
          }
      }
      setTimeout(processNextSegment, 1000);
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

