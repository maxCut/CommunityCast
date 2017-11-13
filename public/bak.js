var cast = cast || {}; cast.games = cast.games || {};
cast.games.common = {};
cast.games.common.receiver = {};
cast.games.common.receiver.Game = function() {
};
cast.games.communitycast = {};
cast.games.communitycast.CommunitycastMessageType = {UNKNOWN:0, SPRITE:1};
cast.games.communitycast.CommunitycastMessage = function() {
  this.type = cast.games.communitycast.CommunitycastMessageType.UNKNOWN;
};

cast.games.communitycast = {};
cast.games.communitycast.CommunitycastMessageType = {UNKNOWN:0, SPRITE:1};

cast.games.communitycast.CommunitycastGame = function(gameManager) {
  this.gameManager_ = gameManager;
};

var game = null;

var initialize = function() {
  var castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  var appConfig = new cast.receiver.CastReceiverManager.Config();

  appConfig.statusText = 'Communitycast';
  // In production, use the default maxInactivity instead of using this.
  appConfig.maxInactivity = 6000;

  // Create the game before starting castReceiverManager to make sure any extra
  // cast namespaces can be set up.
  /** @suppress {missingRequire} */
  var gameConfig = new cast.receiver.games.GameManagerConfig();
  gameConfig.applicationName = 'Communitycast';
  gameConfig.maxPlayers = 10;

  /** @suppress {missingRequire} */
  var gameManager = new cast.receiver.games.GameManager(gameConfig);

  /** @suppress {missingRequire} */
  game = new cast.games.communitycast.CommunitycastGame(gameManager);

  var startGame = function() {
    game.run(function() {
      console.log('Game running.');
      gameManager.updateGameStatusText('Game running.');
    });
  };

  castReceiverManager.onReady = function(event) {
    if (document.readyState === 'complete') {
      startGame();
    } else {
      window.onload = startGame;
    }
  };
  castReceiverManager.start(appConfig);
};

if (document.readyState === 'complete') {
  initialize();
} else {
  /** Main entry point. */
  window.onload = initialize;
}
