MyGame.systems.ParticleSystem = function (spec) {
  "use strict";
  let particles = [];

  function createBlock() {
    for (let j = 0; j < 100; j++) {
      particles.push({
        center: {
          x: spec.center.x,
          y: spec.center.y,
        },
        width: spec.size,
        height: spec.size,
        speed: Math.random() /10,
        lifetime: Math.random() * 1000,
        direction: Random.pointOnCircle(),
        alive: 0,
        rotation: 0,
      });
    }
  }


  function createPlatformParticles(){
    let leftSide = spec.gap.leftSide;
    let rightSide = spec.gap.rightSide;
    let platformWidth = spec.width;
    let particleCount = 100;
    let particleWidth = platformWidth / particleCount;
    let particleXPositions = [];
    //randomly but uniformly distribute x values between 250 and 750
    for(let j = 0; j < particleCount; j++){
      particleXPositions.push(Random.nextRange(250, 750));
    }
    for(let i = 0; i < particleCount; i++){ 
      if(particleXPositions[i] < leftSide || particleXPositions[i] > rightSide){
        particles.push({
          center: {
            x: particleXPositions[i],
            y: spec.center.y-5-spec.height/2 - (Random.nextRange(0, 15)),
          },
          width: spec.size,
          height: spec.size,
          speed: Math.random() /10,
          lifetime: Math.random() * 200,
          direction: Random.pointOnCircle(),
          alive: 0,
          rotation: 0,
        });
    }
    }
  }
  

  function update(elapsedTime) {
    for (let i = particles.length-1; i >= 0; i--) {
      let particle = particles[i];
      particle.alive += elapsedTime;

      particle.center.x += elapsedTime * particle.speed * particle.direction.x;
      particle.center.y += elapsedTime * particle.speed * particle.direction.y;

      particle.rotation += particle.speed;
      particle.rotation = particle.rotation % (Math.PI * 2);

      if (particle.alive > particle.lifetime) {
        particles.splice(i, 1);
      }
    }

    if (particles.length === 0) {
      return true
    }
    return false;
  }

  let api = {
    createBlock: createBlock,
    createPlatformParticles: createPlatformParticles,
    update: update,
    particles: () => particles,
  };

  return api;
};
