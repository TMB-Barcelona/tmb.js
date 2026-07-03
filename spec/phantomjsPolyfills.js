if (typeof Object.assign !== 'function') {
  Object.assign = function(target) {
    var output = Object(target);

    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      if (source !== null && source !== undefined) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            output[key] = source[key];
          }
        }
      }
    }

    return output;
  };
}
