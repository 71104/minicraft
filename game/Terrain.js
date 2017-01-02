function Terrain() {}

Terrain.MIN_I = -25;
Terrain.MAX_I = 25;
Terrain.MIN_J = -25;
Terrain.MAX_J = 25;

Terrain._OFFSETS = [
  -5,
  -4,
  -3, -3,
  -2, -2, -2, -2,
  -1, -1, -1, -1, -1,
  0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1,
  2, 2, 2, 2,
  3, 3,
  4,
  5,
];

Terrain._randomOffset = function () {
  return Terrain._OFFSETS[Math.floor(Math.random() * Terrain._OFFSETS.length)];
};

Terrain.generate = function (outliner) {
  const heightMap = {};
  for (var i = Terrain.MIN_I; i < Terrain.MAX_I; i++) {
    heightMap[i] = {};
  }
  heightMap[Terrain.MIN_I][Terrain.MIN_J] = -1;
  for (var i = Terrain.MIN_I + 1; i < Terrain.MAX_I; i++) {
    heightMap[i][Terrain.MIN_J] = heightMap[i - 1][Terrain.MIN_J] +
      Terrain._randomOffset();
  }
  for (var j = Terrain.MIN_J + 1; j < Terrain.MAX_J; j++) {
    heightMap[Terrain.MIN_I][j] = heightMap[Terrain.MIN_I][j - 1] +
      Terrain._randomOffset();
  }
  for (var i = Terrain.MIN_I + 1; i < Terrain.MAX_I; i++) {
    for (var j = Terrain.MIN_J + 1; j < Terrain.MAX_J; j++) {
      heightMap[i][j] = Math.round((heightMap[i - 1][j] +
            heightMap[i][j - 1]) / 2);
    }
  }
  var min = heightMap[Terrain.MIN_I][Terrain.MIN_J];
  for (var i = Terrain.MIN_I; i < Terrain.MAX_I; i++) {
    for (var j = Terrain.MIN_J; j < Terrain.MAX_J; j++) {
      min = Math.min(min, heightMap[i][j]);
    }
  }
  for (var i = Terrain.MIN_I; i < Terrain.MAX_I; i++) {
    for (var j = Terrain.MIN_J; j < Terrain.MAX_J; j++) {
      for (var k = min; k <= heightMap[i][j]; k++) {
        outliner.set(j, k, i);
      }
    }
  }
};
