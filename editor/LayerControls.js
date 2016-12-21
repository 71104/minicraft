function LayerControls(stage) {
  this._stage = stage;
}

LayerControls.prototype.renderOne = function (k) {
  const icon = $('<span>').addClass('ui-icon').addClass('ui-icon-close');
  const button = $('<button>').append(icon).button().click(function () {
    this._stage.eraseLayer(k, function (count) {
      return !count || window.confirm(
        `Layer ${k} contains ${count} tiles. Do you want to erase all of them?`
        );
    });
    this._stage.render();
  }.bind(this));
  return $('<tr>')
    .append($('<td>').append($('<input>', {
      type: 'checkbox',
      name: 'enabled',
      checked: true,
    })))
    .append($('<td>').text('Layer ' + k))
    .append($('<td>').append(button))
    .toggleClass('ui-state-active', k === this._stage.selectedLayer)
};

LayerControls.prototype.renderAll = function () {
  const table = $('#layer-controls table').empty();
  for (var k = this._stage.maxLayer(); k >= this._stage.minLayer(); k--) {
    table.append(this.renderOne(k));
  }
  return table;
};
