function Terrain() {}

Terrain.MIN_I = -33;
Terrain.MAX_I = 33;
Terrain.I_SPAN = Terrain.MAX_I - Terrain.MIN_I;

Terrain.MIN_J = -33;
Terrain.MAX_J = 33;
Terrain.J_SPAN = Terrain.MAX_J - Terrain.MIN_J;

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

Terrain._outline = function (outliner, heightMap) {
  var min = heightMap[Terrain.MIN_I][Terrain.MIN_J];
  for (var i = Terrain.MIN_I; i < Terrain.MAX_I; i++) {
    for (var j = Terrain.MIN_J; j < Terrain.MAX_J; j++) {
      min = Math.min(min, heightMap[i][j]);
    }
  }
  return $.Deferred(function (deferred) {
    (function outline(i, j) {
      window.setTimeout(function () {
        for (var k = min; k < heightMap[i][j]; k++) {
          outliner.set(j, k, i, Voxel.TYPES.DIRT);
        }
        outliner.set(j, heightMap[i][j], i, Voxel.TYPES.GRASS);
        deferred.notify(i * Terrain.I_SPAN + j % Terrain.I_SPAN);
        if (j < Terrain.MAX_J - 1) {
          outline(i, j + 1);
        } else if (i < Terrain.MAX_I - 1) {
          outline(i + 1, Terrain.MIN_J);
        } else {
          deferred.resolve();
        }
      }, 0);
    }(Terrain.MIN_I, Terrain.MIN_J));
  });
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
  return Terrain._outline(outliner, heightMap);
};
