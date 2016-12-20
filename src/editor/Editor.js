$(function () {
  $('#toolbar #tool-group').controlgroup();
  $('#toolbar #tool-group input').checkboxradio({
    icon: false,
  });

  const canvas = $('canvas#canvas');
  const width = canvas.width();
  const height = canvas.height();
  canvas.attr({
    width: width,
    height: height,
  });

  const context = canvas.get(0).getContext('2d');

  const grid = new Grid(width, height);

  var x0 = 0;
  var y0 = 0;

  function render(tile) {
    context.setTransform(1, 0, 0, 1, -x0, -y0);
    context.clearRect(x0, y0, width, height);
    grid.each(x0, y0, function (x, y, type) {
      context.drawImage(tile, x, y);
    });
  }

  $.loadImage('tile.png').then(function (tile) {
    canvas.click(function (event) {
      const {i, j, k} = View.unproject(event.clientX, event.clientY)(0);
      grid.set(i, j, k, 1);
      render(tile);
    });
  });

});
