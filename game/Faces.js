function Faces(pipeline) {
  this._pipeline = pipeline;
  this._voxels = [];
}

Faces.prototype.addFront = function (voxel) {
  voxel.front = this._pipeline.pushFrontFace(voxel.x, voxel.y, voxel.z);
  this._voxels.push(voxel);
};

Faces.prototype.addRight = function (voxel) {
  voxel.right = this._pipeline.pushRightFace(voxel.x, voxel.y, voxel.z);
  this._voxels.push(voxel);
};

Faces.prototype.addTop = function (voxel) {
  voxel.top = this._pipeline.pushTopFace(voxel.x, voxel.y, voxel.z);
  this._voxels.push(voxel);
};

Faces.prototype.addLeft = function (voxel) {
  voxel.left = this._pipeline.pushLeftFace(voxel.x, voxel.y, voxel.z);
  this._voxels.push(voxel);
};

Faces.prototype.addBottom = function (voxel) {
  voxel.bottom = this._pipeline.pushBottomFace(voxel.x, voxel.y, voxel.z);
  this._voxels.push(voxel);
};

Faces.prototype.addBack = function (voxel) {
  voxel.back = this._pipeline.pushBackFace(voxel.x, voxel.y, voxel.z);
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
  this._voxels[i] = last;
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
