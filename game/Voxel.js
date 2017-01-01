function Voxel(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.front = -1;
  this.right = -1;
  this.top = -1;
  this.back = -1;
  this.left = -1;
  this.bottom = -1;
}

Voxel.prototype.internal = function () {
  return this.front < 0 &&
    this.right < 0 &&
    this.top < 0 &&
    this.left < 0 &&
    this.bottom < 0 &&
    this.back < 0;
};
