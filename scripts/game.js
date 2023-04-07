MyGame.game = (function (screens, systems, graphics, render) {
  "use strict";
  let time = 0;
  let gameOver = false;
  let platformCount = 1;

  let block = defineBlock({
    center: { x: 500, y: 1000 },
    width: 30,
    height: 30,
    outlineColor: "rgba(0,0,255,1)",
    fillColor: "rgba(255,255,255,1)",
    moveRate: .4,
    rotation: 0,
  });

  let particleRenderers = [];
  let particleSystems = [];

  let platforms = [];

  let nextPlatform = {
    outlineColor: "rgba(0,0,255,1)",
    fillColor: "rgba(255,0,255,1)",
    center: { x: 500, y: 25 },
    gap: { leftSide: 450, rightSide: 550 },
    speed: 0.15,
    width: 500,
    height: 30,
  };

  function randomizeNextPlatform() {
    //generate the next gap for nextPlatform
    let leftSide = nextPlatform.gap.leftSide;
    let rightSide = nextPlatform.gap.rightSide;
    while(leftSide === nextPlatform.gap.leftSide && rightSide === nextPlatform.gap.rightSide || Math.abs(nextPlatform.gap.leftSide - leftSide) < 15 || Math.abs(nextPlatform.gap.leftSide - leftSide) > 75){
    let diff = Random.nextRange(15, 75);
    let leftOrRight = Math.random();
    if (leftOrRight >= 0.5) {
      leftSide += diff;
      rightSide += diff;
    } else {
      leftSide -= diff;
      rightSide -= diff;
    }
    if (leftSide < 260) {
      leftSide = 260;
      rightSide = 360;
    }
    if (rightSide > 740) {
      rightSide = 740;
      leftSide = 640;
    }
  }
    nextPlatform.gap.leftSide = leftSide;
    nextPlatform.gap.rightSide = rightSide;
  }

  function defineBlock(spec) {
    function moveLeft(elapsedTime) {
      if (spec.center.x - spec.width / 2 > 250) {
        spec.center.x -= spec.moveRate * elapsedTime;
      }
      if (spec.center.x < 275) {
        spec.center.x = 265;
      }
    }
    function moveRight(elapsedTime) {
      if (spec.center.x + spec.width / 2 < 750) {
        spec.center.x += spec.moveRate * elapsedTime;
      }
      if (spec.center.x > 725) {
        spec.center.x = 735;
      }
    }
    spec.moveLeft = moveLeft;
    spec.moveRight = moveRight;

    return spec;
  }

  function initializeBlock() {
    block.center.x = 500;
    block.center.y = 950;
  }

  function updatePlatforms(elapsedTime) {
    time+= elapsedTime;
    for (let i = platforms.length - 1; i >= 0; i--) {
      let platform = platforms[i];
      platform.center.y += platform.speed * elapsedTime;
      if (platform.center.y > 975) {
        //remove platform
        platforms.splice(i, 1);
        addPlatform();
      }
    }
    if (platformCount < 6 && platforms[0].center.y > platformCount * 160) {
      platformCount++;
      addPlatform();
    }
    for(let i = 0 ; i < platforms.length; i++){
      addPlatformParticles(platforms[i]);
    }
  }

  function logScore(time, name) {
    if (!localStorage.highScores) {
      localStorage.highScores = JSON.stringify([]);
    }
    if (name == "" || name == null) {
      return;
    }
    let highScores = JSON.parse(localStorage.highScores);
    highScores.push({ time: time, name: name });
    highScores.sort((a, b) => b.time - a.time);
    if (highScores.length > 5) {
      highScores.splice(5, highScores.length);
    }
    localStorage.highScores = JSON.stringify(highScores);
  }

  function showScreen(id) {
    let active = document.getElementsByClassName("active");
    for (let screen = 0; screen < active.length; screen++) {
      active[screen].classList.remove("active");
    }

    screens[id].run();

    document.getElementById(id).classList.add("active");
  }

  function checkCollisions() {
    let platform = platforms[0];
    if (
      block.center.y + block.height / 2 >
        platform.center.y - platform.height / 2 &&
      block.center.y - block.height / 2 <
        platform.center.y + platform.height / 2
    ) {
      if (
        !(
          block.center.x - block.width / 2 > platform.gap.leftSide &&
          block.center.x + block.width / 2 < platform.gap.rightSide
        )
      ) {
        gameOver = true;
        deathParticles();
      }
    }
  }

  function deathParticles(){
    let system = systems.ParticleSystem({
      center: { x: block.center.x, y: block.center.y },
      width: block.width,
      height: block.height,
      size: 20
    });
    system.createBlock();
    particleSystems.push(system);
    let renderer = render.ParticleSystem(system, graphics);
    particleRenderers.push(renderer);
  }

  function addPlatformParticles(platform){
    let system = systems.ParticleSystem({
      center: { x: platform.center.x, y: platform.center.y },
      width: platform.width,
      height: platform.height,
      size: 15,
      gap: platform.gap
    });
    system.createPlatformParticles();
    particleSystems.push(system);
    let renderer = render.ParticleSystem(system, graphics);
    particleRenderers.push(renderer);
  }


  function addPlatform() {
    platforms.push({
      outlineColor: "rgba(0,255,0,1)",
      fillColor: "rgba(0,255,255,1)",
      center: { x: nextPlatform.center.x, y: nextPlatform.center.y },
      gap: {
        leftSide: nextPlatform.gap.leftSide,
        rightSide: nextPlatform.gap.rightSide,
      },
      speed: nextPlatform.speed,
      width: nextPlatform.width,
      height: nextPlatform.height,
    });
    randomizeNextPlatform();
  }

  function updateParticles(elapsedTime) {
    for (let i = 0; i < particleRenderers.length; i++) {
      if (particleSystems[i].update(elapsedTime)) {
        particleSystems.splice(i, 1);
        particleRenderers.splice(i, 1);
      }
    }
  }

  function renderParticles(texture) {
    for (let i = 0; i < particleRenderers.length; i++) {
      particleRenderers[i].render(texture.texture);
    }
  }

  function initialize() {
    let screen = null;

    for (screen in screens) {
      if (screens.hasOwnProperty(screen)) {
        screens[screen].initialize();
      }
    }

    showScreen("main-menu");
  }

  function initializePlatform() {
    randomizeNextPlatform();
  }

  function newGame() {
    time = 0;
    platformCount = 1;
    gameOver = false;
    particleRenderers = [];
    particleSystems = [];
    platforms = [];
    initializePlatform();
    platforms.push({
      outlineColor: "rgba(0,255,0,1)",
      fillColor: "rgba(0,255,255,1)",
      center: { x: nextPlatform.center.x, y: nextPlatform.center.y },
      gap: { leftSide: nextPlatform.gap.leftSide, rightSide: nextPlatform.gap.rightSide },
      speed: nextPlatform.speed,
      width: nextPlatform.width,
      height: nextPlatform.height,
    });
    randomizeNextPlatform();
    initializeBlock();
  }

  return {
    initialize: initialize,
    showScreen: showScreen,
    updatePlatforms: updatePlatforms,
    logScore: logScore,
    checkCollisions: checkCollisions,
    initializeBlock: initializeBlock,
    newGame: newGame,
    renderParticles: renderParticles,
    updateParticles: updateParticles,
    nextPlatform: () => [nextPlatform],
    platforms: () => platforms,
    block: () => block,
    gameOver: () => gameOver,
    time: () => time,
  };
})(MyGame.screens, MyGame.systems, MyGame.graphics, MyGame.render);
