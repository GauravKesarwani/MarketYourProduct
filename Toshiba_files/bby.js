/**
 * @author Nate Ashford (a028672)
 *
 * Defines base bby namespace and establishes infrastructure for
 * loading dependent namespaces.
 *
 * @version bby.js v1.0.6 Last Modified 20101015
 *
 * v1.0.6 --NA
 * Bug fix: invalid reference in mergeObjects
 * v1.0.5 --NA
 * Bug fix: namespace loaded multiple times when delayed loading
 * Bug fix: merge existing child namespaces to loaded namespace
 * Blocked bby.abt.tnt.mbox from espanol
 * v1.0.4 --NA
 * Added requires for Test & Target Mbox code
 * v1.0.3 --NA
 * Added bby.page.isCart
 * v1.0.2 --NA
 * Bug fix for callback for multiple pre-loaded dependencies
 * v1.0.1 --NA
 * Added addToDelayedQueue method
 * Added bby.page namespace for page property detection
 * Exposed addToNSList
 * v1.0.0 --NA
 * Added logError method and debug flag
 * v0.9.3 --NA
 * Added default fireDelayedQueue into document.ready event
 * v0.9.2 --NA
 * Added version to options
 * v0.9.1 --NA
 * Bugfixes
 * Combined in bby.cookie namespace --NA
 * v0.9.0 --NA
 * Initial checkin
 */
