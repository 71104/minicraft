function run(atlas) {
  const canvas = $('canvas#canvas').get(0);

  const pipeline = new Pipeline(canvas, atlas);

  $(window).resize(function () {
    pipeline.resize();
  });

  const outliner = new Outliner(pipeline);
  //Terrain.generate(outliner);

  for (var i = -10; i < 10; i++) {
    for (var j = -10; j < 10; j++) {
      outliner.set(j, -1, i, Voxel.TYPES.GRASS);
    }
  }

  const camera = new Camera(new Physics(outliner));

  const crosshair = new Crosshair(outliner, camera);

  const keys = Object.create(null);
  $(window).keydown(function (event) {
    keys[event.which] = true;
  }).keyup(function (event) {
    delete keys[event.which];
  });

  var focus = false;

  $(canvas).mousedown(function () {
    if (focus) {
      const target = crosshair.getTarget();
      if (target) {
        outliner.set(target.x, target.y, target.z, Voxel.TYPES.STONE);
      }
    } else {
      const requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
      requestPointerLock && requestPointerLock.call(canvas);
      focus = true;
    }
  }).mousemove(function (event) {
    if (focus) {
      camera.angle.x -= event.originalEvent.movementY * 0.005;
      camera.angle.y -= event.originalEvent.movementX * 0.005;
      camera.angle.x = Math.min(Math.max(camera.angle.x, -Math.PI / 2), Math.PI / 2);
    }
  });

  window.setInterval(function () {
    crosshair.pick();
  }, 200);
  
  var t0 = null;
  const render = function render(t1) {
    camera.tick(t1 - t0, keys);
    pipeline.render(camera);
    t0 = t1;
    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(function (timestamp) {
    t0 = timestamp;
    window.requestAnimationFrame(render);
  });
}


$(function () {
  $.loadImage('../common/atlas.png').then(function (atlas) {
    run(atlas);
  }).catch(function (error) {
    console.error(error);
  });
});
