function Faces(pipeline) {
  this._pipeline = pipeline;
  this._voxels = [];
}

Faces.prototype.addFront = function (x, y, z, voxel) {
  voxel.front = this._pipeline.pushFrontFace(x, y, z);
  this._voxels.push(voxel);
};

Faces.prototype.addRight = function (x, y, z, voxel) {
  voxel.right = this._pipeline.pushRightFace(x, y, z);
  this._voxels.push(voxel);
};

Faces.prototype.addTop = function (x, y, z, voxel) {
  voxel.top = this._pipeline.pushTopFace(x, y, z);
  this._voxels.push(voxel);
};

Faces.prototype.addLeft = function (x, y, z, voxel) {
  voxel.left = this._pipeline.pushLeftFace(x, y, z);
  this._voxels.push(voxel);
};

Faces.prototype.addBottom = function (x, y, z, voxel) {
  voxel.bottom = this._pipeline.pushBottomFace(x, y, z);
  this._voxels.push(voxel);
};

Faces.prototype.addBack = function (x, y, z, voxel) {
  voxel.back = this._pipeline.pushBackFace(x, y, z);
  this._voxels.push(voxel);
};

Faces.prototype._moveLast = function (i) {
  const j = this._voxels.length - 1;
  const last = this._voxels[j];
  switch (j) {
  case last.front:
    last.front = i;
    this._pipeline.setFrontFace(i, last.x, last.y, last.z);
    break;
  case last.right:
    last.right = i;
    this._pipeline.setRightFace(i, last.x, last.y, last.z);
    break;
  case last.top:
    last.top = i;
    this._pipeline.setTopFace(i, last.x, last.y, last.z);
    break;
  case last.left:
    last.left = i;
    this._pipeline.setLeftFace(i, last.x, last.y, last.z);
    break;
  case last.bottom:
    last.bottom = i;
    this._pipeline.setBottomFace(i, last.x, last.y, last.z);
    break;
  case last.back:
    last.back = i;
    this._pipeline.setBackFace(i, last.x, last.y, last.z);
    break;
  default:
    throw new Error();
  }
  this._voxels.pop();
  this._pipeline.popFace();
};

Faces.prototype.removeFront = function (voxel) {
  this._moveLast(voxel.front);
  voxel.front = -1;
};

Faces.prototype.removeRight = function (voxel) {
  this._moveLast(voxel.right);
  voxel.right = -1;
};

Faces.prototype.removeTop = function (voxel) {
  this._moveLast(voxel.top);
  voxel.top = -1;
};

Faces.prototype.removeLeft = function (voxel) {
  this._moveLast(voxel.left);
  voxel.left = -1;
};

Faces.prototype.removeBottom = function (voxel) {
  this._moveLast(voxel.bottom);
  voxel.bottom = -1;
};

Faces.prototype.removeBack = function (voxel) {
  this._moveLast(voxel.back);
  voxel.back = -1;
};
