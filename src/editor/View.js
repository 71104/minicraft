function View() {}

View.project = function (i, j, k) {
  return {
    x: i * 24 + j * 24,
    y: j * 12 - i * 12 - k * 24,
  };
};

View.unproject = function (x, y) {
  return function (k) {
    // TODO
  };
};
