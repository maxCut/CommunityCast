'use strict';
//The interface that the sender applications will communicate with
var communityInterface = null;

var initialize = function() {
  var castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  var appConfig = new cast.receiver.CastReceiverManager.Config();

  appConfig.statusText = 'CommunityCast';
  // In production, use the default maxInactivity instead of using this.
  appConfig.maxInactivity = 6000;

  // Create the game before starting castReceiverManager to make sure any extra
  // cast namespaces can be set up.
  /** @suppress {missingRequire} */
  var gameConfig = new cast.receiver.games.GameManagerConfig();
  gameConfig.applicationName = 'CommunityCast';
  gameConfig.maxPlayers = 10;
  castReceiverManager.start(appConfig);
  game.run(function() {
    console.log('cast running.');
  });
};
