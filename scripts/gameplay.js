MyGame.screens["game-play"] = (function (game, input) {
  "use strict";

  let lastTimeStamp = performance.now();
  let cancelNextRequest = true;

  let myKeyboard = input.Keyboard();

  function processInput(elapsedTime) {
    myKeyboard.update(elapsedTime);
  }

  function update(elapsedTime) {
    if(!game.gameOver()) {
    game.updatePlatforms(elapsedTime);
    game.checkCollisions();
    }
    game.updateParticles(elapsedTime);
  }

  function render() {
    MyGame.graphics.clear();
    MyGame.graphics.drawTexture(leftBackground.texture);
    MyGame.graphics.drawTexture(rightBackground.texture);
    MyGame.graphics.drawTexture(centerBackground.texture);
    MyGame.graphics.drawPlatforms(game.platforms());
    MyGame.graphics.drawPlatforms(game.nextPlatform());
    game.renderParticles(particleTexture);
    if(!game.gameOver()) {
      MyGame.graphics.drawText(createTimerSpec());
      MyGame.graphics.drawBlock(game.block());
    }else{
      MyGame.graphics.drawText(createGameOverSpec());
      MyGame.graphics.drawText(finalTimeSpec())
      MyGame.graphics.drawText(returnToMenuSpec())
    }
  }

  function gameLoop(time) {
    if (!cancelNextRequest) {
      requestAnimationFrame(gameLoop);
    }
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;
    processInput(elapsedTime);
    update(elapsedTime);
    render();
  }

  function initialize() {
    myKeyboard.register("Escape", function () {
      cancelNextRequest = true;

      if (game.gameOver()) {
        let nameInput = document.getElementById("id-name");
        nameInput.focus();
        nameInput.select();
        document
          .getElementById("id-submit")
          .addEventListener("click", function () {
            game.logScore(game.time(), nameInput.value);
            nameInput.value = "";
            document.getElementById("winner-window").style.display = "none";
            cancelNextRequest = true;
            game.showScreen("main-menu");
          });
        document.getElementById("winner-window").style.display = "block";
      } else {
        document
          .getElementById("id-yes")
          .addEventListener("click", function () {
            cancelNextRequest = true;
            document.getElementById("escape-window").style.display = "none";
            game.showScreen("main-menu");
          });
        document.getElementById("id-no").addEventListener("click", function () {
          document.getElementById("escape-window").style.display = "none";
          cancelNextRequest = false;
          lastTimeStamp = performance.now();
          gameLoop(performance.now());
        });
        document.getElementById("escape-window").style.display = "block";
      }
    });
  }

  function run() {
    lastTimeStamp = performance.now();
    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  function defineTexture(spec) {
    let that = {};
    spec.image = new Image();
    spec.image.ready = false;
    spec.image.onload = function () {
      this.ready = true;
    };
    spec.image.src = spec.imageSrc;
    that.texture = spec;
    return that;
  }


  function createTimerSpec() {
    return {
      font: "bold 24px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: 760,
        y: 40,
      },
      rotation: 0,
      text: `Time: ${(game.time()/1000).toFixed(3)}`,
    };
  }
  function createGameOverSpec() {
    return {
      font: "bold 80px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: MyGame.graphics.getTextWidth("Game Over", "bold 80px Poppins"),
        y: 350,
      },
      rotation: 0,
      text: "Game Over",
    };
  }
  function finalTimeSpec() {
    return {
      font: "bold 40px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: MyGame.graphics.getTextWidth(`Time: ${(game.time()/1000).toFixed(3)}`, "bold 40px Poppins"),
        y: 450,
      },
      rotation: 0,
      text: `Time: ${(game.time()/1000).toFixed(3)}`,
    };
  }
  function returnToMenuSpec() {
    return {
      font: "bold 40px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: MyGame.graphics.getTextWidth("Press Escape to Return to Menu", "bold 40px Poppins"),
        y: 510,
      },
      rotation: 0,
      text: "Press Escape to Return to Menu",
    };
  }

  myKeyboard.register("ArrowLeft", game.block().moveLeft);
  myKeyboard.register("ArrowRight", game.block().moveRight);

  let leftBackground = defineTexture({
    imageSrc: "assets/background-left.png",
    center: { x: 125, y: 500 },
    width: 250,
    height: 1000,
  });
  let rightBackground = defineTexture({
    imageSrc: "assets/background-right.png",
    center: { x: 875, y: 500 },
    width: 250,
    height: 1000,
  });
  let centerBackground = defineTexture({
    imageSrc: "assets/background-center.jpg",
    center: { x: 500, y: 500 },
    width: 500,
    height: 1000,
  });
  let particleTexture = defineTexture({
    imageSrc: "assets/particle.png",
    center: { x: 500, y: 500 },
    size: 1,
    rotation: 0
  });

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.game, MyGame.input);
