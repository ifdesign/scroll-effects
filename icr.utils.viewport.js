// icr.utils.viewport ///////////////////////////////////////////////////////////////
if (!window.icr) window.icr = {}; // ns
if (!window.icr.utils) window.icr.utils = {}; // ns

(function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']){
    module['exports'] = make();
  }
  else {
    root[name] = make();
  }
}(icr.utils, 'viewport', function() {

    var viewport = {};

    function getElementPosition(el)
    {
      var l = 0, t = 0;

      while (el.offsetParent)
      {
        l += el.offsetLeft;
        t += el.offsetTop;
        el = el.offsetParent;
      }

      return {left:l, top:t};
    }

    function getDocumentHeight()
    {
      var body = document.body,
          html = document.documentElement;

      return Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );
    }

    function getTop(el)    { return getElementPosition(el).top }
    function getHeight(el) { return el.clientHeight }
    function winTop()      { return window.pageYOffset }
    function winHeight()   { return window.innerHeight }

    // Element's bottom edge is visible.
    function isInViewport(element)
    {
        return winTop() + winHeight() >= getTop(element) + getHeight(element)
            && winTop() <= getTop(element) + getHeight(element);
    }

    // Element's top edge is visible.
    function enteredViewport(element)
    {
        return getTop(element) - winTop() <= winHeight();
    }

    // Element's top edge is upside the viewport.
    function leavingViewport(element)
    {
        return winTop() > getTop(element) && winTop() <= getTop(element) + getHeight(element);
    }

    // Element's bottom edge is upside the viewport.
    function leftViewport(element)
    {
        return winTop() > getTop(element) + getHeight(element);
    }

    // Expose methods/properties.
    viewport['getElementPosition'] = getElementPosition;
    viewport['getDocumentHeight'] = getDocumentHeight;
    viewport['getTop'] = getTop;
    viewport['getHeight'] = getHeight;
    viewport['winTop'] = winTop;
    viewport['winHeight'] = winHeight;
    viewport['isInViewport'] = isInViewport;
    viewport['enteredViewport'] = enteredViewport;
    viewport['leavingViewport'] = leavingViewport;
    viewport['leftViewport'] = leftViewport;

    // Return object.
    return viewport;
}));