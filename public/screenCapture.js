getChromeExtensionStatus(function(status) {
    if (status === 'installed-enabled') alert('installed');
    if (status === 'installed-disabled') alert('installed but disabled');
    // etc.
});

getScreenId(function (error, sourceId, screen_constraints) {
    // error    == null || 'permission-denied' || 'not-installed' || 'installed-disabled' || 'not-chrome'
    // sourceId == null || 'string' || 'firefox'

    if(error == 'not-installed') {
      alert('Please install Chrome extension.');
      return;
    }

    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia(screen_constraints, function (stream) {
        document.querySelector('video').src = URL.createObjectURL(stream);

        // share this "MediaStream" object using RTCPeerConnection API
    }, function (error) {
      console.error('getScreenId error', error);

      alert('Failed to capture your screen. Please check Chrome console logs for further information.');
    });
});