(function() {
    var build = {
        date: '20101015',
        number: '1684',
        version: 'v1.0.6'
    };
    if (typeof(bby) === 'undefined') {
        bby = {};
    }
    var LOADER = {
        /**
         * Base url for loading scripts. Calculated in init from location of current script.
         */
        baseUrl:'',
        /**
         * List of namespaces that have been initialized.
         */
        nsList:{},
        /**
         * Manages namespaces to load low in the page.
         */
        delay: {
            queue: [],
            fired: false
        },
        debug: /debug=yes/.test(window.location.search),
        /**
         * Initialization method
         */
        init: function() {
            LOADER.baseUrl = (typeof(imgServer) === 'undefined' ? '' : imgServer) + "js/";
        },
        /**
         * Writes errors to console.log (or alerts if no console.log) in debug mode, otherwise squelches them.
         */
        logError: function(e) {
            if (LOADER.debug) {
                if (typeof(console) !== 'undefined' && typeof(console.log) !== 'undefined') {
                    console.log(e);
                } else {
                    alert(e);
                }
            }
        },
        /**
         * Copies fields from source object to target object.
         */
        mergeObjects: function(source, target) {
            for (field in source) {
                switch (typeof(source[field])) {
                    case 'object':
                        if (typeof(target[field]) === 'undefined') {
                            target[field] = source[field];
                        } else {
                            LOADER.mergeObjects(source[field], target[field]);
                        }
                        break;
                    case 'undefined':
                        break;
                    default:
                        target[field] = source[field];
                }
                //if (typeof (source[field]) !== 'undefined') target[field] = source[field];
            }
        },

        /**
         * Adds the specified namespace to the managed list
         * @param ns The namespace to add
         * @param inprocess Optional parameter to indicate that the namespace is already in process of loading
         */
        addToNSList: function(ns, inprocess) {
            if (typeof(inprocess) === 'undefined' || inprocess == null) {
                inprocess = false;
            }
            try {
                if (!(ns in LOADER.nsList)) {
                    LOADER.nsList[ns] = {
                        callbacks:[],
                        loaded:false,
                        inprocess: inprocess
                    };
                }
            } catch(e) {
                LOADER.logError(e);
            }
        },
        /**
         * Registers a one-time callback for a namespace
         */
        addCallback: function(ns, callback) {
            try {
                this.addToNSList(ns);
                this.nsList[ns].callbacks.push(callback);
            } catch(e) {
                LOADER.logError(e);
            }
        },
        /**
         * Fires each registered callback, removing each one as it goes.
         */
        fireCallbacks: function(ns) {
            try {
                if (ns in this.nsList) {
                    var cbList = this.nsList[ns].callbacks;
                    var cb;
                    while (cbList.length > 0) {
                        cb = cbList.shift();
                        if (typeof(cb) === 'function') {
                            cb();
                        }
                    }
                }
            } catch(e) {
                LOADER.logError(e);
            }
        },
        isLoaded: function(ns) {
            try {
                if (ns in LOADER.nsList) {
                    return LOADER.nsList[ns].loaded;
                }
            } catch(e) {
                LOADER.logError(e);
            }
            return false;
        },
        isInProcess: function(ns) {
            try {
                if (ns in this.nsList) {
                    return this.nsList[ns].inprocess;
                }
            } catch(e) {
                LOADER.logError(e);
            }
            return false;
        },
        /**
         * Private recursive method for initializing a namespace with an object.
         * All missing parent namespaces are initialized along the way.
         * @param base The namespace location from which this iteration is operating. On initial call, this should be <code>window</code>
         * @param parts The array of strings produced when the namespace path is split around the dots.
         * @param index Indicates the iteration depth as well as the index into parts that is being operated on.
         * @param object The object to which the namespace should be initialized.
         */
        rInitNS: function(base, parts, index, object) {
            try {
                var part = parts[index];
                if (index >= parts.length - 1) {
                    // If it already exists, copy the existing fields onto the new object
                    if (typeof(base[part]) !== 'undefined') {
                        LOADER.mergeObjects(base[part], object);
                    }
                    base[part] = object;
                } else {
                    if (typeof(base[part]) !== 'object') {
                        base[part] = {};
                    }
                    this.rInitNS(base[part], parts, index + 1, object);
                }
            } catch(e) {
                LOADER.logError(e);
            }
        },
        /**
         * Public method for initializing a namespace with an object.
         * All missing parent namespaces are initialized along the way, and the namespace
         * is registered as having been initialized.
         * @param ns The string representation of the namespace to be initialized.
         * @param object The object to which the namespace should be initialized.
         */
        initNS: function(ns, object) {
            try {
                LOADER.rInitNS(window, String(ns).split(/\./), 0, object);
                LOADER.addToNSList(ns);
                LOADER.nsList[ns].loaded = true;
                LOADER.nsList[ns].inprocess = true;
                LOADER.fireCallbacks(ns);
            } catch(e) {
                LOADER.logError(e);
            }
        },
        /**
         * Loads a namespace
         * @param ns The string representation of the namespace to be loaded.
         * @param options Container for the parameters that follow:
         * @param minified Specifies if the minified version should be loaded.
         * @param delayed Specifies if loading should be delayed until the page has loaded.
         * @param baseUrl Specifies the url to the repository base for locating the namespace code.
         * @param version Specifies an additional cache-busting version number to be applied to the url.
         */
        loadNS: function(ns, options) {//minified, delayed, baseUrl) {
            try {
                if (typeof(options) === 'undefined') {
                    options = {baseUrl:this.baseUrl};
                } else {
                    if (typeof(options.baseUrl) === 'undefined') {
                        options.baseUrl = this.baseUrl;
                    }
                }
                var nsState = this.nsList[ns];
                if (!nsState.inprocess) {
                    nsState.inprocess = true;
                    var f = function() {
                        var script = document.createElement('script');
                        var src = options.baseUrl + String(ns).replace(/\./g, '/') +
                                (options.minified && !LOADER.debug ? '-min' : '') + '.js?d=' + sysdt;
                        if ('version' in options) {
                            src += '&v=' + options.version;
                        }
                        script.src = src;
                        document.getElementsByTagName('head')[0].appendChild(script);
                    };
                    if (true === options.delayed && false === LOADER.delay.fired) {
                        LOADER.addToDelayedQueue(f);
                    } else {
                        f();
                    }
                }
            } catch(e) {
                LOADER.logError(e);
            }
        },
        /**
         * Pushes closure onto the delayed queue
         * Needed for allowing namespaces that load early to register themselves delayed
         */
        addToDelayedQueue: function(f) {
            LOADER.delay.queue.push(f);
        },
        /**
         * Fires each delayed load function, and empties the queue
         */
        fireDelayedQueue: function() {
            try {
                if (!LOADER.delay.fired) {
                    LOADER.delay.fired = true;
                    var f;
                    while (LOADER.delay.queue.length > 0) {
                        f = LOADER.delay.queue.shift();
                        if (typeof(f) === 'function') {
                            f();
                        }
                    }
                }
            } catch(e) {
                LOADER.logError(e);
            }
        },
        /**
         * Checks to see if the all of the specified namespaces have loaded.
         */
        allLoaded: function(ns) {
            var ready = true;
            if (ns.constructor == Array) {
                for (var i = 0; i < ns.length; i++) {
                    if (!LOADER.isLoaded(ns[i])) {
                        ready = false;
                        break;
                    }
                }
            } else {
                ready = LOADER.isLoaded(ns);
            }
            return ready;
        },
        /**
         * Declares a dependency on one or more namespaces. If callback
         * is specified, it will be called when all dependencies are met.
         * @param ns String or Array of Strings listing namespace(s) as dependencies
         * @param callback Function to execute when dependencies are met
         * @param options Container for the parameters that follow:
         * @param minified Specifies if the minified version should be loaded.
         * @param delayed Specifies if loading should be delayed until the page has loaded.
         * @param baseUrl Specifies the url to the repository base for locating the namespace code.
         * @param version Specifies an additional cache-busting version number to be applied to the url.
         */
        requires: function(ns, callback, options) {
            try {
                if (typeof(options) === 'undefined') {
                    options = {};
                }
                if (!('minified' in options)) {
                    options.minified = true;
                }
                if (!('delayed' in options)) {
                    options.delayed = true;
                }
                if (!('baseUrl' in options)) {
                    options.baseUrl = LOADER.baseUrl;
                }

                if (ns.constructor == Array) {
                    if (!LOADER.allLoaded(ns)) {
                        var arrCB = function() {
                            if (LOADER.allLoaded(ns) && typeof(callback) === 'function') {
                                callback();
                            }
                        };
                        for (var i = 0; i < ns.length; i++) {
                            this.requires(ns[i], arrCB, options);
                        }
                    } else {
                        if (typeof(callback) === 'function') {
                            callback();
                        }
                    }
                } else {
                    if (!LOADER.isLoaded(ns)) {
                        if (typeof(callback) === 'function') {
                            LOADER.addCallback(ns, callback);
                        } else {
                            LOADER.addToNSList(ns);
                        }
                        LOADER.loadNS(ns, options);
                    } else {
                        if (typeof(callback) === 'function') {
                            callback();
                        }
                    }
                }
            } catch(e) {
                LOADER.logError(e);
            }
        }
    }
    LOADER.init();

    bby.initNS = LOADER.initNS;
    bby.requires = LOADER.requires;
    bby.isLoaded = LOADER.isLoaded;
    bby.addToNSList = LOADER.addToNSList;
    bby.addToDelayedQueue = LOADER.addToDelayedQueue;
    bby.fireDelayedQueue = LOADER.fireDelayedQueue;
    bby.logError = LOADER.logError;
    bby.mergeObjects = LOADER.mergeObjects;
    //bby.loader = LOADER;

    /*
     * This is a catch-all that will trigger the delayed queue if it doesn't
     * otherwise get fired in the page.
     */
    if (jQuery) {
        jQuery(document).ready(function() {
            bby.fireDelayedQueue();
        });
    }
})();
/**
 *    bby.page
 *    Best Buy Page Utilities
 */
