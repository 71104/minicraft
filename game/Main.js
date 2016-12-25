function run(atlas) {
  var canvas = $('canvas#canvas');
  const width = canvas.width();
  const height = canvas.height();
  canvas.attr({
    width: width,
    height: height,
  });
  canvas = canvas.get(0);

  const gl = canvas.getContext('webgl');

  if (height > width) {
    gl.viewport((width - height) / 2, 0, height, height);
  } else {
    gl.viewport(0, (height - width) / 2, width, width);
  }

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
    console.error(gl.getShaderInfoLog(fragmentShader));
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
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.UNSIGNED_BYTE, false, 0, 0);

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
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 2, gl.UNSIGNED_BYTE, false, 0, 0);

  const program = gl.createProgram();
  gl.attachShader(program, fragmentShader);
  gl.attachShader(program, vertexShader);
  gl.bindAttribLocation(program, 0, 'in_Vertex');
  gl.bindAttribLocation(program, 1, 'in_TexCoord');
  gl.bindAttribLocation(program, 2, 'in_TexIndex');
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(program));
  } else {
    throw new Error(gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  const positionLocation = gl.getUniformLocation(program, 'in_Position');

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  Node.prototype.inorder = function () {
    this.left && this.left.inorder();
    gl.uniform3i(positionLocation, this.z, this.x, this.y);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    this.right && this.right.inorder();
  };

  const matrix = new Matrix();
  matrix.set(-2, 2, 1);
  matrix.set(-2, 3, 1);
  matrix.set(-2, 3, 0);
  matrix.set(-2, 3, -1);
  matrix.set(-2, 2, -2);
  matrix.execute('inorder');

  gl.flush();
}


$(function () {
  $.loadImage('atlas.png').then(function (atlas) {
    run(atlas);
  });
});
