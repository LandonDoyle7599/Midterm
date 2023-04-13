MyGame.screens["main-menu"] = (function (game) {
  "use strict";

  function initialize() {
    document
      .getElementById("id-new-game")
      .addEventListener("click", function () {
        game.newGame();
        game.showScreen("game-play");
      });

    document
      .getElementById("id-high-scores")
      .addEventListener("click", function () {
        game.showScreen("high-scores");
      });

    document
      .getElementById("id-credits")
      .addEventListener("click", function () {
        game.showScreen("credits");
      });
    document
    .getElementById("id-breakout")
    .addEventListener("click", function () {
      window.location.replace("https://landondoyle7599.github.io/Breakout/");
    });

  }

  function run() {
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.game);
