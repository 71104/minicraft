function run(atlas) {
  const canvas = $('canvas#canvas').get(0);
  const gl = canvas.getContext('webgl');
  
  const resize = function () {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    if (height > width) {
      gl.viewport((width - height) / 2, 0, height, height);
    } else {
      gl.viewport(0, (height - width) / 2, width, width);
    }
  };

  $(window).resize(resize);
  resize();

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clearDepth(0);
  gl.depthFunc(gl.GREATER);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, $('script#fragment-shader').text());
  gl.compileShader(fragmentShader);
  if (gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));
  } else {
    throw new Error(gl.getShaderInfoLog(fragmentShader));
  }

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, $('script#vertex-shader').text());
  gl.compileShader(vertexShader);
  if (gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
  } else {
    throw new Error(gl.getShaderInfoLog(vertexShader));
  }

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Int16Array([
      0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0,
      1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1,
      0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1,
      0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1,
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.SHORT, false, 0, 0);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.BYTE, false, 0, 0);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 2, gl.UNSIGNED_BYTE, false, 0, 0);

  const texIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texIndexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
      3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,
      3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,
      2, 9, 2, 9, 2, 9, 2, 9, 2, 9, 2, 9,
      3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,
      2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0,
      3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3, 2, gl.UNSIGNED_BYTE, false, 0, 0);

  const program = gl.createProgram();
  gl.attachShader(program, fragmentShader);
  gl.attachShader(program, vertexShader);
  gl.bindAttribLocation(program, 0, 'in_Vertex');
  gl.bindAttribLocation(program, 1, 'in_Normal');
  gl.bindAttribLocation(program, 2, 'in_TexCoord');
  gl.bindAttribLocation(program, 3, 'in_TexIndex');
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(program));
  } else {
    throw new Error(gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  gl.clearColor(0, 0, 0, 1);

  const positionLocation = gl.getUniformLocation(program, 'in_Position');
  const cameraPositionLocation = gl.getUniformLocation(program, 'in_Camera.Position');
  const cameraAngleLocation = gl.getUniformLocation(program, 'in_Camera.Angle');
  const activeFlagLocation = gl.getUniformLocation(program, 'in_Active');

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
    gl.uniform3i(positionLocation, x, y, z);
    gl.uniform1i(activeFlagLocation, crosshair.isActive(x, y, z));
    if (voxel & Outliner.FACES.front) {
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    if (voxel & Outliner.FACES.right) {
      gl.drawArrays(gl.TRIANGLES, 6, 6);
    }
    if (voxel & Outliner.FACES.up) {
      gl.drawArrays(gl.TRIANGLES, 12, 6);
    }
    if (voxel & Outliner.FACES.left) {
      gl.drawArrays(gl.TRIANGLES, 18, 6);
    }
    if (voxel & Outliner.FACES.down) {
      gl.drawArrays(gl.TRIANGLES, 24, 6);
    }
    if (voxel & Outliner.FACES.back) {
      gl.drawArrays(gl.TRIANGLES, 30, 6);
    }
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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform3f(
      cameraPositionLocation,
      camera.position.x,
      camera.position.y,
      camera.position.z
      );
    gl.uniform2f(
      cameraAngleLocation,
      camera.angle.x,
      camera.angle.y
      );
    outliner.each(renderVoxel);
    gl.flush();
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
