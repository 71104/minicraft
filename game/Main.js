function run(atlas) {
  const canvas = $('canvas#canvas').get(0);

  const pipeline = new Pipeline(canvas, atlas);

  $(window).resize(function () {
    pipeline.resize();
  });

  const outliner = new Outliner();
  for (var i = -10; i < 10; i++) {
    for (var j = -10; j < 10; j++) {
      outliner.set(j, -1, i);
    }
  }

  const camera = {
    position: {
      x: 0,
      y: 1.5,
      z: 0,
    },
    angle: {
      x: 0,
      y: 0,
    },
  };

  const crosshair = new Crosshair(outliner, camera);

  const velocity = 0.1;

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
    const vx = -Math.sin(camera.angle.y) * velocity;
    const vz = Math.cos(camera.angle.y) * velocity;
    if (keys[87]) {  // W
      camera.position.x += vx;
      camera.position.z += vz;
    }
    if (keys[65]) {  // A
      camera.position.x -= vz;
      camera.position.z += vx;
    }
    if (keys[83]) {  // S
      camera.position.x -= vx;
      camera.position.z -= vz;
    }
    if (keys[68]) {  // D
      camera.position.x += vz;
      camera.position.z -= vx;
    }
    pipeline.begin(camera);
    outliner.each(renderVoxel);
    pipeline.flush();
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
