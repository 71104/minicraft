function TileEditorControls() {
  this._topTextureIndex = 0;
  this._sideTextureIndex = 0;
  this._bottomTextureIndex = 0;
  this._setup();
}

TileEditorControls.prototype._setup = function () {
  $('#tile-dialog').tabs().dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      Cancel: function () {
        $(this).dialog('close');
      },
    },
  });
  $('#create-voxel').button().click(function () {
    // TODO
  });
};

TileEditorControls.prototype.show = function () {
  $('#tile-dialog').dialog('open');
};
