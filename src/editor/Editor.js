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

  const view = new View(context, width, height);

  $.loadImage('tile.png').then(function (tile) {
    const stage = new Stage(tile, view);
    stage.render();
    canvas.click(function (event) {
      const {i, j, k} = View.unproject(event.clientX, event.clientY)(0);
      stage.set(i, j, k, 1);
      stage.render();
    });
  });

});
