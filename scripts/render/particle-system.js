MyGame.render.ParticleSystem = function (system, graphics) {
  "use strict";

  function render(texture) {
    let particles = system.particles();
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].alive < particles[i].lifetime) {
        graphics.drawParticle(texture, particles[i]);
      }
    }
  }

  let api = {
    render: render,
  };

  return api;
};