(function() {
    bby.addToNSList('bby.page', true);
    var p = {
        isPDP:false,
        isList:false,
        isCart:false,
        isCategory:false,
        isDepartment:false,
        hasFacets:false
    }
    bby.addToDelayedQueue(function() {
        p.isPDP = (document.getElementById('productsummary') !== null) ? true : false;
        p.isList = (document.getElementById('listView') !== null) ? true : false;
        if (typeof(templateName) != 'undefined') {
            p.isCategory = /ABCH/.test(templateName) ? true : false;
            p.isDepartment = /ABDT/.test(templateName) ? true : false;
            p.isCart = /CRT/.test(templateName) ? true : false;
        }
        p.hasFacets = (document.getElementById('searchnav') !== null) ? true : false;
        /* Not used yet, but will be used in a future project) */
        bby.initNS('bby.page', p);
    });
})();
/**
 *    bby.cookie
 *    Best Buy Cookie Utilities
 */
(function() {
    var c = {
        /**
         *
         */
        read:function(name) {
            var cookieName = name + "=";
            var cookieArray = document.cookie.split(';');
            for (var i = 0; i < cookieArray.length; i++) {
                var c = cookieArray[i];
                c = c.replace(/^\s+/g, '');
                if (c.indexOf(cookieName) == 0) {
                    return c.substring(cookieName.length, c.length);
                }
            }
            return null;
        },
        /**
         * Writes a cookie with the specified name and value which expires the
         * specified number days from the current date. If <code>expiredays</code>
         * is null or undefined, the cookie will be a session cookie.
         *
         * Cookie domain is set to ".bestbuy.com"
         *
         * @param name Cookie name
         * @param value Cookie value
         * @param expiredays Number of days before cookie expires (null or undefined for session cookie)
         */
        write:function(name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = name + "=" + escape(value) + ";path=/;domain=.bestbuy.com" +
                    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
        }
    };
    bby.initNS('bby.cookie', c);
})();