(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.Mshare = factory())
}(this, function() {
    'use strict'

    var userAgent = window.navigator.userAgent
    var qrCodeImg = '',
        configLink = '';
    var util = {
        loadScript: function loadScript(url, callback) {
            var doc = document
            var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement
            var script = doc.createElement('script')
            script.type = 'text/javascript'
            script.charset = 'utf-8'
            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (/loaded|complete/i.test(script.readyState)) {
                        script.onreadystatechange = null
                        callback && callback.call(this)
                    }
                }
            } else {
                script.onload = function() {
                    callback && callback.call(this)
                }
            }
            script.src = url
            head.insertBefore(script, head.firstChild)
        },
        execStyle: function execStyle(cssText) {
            var document = window.document
            var styleTag = document.createElement('style')
            styleTag.setAttribute('type', 'text/css')
            if (document.all) {
                styleTag.styleSheet.cssText = cssText
            } else {
                styleTag.innerHTML = cssText
            }
            document.getElementsByTagName('head').item(0).appendChild(styleTag)
        },

        ua: {
            isFromAndroid: /android/gi.test(userAgent),
            isFromIos: /iphone|ipod|ios/gi.test(userAgent),
            isFromWx: /MicroMessenger/gi.test(userAgent),
            isFromQQ: /mobile.*qq/gi.test(userAgent),
            isFromUC: /ucbrowser/gi.test(userAgent),
            isFromQQBrower: /mqqbrowser[^LightApp]/gi.test(userAgent),
            isFromQQBrowerLight: /MQQBrowserLightApp/gi.test(userAgent)
        }
    }

    var style = {
        cssText: "\n .m-share-mask {\n    margin: 0;\n    padding: 0;\n    position: fixed;\n    left: 0;\n    bottom: 0;\n    z-index: 2147483646;\n    width: 100%;\n    height: 100%;\n    background: #000;\n    opacity: 0;\n    -webkit-transition: opacity .2s ease-in;\n    transition: opacity .2s ease-in;\n  }\n  #m-share-actionSheet {\n    margin: 0;\n border-top-left-radius: 10px;\n border-top-right-radius: 10px;\n   padding: 0;\n    font-family: \"PingFang SC\",Arial,\"\\5FAE\\8F6F\\96C5\\9ED1\",Helvetica,sans-serif;\n    position: fixed;\n    width: 100%;\n    left: 0;\n    bottom: 0;\n    z-index: 2147483647;\n    background: #fff;\n    -webkit-box-sizing: border-box;\n    box-sizing: border-box;\n    padding: 25px 20px 0;\n    -webkit-transform: translateY(100%);\n    transform: translateY(100%);\n    -webkit-transition: -webkit-transform .2s ease-in;\n    transition: transform .2s ease-in;\n  }\n  #m-share-actionSheet div {\n    margin: 0;\n    padding: 0;\n  }\n  #m-share-actionSheet .m-share-sheet-title {\n    font-size: 12px;\n    color: #ababab;\n    text-align: center;\n    margin:10px 0 0 0;\n  }\n  #m-share-actionSheet .m-share-flex {\n    display: -webkit-box!important;\n    display: -webkit-flex!important;\n    display: -ms-flexbox!important;\n    display: flex!important;\n    -webkit-flex-wrap: wrap;\n    -ms-flex-wrap: wrap;\n    flex-wrap: wrap\n  }\n  #m-share-actionSheet .m-share-flex>.m-share-cell {\n    -webkit-box-flex: 1;\n min-width:25%;\nmax-width:25%;\n   -webkit-flex: 1;\n    -ms-flex: 1;\n    flex: 1;\n    width: 0;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n   display: block;\n    padding: 0 0 30px 0;\n    position: relative;\n    text-align: center;\n  }\n  #m-share-actionSheet .m-share-iconfont {\n    margin: 0;\n  }\n  .m-share-tips {\n    font-family: \"PingFang SC\",Arial,\"\\5FAE\\8F6F\\96C5\\9ED1\",Helvetica,sans-serif;\n    margin: 0;\n    padding: 0;\n    position: fixed;\n    top: 3px;\n    color: #fff;\n    right: 20px;\n    z-index: 2147483647;\n    // background-color: #000;\n  }\n  .m-share-tips .m-share-tips-w {\n    margin: 0;\n    padding: 0;\n    display: inline-block;\n    font-size: 18px;\n    position: relative;\n    right: 1px;\n    top: 7px;\n  }\n  .m-share-tips .m-share-tips-w .m-share-tips-p {\n    margin: 0;\n    padding: 0;\n    color: #fff;\n    font-size: 18px;\n  }\n  .m-share-tips-arrow {\n    margin: 0;\n    padding: 0;\n    display: inline-block;\n    width: 54px;\n    height: 55px;\n  }\n  .m-share-tips-bottom {\n    font-family: \"PingFang SC\",Arial,\"\\5FAE\\8F6F\\96C5\\9ED1\",Helvetica,sans-serif;\n    margin: 0;\n    padding: 0;\n    font-size: 18px;\n    position: fixed;\n    color: #fff;\n    top: 50%;\n    left: 50%;\n    width: 100%;\n    z-index: 2147483647;\n    -webkit-transform: translate(-50%, -50%);\n    transform: translate(-50%, -50%);\n    text-align: center;\n    width: 240px;\n    line-height: 1.72;\n  }\n\n  .m-share-iconfont {\n    font-size:26px;\n    font-style:normal;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n   margin:0 0 0 10px;\n  }\n  .m-share-iconfont:first-child {\n    margin: 0;\n  }\n  .m-share-iconfont-wx {\n margin:0 auto!important; \n    display: block;\n    background:url('/static/images/icon-wx.png') no-repeat left top;\n background-size:100% 100%;\n    width:38px;\n height:38px;  }\n  .m-share-iconfont-sina {\n margin:0 auto!important; \n    display: block;\n background:url('/static/images/icon-weibo.png') no-repeat left top;\n background-size:100% 100%;\n    width:38px;\n height:38px;  }\n  .m-share-iconfont-qzone {\n margin:0 auto!important; \n    display: block;\n background:url('/static/images/icon-zone.png') no-repeat left top;\n background-size:100% 100%;\n    width:38px;\n height:38px;  }\n .m-share-iconfont-copylink {\n margin:0 auto!important; \n    display: block;\n background:url('/static/images/icon-copylink.png') no-repeat left top;\n background-size:100% 100%;\n    width:38px;\n height:38px;  } \n  .m-share-iconfont-qrcode {\n margin:0 auto!important; \n    display: block;\n background:url('/static/images/icon-poster.png') no-repeat left top;\n background-size:100% 100%;\n    width:38px;\n height:38px;  } \n .m-share-iconfont-qq {\n margin:0 auto!important; \n    display: block;\n background:url('/static/images/icon-qq.png') no-repeat left top;\n background-size:100% 100%;\n    width:38px;\n height:38px;   }\n  .m-share-iconfont-wxline {\n margin:0 auto!important; \n    display: block;\n background:url('/static/images/icon-wxline.png') no-repeat left top;\n background-size:100% 100%;\n    width:38px;\n height:38px;    }\n  .m-share-iconfont-menu {\n  display:inline-block;\n width:14px;\nheight:14px;\nbackground: url('/static/images/icon-share-page.png') no-repeat left top;\nbackground-size:100% 100%\n  }\n  .m-share-iconfont-dots {\n    font-size: 25px;\n    color: #fff;\n  }\n  .m-share-iconfont-dots:before {\n    content: \"\\e656\";\n  }\n  .m-share-iconfont-share {\n  display:inline-block;\n width:16px;\nheight:16px;\nbackground: url('/static/images/icon-share-sq.png') no-repeat left top;\nbackground-size:100% 100%\n   }\n  "
    }

    var isStyleLoaded = false
    var ui = {
        initStyle: function initStyle() {
            if (!isStyleLoaded) {
                util.execStyle(style.cssText)
                isStyleLoaded = true
            }
        },
        showActionSheet: function showActionSheet(dom) {
            this.showMask()
            var $sheet = document.createElement('div')
            $sheet.id = 'm-share-actionSheet'
            $sheet.appendChild(dom)
            document.body.appendChild($sheet)
            window.setTimeout(function() {
                $sheet.style.cssText = '-webkit-transform: translateY(0);transform: translateY(0);'
            }, 0)
        },
        hideActionSheet: function hideActionSheet() {
            var dom = document.querySelector('#m-share-actionSheet')
            if (dom) {
                dom.remove()
            }
        },
        showMask: function showMask() {
            var _this = this

            if (document.querySelector('.m-share-mask')) {
                return
            }
            var $div = document.createElement('div')
            $div.className = 'm-share-mask'
            $div.addEventListener('click', function() {
                _this.hideActionSheet()
                _this.hideBottomTips()
                _this.hideRightTips()
                _this.hideMask()

                let qrcodeDom = document.getElementsByClassName('poster_img_box')
                qrcodeDom.length > 0 && qrcodeDom[0].remove()
            })
            document.body.appendChild($div)
            window.setTimeout(function() {
                $div.style.opacity = 0.7
            }, 0)
        },
        hideMask: function hideMask() {
            var domList = document.querySelectorAll('.m-share-mask')

            var _loop = function _loop(i) {
                var item = domList[i]
                var removeDom = function removeDom() {
                    return item.remove()
                }

                removeDom()
            }

            for (var i = 0; i < domList.length; i++) {
                _loop(i)
            }
        },
        showBottomTips: function showBottomTips() {
            var _this2 = this

            this.showMask()
            var $tips = document.createElement('div')
            $tips.className = 'm-share-tips-bottom'
            $tips.innerHTML = '请打开浏览器的菜单进行分享点击“<i class="m-share-iconfont m-share-iconfont-menu"></i>”或“<i class="m-share-iconfont m-share-iconfont-share"></i>”'
            document.body.appendChild($tips)
            window.setTimeout(function() {
                _this2.hideMask()
                _this2.hideBottomTips()
            }, 1400)
        },
        hideBottomTips: function hideBottomTips() {
            var domList = document.querySelectorAll('.m-share-tips-bottom')
            for (var i = 0; i < domList.length; i++) {
                var _item = domList[i]
                _item.remove()
            }
        },
        showRightTopTips: function showRightTopTips() {
            var _this3 = this

            this.showMask()
            var $tips = document.createElement('div')
            $tips.className = 'm-share-tips'
            $tips.innerHTML = '\n      <div class="m-share-tips-w">\n        <div class="m-share-tips-p">\u70B9\u51FB\u53F3\u4E0A\u89D2\u201C<i class="m-share-iconfont m-share-iconfont-dots"></i>\u201D</div>\n        <div class="m-share-tips-p">\u5206\u4EAB\u7ED9\u670B\u53CB\u5427\uFF01</div>\n      </div>\n      <div class="m-share-tips-arrow"></div>\n    '
            document.body.appendChild($tips)
            window.setTimeout(function() {
                _this3.hideMask()
                _this3.hideRightTips()
            }, 1400)
        },
        hideRightTips: function hideRightTips() {
            var domList = document.querySelectorAll('.m-share-tips')
            for (var i = 0; i < domList.length; i++) {
                var _item2 = domList[i]
                _item2.remove()
            }
        }
    }

    var setNormalShareInfo = function(info) {
        if (info.desc && !document.querySelector('meta[name$="cription"]')) {
            var $meta = document.createElement('meta')
            $meta.setAttribute('description', info.desc)
        }

        if (info.imgUrl) {
            var $img = document.createElement('img')
            $img.style.cssText = 'width: 0;height: 0;position: absolute;z-index: -9999;top: -99999px;left: -99999px;'
            $img.onload = function() {
                document.body.insertBefore($img, document.body.firstChild)
            }
            $img.onerror = function() {
                $img.remove()
            }
            $img.src = info.imgUrl
        }
    }

    var qqJsSdkUrl = '//open.mobile.qq.com/sdk/qqapi.js?_bid=152'

    var setShareInfo = function setShareInfo(info) {
        mqq.data.setShareInfo({
            share_url: info.link,
            title: info.title,
            desc: info.desc,
            image_url: info.imgUrl
        })
    }

    var setQQshareInfo = function(info) {
        if (window.mqq && mqq.data && mqq.data.setShareInfo) {
            setShareInfo(info)
        } else {
            util.loadScript(qqJsSdkUrl, function() {
                setShareInfo(info)
            })
        }
    }

    var isInit = false

    var _init = function(config) {
        if (!isInit) {
            var info = {
                title: config.title,
                desc: config.desc,
                link: config.link,
                imgUrl: config.imgUrl
            }
            isInit = true
            ui.initStyle()
            if (config.setNormal !== false) {
                setNormalShareInfo(info)
            }

            if (util.ua.isFromQQ) {
                setQQshareInfo(config.types, info)
            }
        }
    }

    var wxJsSdkUrl = '//res.wx.qq.com/open/js/jweixin-1.2.0.js'

    var setShareInfo$1 = function setShareInfo(type, info) {
        switch (type) {
            case 'wx':
                wx.onMenuShareAppMessage(info)
                break
            case 'wxline':
                wx.onMenuShareTimeline(info)
                break
            case 'qq':
                wx.onMenuShareQQ(info)
                break
            case 'qzone':
                wx.onMenuShareQZone(info)
                break
            case 'copylink':
                wx.onMenuShareQZone(info)
                break
            case 'qrcode':
                wx.onMenuShareQZone(info)
                break
        }
    }

    var isConfig = false

    var setWxShareInfo = function(types, config) {
        var wxConfig = config.wx
        var doSet = function doSet() {
            var _wxConfig = Object.assign({
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo']
            }, wxConfig)
            if (!isConfig) {
                wx.config(_wxConfig)
                isConfig = true
            }
            wx.ready(function() {
                try {
                    types.forEach(function(item) {
                        var _info = {
                            title: config.infoMap && config.infoMap[item] && config.infoMap[item].title || config.title,
                            desc: config.infoMap && config.infoMap[item] && config.infoMap[item].desc || config.desc,
                            link: config.infoMap && config.infoMap[item] && config.infoMap[item].link || config.link,
                            imgUrl: config.infoMap && config.infoMap[item] && config.infoMap[item].imgUrl || config.imgUrl
                        }
                        setShareInfo$1(item, _info)
                    })
                } catch (e) {}
            })
        }
        if (window.wx) {
            doSet()
        } else {
            util.loadScript(wxJsSdkUrl, function() {
                doSet()
            })
        }
    }

    var qqShareJsSdk = '//jsapi.qq.com/get?api=app.setShareInfo,app.share'

    var qqBrowserShare = function(type, info) {
        var doShare = function doShare(to_app) {
            var _doShare = function _doShare() {
                try {
                    browser.app.share({
                        title: info.title,
                        description: info.desc,
                        url: info.link,
                        img_url: info.imgUrl,
                        to_app: to_app
                    }, function(res) {})
                } catch (e) {}
            }
            if (window.browser && browser.app && browser.app.share) {
                _doShare()
            } else {
                util.loadScript(qqShareJsSdk, _doShare)
            }
        }
        switch (type) {
            case 'wx':
                doShare(1)
                break
            case 'wxline':
                doShare(8)
                break
            case 'qq':
                doShare(4)
                break
            case 'qzone':
                doShare(3)
                break
            case 'sina':
                doShare(11)
                break
            case 'copylink':
                doShare(11)
                break
            case 'qrcode':
                doShare(11)
                break
        }
    }

    var wxShare = function(info) {
        if (util.ua.isFromWx) {
            ui.showRightTopTips()
            return
        }

        if (util.ua.isFromQQ) {
            ui.showRightTopTips()
            return
        }
        if (util.ua.isFromUC) {
            ui.hideMask()
            if (util.ua.isFromIos) {
                window.ucbrowser && window.ucbrowser.web_share(info.title, info.desc, info.link, 'kWeixin', info.imgUrl, '', '')
            } else {
                window.ucweb && window.ucweb.startRequest('shell.page_share', [info.title, info.desc, info.link, 'WechatFriends', info.imgUrl, ''])
            }
            return
        }

        if (util.ua.isFromQQBrower) {
            ui.hideMask()
            qqBrowserShare('wx', info)
            return
        }

        ui.showBottomTips()
    }

    var wxlineShare = function(info) {
        if (util.ua.isFromWx) {
            ui.showRightTopTips()
            return
        }

        if (util.ua.isFromQQ) {
            ui.showRightTopTips()
            return
        }

        if (util.ua.isFromUC) {
            ui.hideMask()
            if (util.ua.isFromIos) {
                window.ucbrowser && window.ucbrowser.web_share(info.title, info.desc, info.link, 'kWeixinFriend', info.imgUrl, '', '')
            } else {
                window.ucweb && window.ucweb.startRequest('shell.page_share', [info.title, info.desc, info.link, 'WechatTimeline', info.imgUrl, ''])
            }
            return
        }

        if (util.ua.isFromQQBrower) {
            ui.hideMask()
            qqBrowserShare('wxline', info)
            return
        }

        ui.showBottomTips()
    }

    var qqShare = function(info) {
        if (util.ua.isFromWx) {
            ui.showRightTopTips()
            return
        }

        if (util.ua.isFromQQ) {
            ui.showRightTopTips()
            return
        }

        if (util.ua.isFromQQBrower) {
            ui.hideMask()
            qqBrowserShare('qq', info)
            return
        }

        ui.showBottomTips()
    }

    var qzoneShare = function(info) {
        if (util.ua.isFromWx) {
            ui.showRightTopTips()
            return
        }

        if (util.ua.isFromQQ) {
            ui.showRightTopTips()
            return
        }

        if (util.ua.isFromQQBrower) {
            ui.hideMask()
            qqBrowserShare('qzone', info)
            return
        }
        var query = 'url=' + encodeURIComponent(info.link) + '&title=' + encodeURIComponent(info.title) + '&desc=' + encodeURIComponent(info.desc) + '&summary=' + encodeURIComponent(info.desc) + '&site=' + encodeURIComponent(info.link)
        location.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + query
    }

    var sinaShare = function(info) {
        if (util.ua.isFromQQBrower) {
            ui.hideMask()
            qqBrowserShare('sina', info)
                // return
        }
        // alert(/mqqbrowser[^LightApp]/gi.test(window.navigator.userAgent));
        // '&desc=' + encodeURIComponent(info.title +info.desc )
        var query = 'url=' + encodeURIComponent(info.link) + '&title=' + encodeURIComponent(info.title + info.desc) + '&pic=' + encodeURIComponent(info.imgUrl)
        location.href = 'http://service.weibo.com/share/share.php?' + query
    }
    var copyLink = function(info) {
        var clipboard = new ClipboardJS('#codeBtn')
        clipboard.on('success', function(e) {
            ui.showMask()
            var $tips = document.createElement('div')
            $tips.className = 'm-share-tips-bottom'
            $tips.innerHTML = '复制成功，快去粘贴吧'
            document.body.appendChild($tips)
            window.setTimeout(function() {
                ui.hideMask()
                ui.hideBottomTips()
                e.clearSelection()
                clipboard.destroy()
            }, 1400)
        })
    }
    var qrCode = function(info) {
        if (!qrCodeImg) {
            ui.hideMask()
            return
        }
        var $tips = document.createElement('div');
        $tips.className = 'poster_img_box'
        $tips.innerHTML = `
            <div class="qrcodeBox">
                <div class="postRelative">
                    <img id="showPayPic" class="qr_img" src="${qrCodeImg}" alt="二维码海报" />
                    <p class="down_text">长按保存到相册</p>
                    <i class="post_download" onclick="download()"></i>
                </div>
            </div>
        `
        document.body.appendChild($tips)
    }

    var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj
    } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
    }

    var shareFuncMap = {
        wx: wxShare,
        wxline: wxlineShare,
        qq: qqShare,
        qzone: qzoneShare,
        sina: sinaShare,
        copylink: copyLink,
        qrcode: qrCode,
    }

    var typesMap = ['wx', 'wxline', 'qq', 'qzone', 'sina', 'copylink', 'qrcode']

    var getDefaultConfig = function getDefaultConfig(config) {
        config = config || {}
        var infoMapType = _typeof(config.infoMap)
            // console.log("config", JSON.parse(JSON.stringify(config)));
        return {
            title: config && config.title || document.title,
            desc: config && config.desc || document.querySelector('meta[name$="cription"]') && document.querySelector('meta[name$="cription"]').getAttribute('content') || '',
            link: encodeURI(config && config.link || window.location.href),
            imgUrl: config && config.imgUrl || document.querySelector('img') && document.querySelector('img').getAttribute('src') || '',
            types: config && Array.isArray(config.types) && config.types || ['wx', 'wxline', 'qq', 'qzone', 'sina', 'copylink', 'qrcode'],
            wx: config && config.wx || null,
            fnDoShare: config.fnDoShare,
            infoMap: infoMapType === 'function' || infoMapType === 'object' && !!config.infoMap ? config.infoMap : {}
        }
    }

    var index = {
        wxConfig: function wxConfig(config) {
            var _config = getDefaultConfig(config)
            if (util.ua.isFromWx && _config.wx && _config.wx.appId && _config.wx.timestamp && _config.wx.nonceStr && _config.wx.signature) {
                setWxShareInfo(typesMap, _config)
            }
        },
        init: function init(config) {
            var _config = getDefaultConfig(config)
            _init(_config)
            var domList = document.querySelectorAll('.m-share')

            for (var i = 0; i < domList.length; i++) {
                var item = domList[i]
                this.render(item, _config)
            }
        },
        render: function render(dom, config) {
            var _this = this

            var _config = getDefaultConfig(config)
            _init(_config)
            var getTmpl = function getTmpl(type) {
                if (typesMap.indexOf(type) >= 0) {
                    return '<i class="m-share-' + type + ' m-share-iconfont m-share-iconfont-' + type + '"></i>'
                }
                return ''
            }
            var tmp = ''
            _config.types.forEach(function(item) {
                tmp += getTmpl(item)
            })
            if (typeof dom === 'string') {
                dom = document.querySelector(dom)
            }
            if (!dom) {
                return
            }
            dom.innerHTML = tmp
            dom.addEventListener('click', function(e) {
                var target = e.target
                typesMap.forEach(function(item) {
                    if (target.classList.contains('m-share-' + item)) {
                        var shareData = {
                            title: _config.infoMap && _config.infoMap[item] && _config.infoMap[item].title || _config.title,
                            desc: _config.infoMap && _config.infoMap[item] && _config.infoMap[item].desc || _config.desc,
                            link: _config.infoMap && _config.infoMap[item] && _config.infoMap[item].link || _config.link,
                            imgUrl: _config.infoMap && _config.infoMap[item] && _config.infoMap[item].imgUrl || _config.imgUrl,
                            fnDoShare: _config.fnDoShare
                        }
                        _this.to(item, shareData)
                    }
                })
            })
        },
        to: function to(type, config) {
            var _config = getDefaultConfig(config)
            _init(_config)
            if (typesMap.indexOf(type) >= 0) {
                if (_config.fnDoShare) {
                    _config.fnDoShare(type)
                }
                shareFuncMap[type](_config)
            }
        },
        popup: function popup(config) {
            var _this2 = this
            qrCodeImg = config.qrcode;
            configLink = config.link;
            // console.log('qrCodeImg', config)
            var _config = getDefaultConfig(config)
            _init(_config)
            var textMap = {
                wx: '微信',
                wxline: '朋友圈',
                qq: 'QQ',
                qzone: 'QQ空间',
                sina: '新浪微博',
                copylink: '复制链接',
                qrcode: '二维码海报',
            }
            var dom = document.createElement('div')
            dom.className = 'm-share-flex'
            var tmp = ''
            var getTmpl = function getTmpl(type) {
                if (location.pathname !== '/invitation' && type === 'qrcode') { //用户邀请页面才显示二维码海报
                    return '';
                }
                if (typesMap.indexOf(type) >= 0) {
                    var copyLinkBtn = ''
                    var url = configLink || window.location.href
                    if (type == 'copylink') {
                        copyLinkBtn = 'id="codeBtn" data-clipboard-text="' + url + '"'
                    }
                    return '<div class="m-share-cell" ' + copyLinkBtn + '><i class="m-share-' + type + ' m-share-iconfont m-share-iconfont-' + type + '"></i><div class="m-share-sheet-title">' + textMap[type] + '</div></div>'
                }
                return ''
            }
            _config.types.forEach(function(item) {
                tmp += getTmpl(item)
            })
            dom.innerHTML = tmp
            dom.addEventListener('click', function(e) {
                var target = e.target
                typesMap.forEach(function(item) {
                    if (target.classList.contains('m-share-' + item)) {
                        ui.hideActionSheet()
                        var shareData = {
                            title: _config.infoMap && _config.infoMap[item] && _config.infoMap[item].title || _config.title,
                            desc: _config.infoMap && _config.infoMap[item] && _config.infoMap[item].desc || _config.desc,
                            link: _config.infoMap && _config.infoMap[item] && _config.infoMap[item].link || _config.link,
                            imgUrl: _config.infoMap && _config.infoMap[item] && _config.infoMap[item].imgUrl || _config.imgUrl,
                            fnDoShare: _config.fnDoShare
                        }
                        _this2.to(item, shareData)
                    }
                })
            })
            ui.showActionSheet(dom)
        }
    }

    return index
}))