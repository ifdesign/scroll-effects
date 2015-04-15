// pm.utils //////////////////////////////////////////////////////////////////////
if (!window.icr) window.icr = {}; // ns

(function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']){
    module['exports'] = make();
  }
  else {
    root[name] = make();
  }
}(icr, 'utils', function() {
  var utils = {};

  function has3d() {
    if (!window.getComputedStyle) {
      return false;
    }

    var el = document.createElement('p'),
      has3d,
      transforms = {
        'webkitTransform':'-webkit-transform',
        'OTransform':'-o-transform',
        'msTransform':'-ms-transform',
        'MozTransform':'-moz-transform',
        'transform':'transform'
      };

    // Add it to the body to get the computed style.
    document.body.insertBefore(el, null);

    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = "translate3d(1px,1px,1px)";
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
    }

    document.body.removeChild(el);

    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }

  // Expose methods/properties.
  utils['has3d'] = has3d;

  // Return object.
  return utils;

}));