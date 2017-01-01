function Pipeline(canvas, atlas) {
  this._gl = canvas.getContext('webgl');
  this._faceCount = 0;
  this._bufferCount = 0;
  this._vertexBuffers = [];
  this._normalBuffers = [];
  this._texCoordBuffers = [];
  this._texIndexBuffers = [];
  this._locations = {};
  this._setup(atlas);
}

Pipeline.FACES_PER_BUFFER = Flags.facesPerBuffer;

Pipeline._FACE_VERTEX_SIZE = 6 * 3 * 2;
Pipeline._VERTEX_BUFFER_SIZE = Pipeline.FACES_PER_BUFFER * Pipeline._FACE_VERTEX_SIZE;

Pipeline._FACE_NORMAL_SIZE = 6 * 3;
Pipeline._NORMAL_BUFFER_SIZE = Pipeline.FACES_PER_BUFFER * Pipeline._FACE_NORMAL_SIZE;

Pipeline._FACE_TEX_COORD_SIZE = 6 * 2;
Pipeline._TEX_COORD_BUFFER_SIZE = Pipeline.FACES_PER_BUFFER * Pipeline._FACE_TEX_COORD_SIZE;

Pipeline._FACE_TEX_INDEX_SIZE = 6 * 2;
Pipeline._TEX_INDEX_BUFFER_SIZE = Pipeline.FACES_PER_BUFFER * Pipeline._FACE_TEX_INDEX_SIZE;


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

  gl.clearColor(0, 0, 0, 1);
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

  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.enableVertexAttribArray(2);
  gl.enableVertexAttribArray(3);

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

  this._locations.cameraPosition = gl.getUniformLocation(program, 'in_Camera.Position');
  this._locations.cameraAngle = gl.getUniformLocation(program, 'in_Camera.Angle');
};

Pipeline.prototype.pushFace = function () {
  const index = this._faceCount++;
  if (this._faceCount > this._bufferCount * Pipeline.FACES_PER_BUFFER) {
    const gl = this._gl;
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Pipeline._VERTEX_BUFFER_SIZE, gl.DYNAMIC_DRAW);
    this._vertexBuffers.push(vertexBuffer);
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Pipeline._NORMAL_BUFFER_SIZE, gl.DYNAMIC_DRAW);
    this._normalBuffers.push(normalBuffer);
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Pipeline._TEX_COORD_BUFFER_SIZE, gl.DYNAMIC_DRAW);
    this._texCoordBuffers.push(texCoordBuffer);
    const texIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texIndexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Pipeline._TEX_INDEX_BUFFER_SIZE, gl.DYNAMIC_DRAW);
    this._texIndexBuffers.push(texIndexBuffer);
    this._bufferCount++;
  }
  return index;
};

Pipeline.prototype.popFace = function () {
  if (this._faceCount > 0) {
    // TODO: delete unused buffers?
    return --this._faceCount;
  } else {
    throw new Error();
  }
};

