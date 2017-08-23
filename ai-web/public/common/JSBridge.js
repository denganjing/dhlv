;(function() {

     function GreenWayJSBridge() {
          this.browser = {
               versions : function() {
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return {//移动终端浏览器版本信息
                            trident: u.indexOf("Trident") > -1, //IE内核
                            presto: u.indexOf("Presto") > -1, //opera内核
                            webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
                            gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
                            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                            android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
                            iPhone: u.indexOf("iPhone") > -1 , //是否为iPhone或者QQHD浏览器
                            iPad: u.indexOf("iPad") > -1, //是否iPad
                            webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
                            greenWay: u.indexOf("GreenRoad") > -1 || u.indexOf("GreenWay") > -1 //是否是东湖绿道app
                       };
               }(),
               language:(navigator.browserLanguage || navigator.language).toLowerCase()
          };

          this.isFunction = function(fn) {
               return Object.prototype.toString.call(fn)=== '[object Function]';
          };

          this.setupiOS = function(callback) {
               if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
               if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }

               window.WVJBCallbacks = [callback];

               var WVJBIframe = document.createElement('iframe');
               WVJBIframe.style.display = 'none';
               WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
               document.documentElement.appendChild(WVJBIframe);
               setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
          };

          this.setupAndroid = function(callback) {

               if (window.JSBridge) { return callback(window.JSBridge); }

               var hasOwnProperty = Object.prototype.hasOwnProperty;
               var JSBridge = window.JSBridge || (window.JSBridge = {});
               var JSBRIDGE_PROTOCOL = 'JSBridge';
               var Inner = {
                    callbacks: {},
                    call: function (obj, method, params, callback) {
                         var port = Util.getPort();
                         this.callbacks[port] = callback;
                         var uri=Util.getUri(obj,method,params,port);
                         window.prompt(uri, "");
                    },
                    callHandler : function(method, params, callback) {
                         this.call('GreenRoad', method, params || {}, callback);
                    },
                    onFinish: function (port, jsonObj){
                         var callback = this.callbacks[port];
                         callback && callback(jsonObj);
                         delete this.callbacks[port];
                    },
               };

               var Util = {
                    getPort: function () {
                         return Math.floor(Math.random() * (1 << 30));
                    },
                    getUri:function(obj, method, params, port){
                         params = this.getParam(params);
                         var uri = JSBRIDGE_PROTOCOL + '://' + obj + ':' + port + '/' + method + '?' + params;
                         return uri;
                    },
                    getParam:function(obj){
                         if (obj && typeof obj === 'object') {
                              return JSON.stringify(obj);
                         } else {
                              return obj || '';
                         }
                    }
               };

               for (var key in Inner) {
                    if (!hasOwnProperty.call(JSBridge, key)) {
                         JSBridge[key] = Inner[key];
                    }
               }

               callback(window.JSBridge);
          };

          this.setup = function(callback, webfunction) {
               if (!this.isFunction(callback)) {
                    throw new Error("bridge callback is not a function");
               }

               if (this.browser.versions.greenWay && (this.browser.versions.iPhone || this.browser.versions.iPad)) {
                    this.setupiOS(callback);
               } else if (this.browser.versions.greenWay && this.browser.versions.android) {
                    this.setupAndroid(callback);
               } else {
                    // webfunction();
               }
          }
     }

     window.GWJSBridge = new GreenWayJSBridge();
})();
