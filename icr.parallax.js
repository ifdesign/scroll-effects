// icr.parallax ///////////////////////////////////////////////////////////////
if (!window.icr) window.icr = {}; // ns

(function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']){
    module['exports'] = make();
  }
  else {
    root[name] = make();
  }
}(icr, 'parallax', function() {

    var parallax = {},
        elements = [],
        vpUtils  = icr.utils.viewport,
        has3d    = icr.utils.has3d(),
        transforms = [
            "transform",
            "msTransform",
            "webkitTransform",
            "mozTransform",
            "oTransform"],
        transformProperty = (function()
        {
            for (var i = 0; i < transforms.length; i++)
            {
                if (typeof document.body.style[transforms[i]] != "undefined")
                {
                    return transforms[i];
                }
            }
            return null;
        })();

    function elementExists(container)
    {
        for (var i = 0; i < elements.length; i++)
            if (elements[i].container === container)
                return true;

        return false;
    }

    function getParallaxed(container, selector)
    {
        return container.querySelector(element.selector);
    }

    function pushElement(container, selector, speed, reverse, fake)
    {
        // Adjust initial transform position.
        if (!fake)
        {
            applyTransform(container, selector, getOffset(container, speed));
        }

        if (!elementExists(container))
        {
            elements.push({
                container: container,
                selector: selector,
                speed: speed,
                fake: fake,
                reverse: reverse});
        }
    }

    function applyTo(containers, parallaxedSelector, speed, reverse, fake)
    {
        var rev = typeof reverse == 'boolean' ? reverse : false;

        if (Object.prototype.toString.call(containers) == '[object Array]' ||
            Object.prototype.toString.call(containers).indexOf('List') != -1)
        {
            for (var i = 0; i < containers.length; i++)
            {
                pushElement(containers[i], parallaxedSelector, speed, reverse, fake);
            }
        }
        else
        {
            pushElement(containers, parallaxedSelector, speed, reverse, fake);
        }
    }

    function getOffset(container, speed)
    {
        var wt = vpUtils.winTop(),
            wh = vpUtils.winHeight(),
            et = vpUtils.getTop(container);

        return offset = (et - wt - wh) / speed;
    }

    function applyTransform(container, selector, offset)
    {
        var parallaxed = container.querySelector(selector);

        if (has3d)
        {
            parallaxed.style[transformProperty] = "translate3d(0px" + ", " + offset + "px" + ", 0)";
        }
        else
        {
            parallaxed.style.marginTop = offset + 'px';
        }
    }

    function registerInScroller()
    {
        // Define the parallax effect and register it on the scroller object.
        icr.scroller.onScroll(function()
        {
            var elements = icr.parallax.elements;

            for (var i = 0; i < elements.length; i++)
            {
                var element = elements[i];

                if ((vpUtils.enteredViewport(element.container) ||
                    vpUtils.isInViewport(element.container)) &&
                    !vpUtils.leftViewport(element.container))
                {
                    var direction = element.reverse ? -1 : 1,
                        offset    = getOffset(element.container, element.speed);

                    if (element.fake)
                    {
                        offset = direction * vpUtils.winTop() / element.speed;
                    }

                    applyTransform(element.container, element.selector, (direction * offset));
                }
            }
        });
    }

    // Expose methods/properties.
    parallax['elements'] = elements;
    parallax['applyTo'] = applyTo;
    parallax['registerInScroller'] = registerInScroller;

    // Return object.
    return parallax;
}));