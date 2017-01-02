function run(atlas) {
  const canvas = $('canvas#canvas').get(0);

  const pipeline = new Pipeline(canvas, atlas);

  $(window).resize(function () {
    pipeline.resize();
  });

  const outliner = new Outliner(pipeline);
  Terrain.generate(outliner);

  const camera = new Camera();

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
        outliner.set(target.x, target.y, target.z);
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

  const renderVoxel = function (x, y, z, voxel) {
    pipeline.renderVoxel(x, y, z, voxel, crosshair.isActive(x, y, z));
  };

  window.requestAnimationFrame(function render() {
    camera.tick(keys);
    pipeline.render(camera);
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
