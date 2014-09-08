/**
 *    bby.ui.lightbox
 *    Best Buy User Interface Widgets: Lightbox
 */
bby.requires('bby.page.layout', function() {
    var lb = {
        build: {
            date: '20101005',
            number: '1626'
        },
        options: {
            prefix: 'bbyuilb',
            header: true,
            title: '',
            css: {
                'z-index': 1000,
                'width': '700px'
            },
            reuseWindow: true,
            autoPosition: true
        },
        setOptions: function(options) {
            if (typeof(options) !== 'undefined') {
                bby.mergeObjects(options, lb.options);
                /*
                 if (typeof(options.prefix) !== 'undefined') lb.options.prefix = options.prefix;
                 if (typeof(options.zStart) !== 'undefined') lb.options.zStart = options.zStart;
                 if (typeof(options.prefix) !== 'undefined') lb.options.prefix = options.prefix;
                 if (typeof(options.header) === 'boolean') lb.options.header = options.header;
                 if (typeof(options.title) !== 'undefined') lb.options.title = options.title;
                 if (typeof(options.width) !== 'undefined') lb.options.width = options.width;
                 if (typeof(options.reuseWindow) === 'boolean') lb.options.reuseWindow = options.reuseWindow;
                 */
            }
        },
        create: function(options, content) {
            if (document.getElementById(lb.prefix + '-wrapper') === null) {
                lb.setOptions(options);
                var body = $("body");
                body.append('<div id="' + lb.options.prefix + '-wrapper" style="display:none"><div id="' +
                        lb.options.prefix + '-fog"/><div id="' + lb.options.prefix + '-container"><div id="' +
                        lb.options.prefix + '-box"></div></div></div>');
                var fog = $('#' + lb.options.prefix + '-fog');
                fog.height(body.height()).width('100%');
                fog.css({'z-index':lb.options.css['z-index'],'position':'absolute','top':'0','left':'0','background-color':'#333333','opacity':'0.5'});
                var container = $('#' + lb.options.prefix + '-container').css({
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'width': '100%',
                    'text-align': 'center',
                    'color': '#49494a',
                    'z-index': lb.options.css['z-index'] + 1
                });
                var box = $('#' + lb.options.prefix + '-box').css({
                    'border': '4px #c3c4c4 solid',
                    'background-color': 'white',
                    'text-align': 'left',
                    'margin': '0 auto',
                    'box-shadow': '0px 0px 20px #333',
                    '-moz-box-shadow': '0px 0px 20px #333',
                    '-webkit-box-shadow': '0px 0px 20px #333'
                });
                box.css(lb.options.css);
                if (lb.options.header) {
                    box.append('<style type="text/css">#' + lb.options.prefix +
                            '-hdr {background-color: #e7e7e7; border-bottom: 1px #c3c4c4 solid; padding: 10px; height: 12px;} #' +
                            lb.options.prefix +
                            '-hdr .close-btn {float: right; position: relative; top: -10px; margin-bottom: -10px;} #' +
                            lb.options.prefix + '-hdr .close-btn a:HOVER{text-decoration: underline;} #' +
                            lb.options.prefix + '-hdr .close-btn img {position: relative; top: 6px;} #' +
                            lb.options.prefix +
                            '-hdr h2 {text-transform: uppercase; font-size: 11px; padding: 0; margin: 0;}</style>');
                    box.append('<div id="' + lb.options.prefix +
                            '-hdr"><div class="close-btn"><a href="#" onclick="return bby.ui.lightbox.close()">close</a> <a href="#" onclick="return bby.ui.lightbox.close()"><img src="' +
                            imgServer + 'en_US/images/global/pcontent/ssi/button_close.gif"/></a></div><h2>' +
                            lb.options.title + '</h2></div>');
                }
                box.append('<div id="' + lb.options.prefix + '-main"></div>');
                if (typeof(content) !== 'undefined') {
                    if (typeof(content) === 'string') {
                        $('#' + lb.options.prefix + '-main').append(content);
                    } else {
                        if (typeof(content) === 'object') {
                            content.children().appendTo('#' + lb.options.prefix + '-main');
                        }
                    }
                }
            }
        },
        show: function() {
            if (lb.options.autoPosition) {
                var box = $('#' + lb.options.prefix + '-box');
                var sizes = bby.page.layout.getPageSize();
                var scroll = bby.page.layout.getPageScroll();
                var lbTop = scroll.y + (sizes.window.height / 10);
                box.css({position: 'relative', top: lbTop});
            }
            if ($.browser.msie && $.browser.version == '6.0') {
                $("select").hide();
            }
            $('#' + lb.options.prefix + '-wrapper').show();
        },
        close: function() {
            var wrapper = $('#' + lb.options.prefix + '-wrapper');
            if (lb.options.reuseWindow) {
                wrapper.hide();
            } else {
                wrapper.remove();
            }
            if ($.browser.msie && $.browser.version == '6.0') {
                $("select").show();
            }
            return false;
        }
    };
    bby.initNS('bby.ui.lightbox', lb);
});