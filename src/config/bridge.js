//使用jsBridge和原生IOS、Android交互
function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }else{
      document.addEventListener('WebViewJavascriptBridgeReady', function() {
          callback(WebViewJavascriptBridge)
      }, false)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
    let WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'https://__bridge_loaded__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(() => {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
}


export default {
    //调用app端的方法
  callhandler (name, data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(name, data, callback)
    })
  },
  //注册方法给app端使用
  registerhandler (name, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
        function isIos() {
            let ua = window.navigator.userAgent;
            if(!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                // ios端 
                console.log('ios端');
                return true
            }else if(ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
                // android端 
                console.log('android端');
                return false
            }

        }
        if(isIos()){
            bridge.registerHandler(name, function (data, responseCallback) {
                callback(data, responseCallback)
            })
        }else{
            var uniqueId = 1
            function log(message, data) {
                var log = document.getElementById('log')
                var el = document.createElement('div')
                el.className = 'logLine'
                el.innerHTML = uniqueId++ + '. ' + message + (data ? ':<br/>' + JSON.stringify(data) : '')
                if (log.children.length) { log.insertBefore(el, log.children[0]) }
                else { log.appendChild(el) }
            }
            bridge.init(function(message, responseCallback) {
                log('JS got a message', message)
                var data = { 'Javascript Responds':'Wee!' }
                log('JS responding with', data)
                responseCallback(data)
            })
            bridge.registerHandler(name, function (data, responseCallback) {
                callback(data, responseCallback)
            })
        }
    })
  }
}

