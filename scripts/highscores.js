MyGame.screens["high-scores"] = (function (game) {
  "use strict";
  let exitFn = (event) => {
    if (event.key === "Escape") {
      game.showScreen("main-menu");
    }
  };

  function initialize() {
    document
      .getElementById("id-high-scores-back")
      .addEventListener("click", function () {
        document.removeEventListener("keydown", exitFn);
        game.showScreen("main-menu");
      });
    document
      .getElementById("id-reset-high-scores")
      .addEventListener("click", function () {
        if (localStorage.highScores) {
          localStorage.highScores = JSON.stringify([]);
        }
        document.getElementById("id-high-scores-list").innerHTML = "";
      });
  }

  function run() {
    document.addEventListener("keydown", exitFn, { once: true });
    let list = document.getElementById("id-high-scores-list");
    list.innerHTML = "";
    if (!localStorage.highScores) return;
    let highScores = JSON.parse(localStorage.highScores);
    highScores.sort((a, b) => b.score - a.score);
    let iterationCount = highScores.length > 5 ? 5 : highScores.length;
    for (let i = 0; i < iterationCount; i++) {
      let li = document.createElement("li");
      let p = document.createElement("p");
      p.style = "--color:#ffffff";
      p.innerText =
        highScores[i].name +
        " - time: " +
        (parseFloat(highScores[i].time)/1000).toFixed(3) + " seconds";
      li.appendChild(p);
      list.appendChild(li);
    }
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.game);
