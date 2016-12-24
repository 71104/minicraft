$.loadImage = function (url) {
  return $.Deferred(function (deferred) {
    var image = new Image();
    image.onload = function () {
      image.onload = null;
      image.onerror = null;
      deferred.resolve(image);
    };
    image.onerror = function () {
      image.onload = null;
      image.onerror = null;
      deferred.reject();
    };
    image.src = url;
  });
};
