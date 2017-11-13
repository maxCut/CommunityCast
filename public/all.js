var cast = {games:{}};
cast.games.common = {};
cast.games.common.sender = {};
cast.games.common.sender.setup = function(appId, sessionCallback) {
  console.log("### Preparing session request and cast sender API config with app ID " + appId);
  var sessionRequest = new chrome.cast.SessionRequest(appId), apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionCallback, cast.games.common.sender.setup.onCastReceiverChanged_);
  console.log("### Initializing cast sender API and requesting a session.");
  chrome.cast.initialize(apiConfig, cast.games.common.sender.setup.onCastInit_, cast.games.common.sender.setup.onCastError_);
};

cast.games.spritedemo = {};
cast.games.spritedemo.SpritedemoMessageType = {UNKNOWN:0, SPRITE:1};
cast.games.spritedemo.SpritedemoMessage = function() {
  this.type = cast.games.spritedemo.SpritedemoMessageType.UNKNOWN;
};
var gameManagerClient = null;
window.__onGCastApiAvailable = function(loaded, errorInfo) {
  loaded ? cast.games.common.sender.setup("D6120C32", onSessionReady_) : (console.error("### Cast Sender SDK failed to load:"), console.dir(errorInfo));
};
var onSessionReady_ = function(session) {
  console.log("### Creating game manager client.");
  chrome.cast.games.GameManagerClient.getInstanceFor(session, function(result) {
  }, function(error) {
    console.error("### Error initializing the game manager client :( : " + error.errorDescription + " Error code: " + error.errorCode);
  });
};
