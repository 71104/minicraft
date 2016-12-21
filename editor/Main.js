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

    const tools = {
      drag: new DragTool(view, stage),
      pencil: new PencilTool(view, stage),
      eraser: new EraserTool(view, stage),
      fill: new FillTool(view, stage),
    };

    var tool = tools.drag;

    $('#tool-group input[name=tool]').click(function () {
      tool = tools[$(this).data('tool')];
    });

    var dragging = false;

    canvas.on('mousedown', function (event) {
      dragging = true;
      if (tool.down && tool.down(event.clientX, event.clientY)) {
        stage.render();
      }
    }).on('mousemove', function (event) {
      if (dragging) {
        if (tool.drag && tool.drag(event.clientX, event.clientY)) {
          stage.render();
        }
      } else {
        if (tool.move && tool.move(event.clientX, event.clientY)) {
          stage.render();
        }
      }
    }).on('mouseup', function (event) {
      dragging = false;
      if (tool.up && tool.up(event.clientX, event.clientY)) {
        stage.render();
      }
    });
  });

});
