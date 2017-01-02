function Terrain() {}

Terrain.MAX = 64;
Terrain.SPAN = Terrain.MAX + 1;

Terrain._outline = function (outliner, heightMap) {
  var min = heightMap[0][0];
  for (var i = 0; i < Terrain.SPAN; i++) {
    for (var j = 0; j < Terrain.SPAN; j++) {
      min = Math.min(min, heightMap[i][j]);
    }
  }
  const d = Terrain.MAX / 2;
  return $.Deferred(function (deferred) {
    (function outline(i, j) {
      window.setTimeout(function () {
        for (var k = min; k < heightMap[i][j]; k++) {
          outliner.set(j - d, k, i - d, Voxel.TYPES.DIRT);
        }
        outliner.set(j - d, heightMap[i][j], i - d, Voxel.TYPES.GRASS);
        deferred.notify(i * Terrain.MAX + j % Terrain.MAX);
        if (j < Terrain.MAX) {
          outline(i, j + 1);
        } else if (i < Terrain.MAX) {
          outline(i + 1, 0);
        } else {
          deferred.resolve();
        }
      }, 0);
    }(0, 0));
  });
};

Terrain._mod = function (i) {
  return ((i % Terrain.SPAN) + Terrain.SPAN) % Terrain.SPAN;
};

Terrain._ds = function (heightMap, i0, j0, i1, j1) {
  if (i1 > i0 + 1 && j1 > j0 + 1) {
    const i = (i0 + i1) >> 1;
    const j = (j0 + j1) >> 1;
    const d = (i1 - i0) >> 2;
    heightMap[i][j] = Math.round((
        heightMap[i0][j0] +
        heightMap[i0][j1] +
        heightMap[i1][j0] +
        heightMap[i1][j1]
    ) / 4 + (Math.random() * 2 - 1) * d);
    heightMap[i0][j] = Math.round((
        heightMap[i0][j0] +
        heightMap[Terrain._mod(i0 * 2 - i)][j] +
        heightMap[i0][j1] +
        heightMap[i][j]
    ) / 4 + (Math.random() * 2 - 1) * d);
    heightMap[i][j0] = Math.round((
        heightMap[i0][j0] +
        heightMap[i][Terrain._mod(j0 * 2 - j)] +
        heightMap[i][j] +
        heightMap[i1][j0]
    ) / 4 + (Math.random() * 2 - 1) * d);
    heightMap[i][j1] = Math.round((
        heightMap[i0][j1] +
        heightMap[i][j] +
        heightMap[i][Terrain._mod(j1 * 2 - j)] +
        heightMap[i1][j1]
    ) / 4 + (Math.random() * 2 - 1) * d);
    heightMap[i1][j] = Math.round((
        heightMap[i][j] +
        heightMap[i1][j0] +
        heightMap[i1][j1] +
        heightMap[Terrain._mod(i1 * 2 - i)][j]
    ) / 4 + (Math.random() * 2 - 1) * d);
    Terrain._ds(heightMap, i0, j0, i, j);
    Terrain._ds(heightMap, i0, j, i, j1);
    Terrain._ds(heightMap, i, j0, i1, j);
    Terrain._ds(heightMap, i, j, i1, j1);
  }
};

Terrain.generate = function (outliner) {
  const heightMap = {};
  for (var i = 0; i < Terrain.SPAN; i++) {
    heightMap[i] = {};
    for (var j = 0; j < Terrain.SPAN; j++) {
      heightMap[i][j] = -1;
    }
  }
  heightMap[0][0] = -1;
  heightMap[Terrain.MAX][0] = -1;
  heightMap[0][Terrain.MAX] = -1;
  heightMap[Terrain.MAX][Terrain.MAX] = -1;
  Terrain._ds(heightMap, 0, 0, Terrain.MAX, Terrain.MAX);
  return Terrain._outline(outliner, heightMap);
};