Pipeline.prototype.setFrontFace = function (i, x, y, z) {
  const j = Math.floor(i / Pipeline.FACES_PER_BUFFER);
  const k = i % Pipeline.FACES_PER_BUFFER;
  if (j < 0 || j >= this._bufferCount) {
    throw new Error();
  }
  const gl = this._gl;
  gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_VERTEX_SIZE, new Int16Array([
      x, y + 1, z, x, y, z, x + 1, y, z,
      x + 1, y, z, x + 1, y + 1, z, x, y + 1, z,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_NORMAL_SIZE, new Int8Array([
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_COORD_SIZE, new Uint8Array([
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texIndexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_INDEX_SIZE, new Uint8Array([
      3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,
  ]));
};

Pipeline.prototype.setRightFace = function (i, x, y, z) {
  const j = Math.floor(i / Pipeline.FACES_PER_BUFFER);
  const k = i % Pipeline.FACES_PER_BUFFER;
  if (j < 0 || j >= this._bufferCount) {
    throw new Error();
  }
  const gl = this._gl;
  gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_VERTEX_SIZE, new Int16Array([
      x + 1, y + 1, z, x + 1, y, z, x + 1, y, z + 1,
      x + 1, y, z + 1, x + 1, y + 1, z + 1, x + 1, y + 1, z,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_NORMAL_SIZE, new Int8Array([
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_COORD_SIZE, new Uint8Array([
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texIndexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_INDEX_SIZE, new Uint8Array([
      3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,
  ]));
};

Pipeline.prototype.setTopFace = function (i, x, y, z) {
  const j = Math.floor(i / Pipeline.FACES_PER_BUFFER);
  const k = i % Pipeline.FACES_PER_BUFFER;
  if (j < 0 || j >= this._bufferCount) {
    throw new Error();
  }
  const gl = this._gl;
  gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_VERTEX_SIZE, new Int16Array([
      x, y + 1, z + 1, x, y + 1, z, x + 1, y + 1, z,
      x + 1, y + 1, z, x + 1, y + 1, z + 1, x, y + 1, z + 1,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_NORMAL_SIZE, new Int8Array([
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_COORD_SIZE, new Uint8Array([
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texIndexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_INDEX_SIZE, new Uint8Array([
      2, 9, 2, 9, 2, 9, 2, 9, 2, 9, 2, 9,
  ]));
};

Pipeline.prototype.setLeftFace = function (i, x, y, z) {
  const j = Math.floor(i / Pipeline.FACES_PER_BUFFER);
  const k = i % Pipeline.FACES_PER_BUFFER;
  if (j < 0 || j >= this._bufferCount) {
    throw new Error();
  }
  const gl = this._gl;
  gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_VERTEX_SIZE, new Int16Array([
      x, y + 1, z + 1, x, y, z + 1, x, y, z,
      x, y, z, x, y + 1, z, x, y + 1, z + 1,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_NORMAL_SIZE, new Int8Array([
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_COORD_SIZE, new Uint8Array([
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texIndexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_INDEX_SIZE, new Uint8Array([
      3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,
  ]));
};

Pipeline.prototype.setBottomFace = function (i, x, y, z) {
  const j = Math.floor(i / Pipeline.FACES_PER_BUFFER);
  const k = i % Pipeline.FACES_PER_BUFFER;
  if (j < 0 || j >= this._bufferCount) {
    throw new Error();
  }
  const gl = this._gl;
  gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_VERTEX_SIZE, new Int16Array([
      x, y, z, x, y, z + 1, x + 1, y, z + 1,
      x + 1, y, z + 1, x + 1, y, z, x, y, z,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_NORMAL_SIZE, new Int8Array([
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_COORD_SIZE, new Uint8Array([
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texIndexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_INDEX_SIZE, new Uint8Array([
      2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0,
  ]));
};

Pipeline.prototype.setBackFace = function (i, x, y, z) {
  const j = Math.floor(i / Pipeline.FACES_PER_BUFFER);
  const k = i % Pipeline.FACES_PER_BUFFER;
  if (j < 0 || j >= this._bufferCount) {
    throw new Error();
  }
  const gl = this._gl;
  gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_VERTEX_SIZE, new Int16Array([
      x + 1, y + 1, z + 1, x + 1, y, z + 1, x, y, z + 1,
      x, y, z + 1, x, y + 1, z + 1, x + 1, y + 1, z + 1,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_NORMAL_SIZE, new Int8Array([
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_COORD_SIZE, new Uint8Array([
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  ]));
  gl.bindBuffer(gl.ARRAY_BUFFER, this._texIndexBuffers[j]);
  gl.bufferSubData(gl.ARRAY_BUFFER, k * Pipeline._FACE_TEX_INDEX_SIZE, new Uint8Array([
      3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,
  ]));
};

Pipeline.prototype.pushFrontFace = function (x, y, z) {
  const i = this.pushFace();
  this.setFrontFace(i, x, y, z);
  return i;
};

Pipeline.prototype.pushRightFace = function (x, y, z) {
  const i = this.pushFace();
  this.setRightFace(i, x, y, z);
  return i;
};

Pipeline.prototype.pushTopFace = function (x, y, z) {
  const i = this.pushFace();
  this.setTopFace(i, x, y, z);
  return i;
};

Pipeline.prototype.pushLeftFace = function (x, y, z) {
  const i = this.pushFace();
  this.setLeftFace(i, x, y, z);
  return i;
};

Pipeline.prototype.pushBottomFace = function (x, y, z) {
  const i = this.pushFace();
  this.setBottomFace(i, x, y, z);
  return i;
};

Pipeline.prototype.pushBackFace = function (x, y, z) {
  const i = this.pushFace();
  this.setBackFace(i, x, y, z);
  return i;
};

Pipeline.prototype.render = function (camera) {
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
  for (var i = 0; i < this._bufferCount; i++) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffers[i]);
    gl.vertexAttribPointer(0, 3, gl.SHORT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffers[i]);
    gl.vertexAttribPointer(1, 3, gl.BYTE, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordBuffers[i]);
    gl.vertexAttribPointer(2, 2, gl.UNSIGNED_BYTE, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._texIndexBuffers[i]);
    gl.vertexAttribPointer(3, 2, gl.UNSIGNED_BYTE, false, 0, 0);
    if (i < this._bufferCount - 1) {
      gl.drawArrays(gl.TRIANGLES, 0, Pipeline.FACES_PER_BUFFER * 6);
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, (this._faceCount % Pipeline.FACES_PER_BUFFER) * 6);
    }
  }
  gl.flush();
};
