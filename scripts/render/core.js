MyGame.graphics = (function () {
  "use strict";

  let canvas = document.getElementById("id-canvas");
  let context = canvas.getContext("2d");

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawTexture(texture) {
    if (texture.image.ready) {
      context.save();

      context.translate(texture.center.x, texture.center.y);
      context.rotate(texture.rotation);
      context.translate(-texture.center.x, -texture.center.y);

      context.drawImage(
        texture.image,
        texture.center.x - texture.width / 2,
        texture.center.y - texture.height / 2,
        texture.width,
        texture.height
      );

      context.restore();
    }
  }

  function drawParticle(texture, spec){
    if (texture.image.ready) {
      context.save();

      context.translate(spec.center.x, spec.center.y);
      context.rotate(spec.rotation);
      context.translate(-spec.center.x, -spec.center.y);

      context.drawImage(
        texture.image,
        spec.center.x - spec.width / 2,
        spec.center.y - spec.height / 2,
        spec.width,
        spec.height
      );

      context.restore();
    }
  }

  function drawPlatforms(platforms) {
    for (let i = 0; i < platforms.length; i++) {
      let platform = platforms[i];
      let leftSide = {
        outlineColor: platform.outlineColor,
        fillColor: platform.fillColor,
        center: { x: (platform.gap.leftSide+250)/2, y: platform.center.y },
        width: platform.gap.leftSide-250,
        height: platform.height,
        rotation: 0,
      };
      let rightSide = {
        outlineColor: platform.outlineColor,
        fillColor: platform.fillColor,
        center: { x: (platform.gap.rightSide+750) / 2, y: platform.center.y },
        width: 750 - platform.gap.rightSide,
        height: platform.height,
        rotation: 0,
      };
      drawRectangle(leftSide);
      drawRectangle(rightSide);
    }

  }

  function drawBlock(spec) {
    drawRectangle(spec);
  }

  function drawRectangle(spec) {
    context.save();
    context.translate(spec.center.x, spec.center.y);
    context.rotate(spec.rotation);
    context.translate(-spec.center.x, -spec.center.y);

    context.strokeStyle = spec.outlineColor;
    context.fillStyle = spec.fillColor;

    context.fillRect(
      spec.center.x - spec.width / 2,
      spec.center.y - spec.height / 2,
      spec.width,
      spec.height
    );

    context.strokeRect(
      spec.center.x - spec.width / 2,
      spec.center.y - spec.height / 2,
      spec.width,
      spec.height
    );

    context.restore();
    }

  function drawText(spec) {
    context.save();

    context.font = spec.font;
    context.fillStyle = spec.fillStyle;
    context.strokeStyle = spec.strokeStyle;
    context.textBaseline = "top";

    context.translate(spec.position.x, spec.position.y);
    context.rotate(spec.rotation);
    context.translate(-spec.position.x, -spec.position.y);

    context.fillText(spec.text, spec.position.x, spec.position.y);
    context.strokeText(spec.text, spec.position.x, spec.position.y);

    context.restore();
  }

  function getTextWidth(text, font) {
    context.font = font;
    let width = context.measureText(text).width;
    return Math.floor((canvas.width - width) / 2);
  }

  function textWidth(text, font) {
    context.font = font;
    let width = context.measureText(text).width;
    return canvas.width - Math.floor(width) - 50;
  }

  let api = {
    get canvas() {
      return canvas;
    },
    drawBlock: drawBlock,
    clear: clear,
    drawTexture: drawTexture,
    drawParticle: drawParticle,
    drawText: drawText,
    drawRectangle: drawRectangle,
    getTextWidth: getTextWidth,
    textWidth: textWidth,
    drawPlatforms: drawPlatforms,
  };

  return api;
})();
