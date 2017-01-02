function Terrain() {}

Terrain.MAX = 16;
Terrain.SPAN = Terrain.MAX + 1;

Terrain.MAX4 = Terrain.MAX * 4;

Terrain._outline = function (outliner, heightMap) {
  var min = heightMap[0][0];
  for (var i = 0; i < Terrain.SPAN; i++) {
    for (var j = 0; j < Terrain.SPAN; j++) {
      min = Math.min(min, heightMap[i][j]);
    }
  }
  const sample = function (i, j) {
    i /= 4;
    j /= 4;
    const i0 = Math.floor(i);
    const i1 = Math.floor(i) + 1;
    const j0 = Math.floor(j);
    const j1 = Math.floor(j) + 1;
    return Math.round(
        heightMap[i0][j0] * (i1 - i) * (j1 - j) +
        heightMap[i0][j1] * (i1 - i) * (j - j0) +
        heightMap[i1][j0] * (i - i0) * (j1 - j) +
        heightMap[i1][j1] * (i - i0) * (j - j0)
    );
  };
  const d = Terrain.MAX4 / 2;
  return $.Deferred(function (deferred) {
    (function outline(i, j) {
      window.setTimeout(function () {
        const height = sample(i, j);
        for (var k = min; k < height; k++) {
          outliner.set(j - d, k, i - d, Voxel.TYPES.DIRT);
        }
        outliner.set(j - d, height, i - d, Voxel.TYPES.GRASS);
        deferred.notify(i * Terrain.MAX + j % Terrain.MAX);
        if (j < Terrain.MAX4) {
          outline(i, j + 1);
        } else if (i < Terrain.MAX4) {
          outline(i + 1, 0);
        } else {
          deferred.resolve();
        }
      }, 0);
    }(0, 0));
  });
};

Terrain._mod = function (i) {
  return Math.abs(i % Terrain.SPAN);
};

Terrain._ds = function (heightMap, i0, j0, i1, j1) {
  if (i1 > i0 + 1 && j1 > j0 + 1) {
    const i = (i0 + i1) >> 1;
    const j = (j0 + j1) >> 1;
    const d = i1 - i0;
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
