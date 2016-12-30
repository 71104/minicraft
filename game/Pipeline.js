function Pipeline(canvas, atlas) {
  this._gl = canvas.getContext('webgl');
  this._locations = {};
  this._setup(atlas);
}

Pipeline.prototype.resize = function () {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;
  if (height > width) {
    this._gl.viewport((width - height) / 2, 0, height, height);
  } else {
    this._gl.viewport(0, (height - width) / 2, width, width);
  }
};

Pipeline.prototype._setup = function (atlas) {
  this.resize();

  const gl = this._gl;

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

  this._locations.position = gl.getUniformLocation(program, 'in_Position');
  this._locations.cameraPosition = gl.getUniformLocation(program, 'in_Camera.Position');
  this._locations.cameraAngle = gl.getUniformLocation(program, 'in_Camera.Angle');
  this._locations.activeFlag = gl.getUniformLocation(program, 'in_Active');
};

Pipeline.prototype.renderVoxel = function (x, y, z, voxel, active) {
  const gl = this._gl;
  gl.uniform3i(this._locations.position, x, y, z);
  gl.uniform1i(this._locations.activeFlag, active);
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

Pipeline.prototype.begin = function (camera) {
  const gl = this._gl;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniform3f(
    this._locations.cameraPosition,
    camera.position.x,
    camera.position.y,
    camera.position.z
    );
  gl.uniform2f(
    this._locations.cameraAngle,
    camera.angle.x,
    camera.angle.y
    );
};

Pipeline.prototype.flush = function () {
  this._gl.flush();
};
