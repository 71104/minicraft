function View() {}

View.project = function (i, j, k) {
  return {
    x: i * 24 + j * 24,
    y: j * 12 - i * 12 - k * 24,
    z: j - i + k,
  };
};

View.unproject = function (x, y) {
  return function (k) {
    return {
      i: Math.floor((x - y * 2 - k * 48) / 48),
      j: Math.floor((x + y * 2 + k * 48) / 48),
      k: k,
    };
  };
};
