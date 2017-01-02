function Voxel(x, y, z, type) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.type = type;
  this.front = -1;
  this.right = -1;
  this.top = -1;
  this.back = -1;
  this.left = -1;
  this.bottom = -1;
}

Voxel.TYPES = {
  DIRT: [
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
  ],
  GRASS: [
    [2, 9, 2, 9, 2, 9, 2, 9, 2, 9, 2, 9],
    [3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
  ],
  STONE: [
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  ],
};

Voxel.prototype.internal = function (type) {
  return this.type === type &&
    this.front < 0 &&
    this.right < 0 &&
    this.top < 0 &&
    this.left < 0 &&
    this.bottom < 0 &&
    this.back < 0;
};
