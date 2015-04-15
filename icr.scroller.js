// icr.scroller ///////////////////////////////////////////////////////////////
/*
 * Performant scrolling implementation concept is credited to Kirupa:
 * http://www.kirupa.com/html5/smooth_parallax_scrolling.htm
 */
if (!window.icr) window.icr = {}; // ns

(function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']){
    module['exports'] = make();
  }
  else {
    root[name] = make();
  }
}(icr, 'scroller', function() {

    // Disbale parallax effect on old browsers (IE8 in particular).
    // This would target IE9+ only.
    if (!window.addEventListener)
        throw 'Scroller is not compatible with current browser: no addEventListener method available.';

    // Init aniimation variables.
    var d = new Date(),
        ts = d.getTime(),
        scroller = {},
        initialized = false,
        animating = null,
        scrolling = false,
        mouseWheelActive = false,
        count = 0,
        mouseDelta = 0,
        tstart = {x:0,y:0},
        onScrollHandlers = [];

    // Init scroller events.
    function init()
    {
        // Initialized only once.
        if (initialized)
            return;

        // Make requestAnimationFrame compatible with all browsers.
        window.requestAnimationFrame = (function()
        {
            return window.requestAnimationFrame     ||
                window.webkitRequestAnimationFrame  ||
                window.mozRequestAnimationFrame     ||
                window.msRequestAnimationFrame      ||
                function( callback ) { return window.setTimeout( callback, 0); };
        })();

        // Make cancelAnimationFrame compatible with all browsers.
        window.cancelAnimationFrame = (function()
        {
            return window.cancelAnimationFrame      ||
                window.webkitCancelAnimationFrame   ||
                window.mozCancelAnimationFrame      ||
                window.msCancelAnimationFrame       ||
                function( intervalKey ) { window.clearTimeout( intervalKey ); };
        })();

        addEventListeners();
        initialized = true;
    }

    function start()
    {
        animate();
    }

    function stop()
    {
        cancelAnimationFrame(animating);
    }

    function addEventListeners()
    {
        // Add scroll/touch/mousewheel listeners.
        window.addEventListener("scroll", setScrolling, false);
        //window.addEventListener("mousewheel", mouseScroll, false);
        //window.addEventListener("DOMMouseScroll", mouseScroll, false);
        //window.addEventListener("touchstart", touchStart, false);
        //window.addEventListener("touchmove", touchMove, false);
    }

    function removeEventListeners()
    {
        window.removeEventListener("scroll", setScrolling, false);
        window.removeEventListener("mousewheel", mouseScroll, false);
        window.removeEventListener("DOMMouseScroll", mouseScroll, false);
        //window.removeEventListener("touchstart", touchStart, false);
        //window.removeEventListener("touchmove", touchMove, false);
    }

    function touchStart(e)
    {
        tstart.x = e.touches[0].pageX;
        tstart.y = e.touches[0].pageY;
    }

    function touchMove(e)
    {
        // Cancel the default scroll behavior.
        if (e.preventDefault)
        {
            e.preventDefault();
        }

        offset = {};
        offset.x = tstart.x - e.touches[0].pageX;
        offset.y = tstart.y - e.touches[0].pageY;
    }

    function mouseScroll(e)
    {
        mouseWheelActive = true;

        // Cancel the default scroll behavior.
        if (e.preventDefault)
        {
            e.preventDefault();
        }

        // Deal with different browsers calculating the delta differently.
        if (e.wheelDelta)
        {
            mouseDelta = e.wheelDelta / 120;
        }
        else if (e.detail)
        {
            mouseDelta = -e.detail / 3;
        }
    }

    // Called when a scroll is detected.
    function setScrolling()
    {
        scrolling = true;
    }

    // Cross-browser way to get the current scroll position.
    //function getScrollPosition()
    //{
    //    if (document.documentElement.scrollTop == 0)
    //        return document.body.scrollTop;
    //    else
    //        return document.documentElement.scrollTop;
    //}

    // Launch the animation loop.
    function animate()
    {
        // Adjust the image's position when scrolling.
        if (scrolling)
        {
            var handlers = onScrollHandlers;

            for (var i = 0; i < handlers.length; i++)
            {
                handlers[i].call(this, arguments);
            }

            scrolling = false;
        }

        // Scroll up or down by 10 pixels when the mousewheel is used.
        if (mouseWheelActive)
        {
            window.scrollBy(0, - mouseDelta * 10);
            count++;

            // Stop the scrolling after a few moments.
            if (count > 200)
            {
                count = 0;
                mouseWheelActive = false;
                mouseDelta = 0;
            }
        }

        animating = requestAnimationFrame(animate);
    }

    function onScroll(callback)
    {
        onScrollHandlers.push(callback);
    }

    // Expose methods/properties.
    scroller['init'] = init;
    scroller['start'] = start;
    scroller['stop'] = stop;
    scroller['onScroll'] = onScroll;
    scroller['removeEventListeners'] = removeEventListeners;

    // Return object.
    return scroller;
}));