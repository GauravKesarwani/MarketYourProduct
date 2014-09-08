/**
 *    bby.page.layout
 *    Best Buy User Page Layout Utilities
 */
(function() {
    var l = {
        build: {
            date: '20100928',
            number: '1549'
        },
        getPageSize: function() {
            var xScroll, yScroll;
            if (window.innerHeight && window.scrollMaxY) {
                xScroll = window.innerWidth + window.scrollMaxX;
                yScroll = window.innerHeight + window.scrollMaxY;
            } else {
                if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
                    xScroll = document.body.scrollWidth;
                    yScroll = document.body.scrollHeight;
                } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
                    xScroll = document.body.offsetWidth;
                    yScroll = document.body.offsetHeight;
                }
            }

            var windowWidth, windowHeight;
            if (self.innerHeight) {    // all except Explorer
                if (document.documentElement.clientWidth) {
                    windowWidth = document.documentElement.clientWidth;
                } else {
                    windowWidth = self.innerWidth;
                }
                windowHeight = self.innerHeight;
            } else {
                if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
                    windowWidth = document.documentElement.clientWidth;
                    windowHeight = document.documentElement.clientHeight;
                } else {
                    if (document.body) { // other Explorers
                        windowWidth = document.body.clientWidth;
                        windowHeight = document.body.clientHeight;
                    }
                }
            }

            var pageWidth, pageHeight;
            // for small pages with total height less then height of the viewport
            if (yScroll < windowHeight) {
                pageHeight = windowHeight;
            } else {
                pageHeight = yScroll;
            }
            // for small pages with total width less then width of the viewport
            if (xScroll < windowWidth) {
                pageWidth = xScroll;
            } else {
                pageWidth = windowWidth;
            }
            return {page: {width: pageWidth, height: pageHeight}, window: {width: windowWidth, height: windowHeight}};
        },
        getPageScroll: function() {
            var xScroll, yScroll;
            if (self.pageYOffset) {
                yScroll = self.pageYOffset;
                xScroll = self.pageXOffset;
            } else {
                if (document.documentElement && document.documentElement.scrollTop) {     // Explorer 6 Strict
                    yScroll = document.documentElement.scrollTop;
                    xScroll = document.documentElement.scrollLeft;
                } else {
                    if (document.body) {// all other Explorers
                        yScroll = document.body.scrollTop;
                        xScroll = document.body.scrollLeft;
                    }
                }
            }
            return {x: xScroll, y: yScroll};
        }
    };
    bby.initNS('bby.page.layout', l);
})();