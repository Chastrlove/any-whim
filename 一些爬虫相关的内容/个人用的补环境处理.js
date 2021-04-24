// 从浏览器直接扒各种参数环境的脚本
console.log(make_all()) // 使用时候解开该行注释，然后将生成的代码都放到控制台中直接执行，复制生成的字符出即可。
function get_all(){
    function generatecode4v(name_, key, v, o, be_values) {
        if (be_values.indexOf(key) == -1){
            if (typeof (v) == "object") {
                if (v == null) {
                    return `${name_}["${key}"] = null;\r\n`
                }
                if (o == v){
                    return `${name_}["${key}"] = ${name_};\r\n`
                }
                try {
                    return `${name_}["${key}"] = _vPxy(new class ${v.constructor.name}{}, "${key}");\r\n`
                } catch (error) {
                    return `${name_}["${key}"] = "----------------------------------------------------------------";\r\n`
                }
            }
            if (typeof (v) == "string") {
                if (v.indexOf('"') == -1){
                    return `${name_}["${key}"] = "${v}";\r\n`
                }else if (v.indexOf("'") == -1){
                    return `${name_}["${key}"] = '${v}';\r\n`
                }else{
                    return `${name_}["${key}"] = \`${v}\`;\r\n`
                }
            }
            if (typeof (v) == "function") {
                return `${name_}["${key}"] = function ${v.name}(){_vLog('--- func(*) --- ${v.name}');debugger;};   safefunction(${name_}["${key}"]);\r\n`
            }
        }else{
            return `${name_}["${key}"] = ${JSON.stringify(v)};\r\n`
        }
        return `${name_}["${key}"] = ${v};\r\n`
    }
    function generatecode4v1(name_, key, v, o, be_values) {
        if (be_values.indexOf(key) == -1){
            if (typeof (v) == "object") {
                if (v == null) {
                    return `${name_}.__proto__["${key}"] = null;\r\n`
                }
                try {
                    return `${name_}.__proto__["${key}"] = _vPxy(new class ${v.constructor.name}{}, "${key}");\r\n`
                } catch (error) {
                    return `${name_}.__proto__["${key}"] = "----------------------------------------------------------------";\r\n`
                }
            }
            if (typeof (v) == "string") {
                if (v.indexOf('"') == -1){
                    return `${name_}.__proto__["${key}"] = "${v}";\r\n`
                }else if (v.indexOf("'") == -1){
                    return `${name_}.__proto__["${key}"] = '${v}';\r\n`
                }else{
                    return `${name_}.__proto__["${key}"] = \`${v}\`;\r\n`
                }
            }
            if (typeof (v) == "function") {
                return `${name_}.__proto__["${key}"] = function ${v.name}(){_vLog('--- func(*) --- ${v.name}');debugger;};   safefunction(${name_}["${key}"]);\r\n`
            }
            if (name_ == 'document' && key == 'all'){
                return `${name_}.__proto__["${key}"] = undefined;\r\n`
            }
        }else{
            return `${name_}.__proto__["${key}"] = ${JSON.stringify(v)};\r\n`
        }
        return `${name_}.__proto__["${key}"] = ${v};\r\n`
    }
    function generate4example(example, name_, skips, be_values) {
        var code = "";
        var protos = {}
        if (typeof (example) == "object" && example.prototype == undefined) {
            for (let key in example.__proto__) {
                protos[key] = true;
            }
            for (let key in example) {
                if (protos[key] == undefined) {
                    if (key && skips.indexOf(key) == -1){
                        try{
                           code += generatecode4v(name_, key, example[key], example, be_values);
                        }catch(e){
                            console.log('========== error ==========')
                            console.log(key)
                            console.log(e)
                        }
                    }
                }
            }
        }
        return alignment_safefunction(alignment(code));
    }
    function generate4Prototype(example, name_, skips, be_values) {
        var code = "";
        if (typeof (example) == "object" && example.prototype == undefined) {
            for (let key in example.__proto__) {
                if (skips.indexOf(key) == -1){
                    try{
                        code += generatecode4v1(name_, key, example[key], example, be_values);
                    }catch(e){
                        console.log('========== error ==========')
                        console.log(key)
                        console.log(e)
                    }
                }
            }
        }
        return alignment_safefunction(alignment(code))
    }
    function alignment(str){
        var max_protolen = 0
        if (str.trim().length == 0){
            return str
        }
        var mch = str.match(/(\["[^"]+"\]) *=/g)
        if (!(mch)){
            return str
        }
        mch.map(function(e){
            if (e.length > max_protolen){
                max_protolen = e.length
            }
        })
        return str.replace(/(\["[^"]+"\]) *=/g, function(_, e){
            return e + Array(max_protolen-e.length-1).fill(" ").join("") + '='
        })
    }
    function alignment_safefunction(str){
        var max_protolen = 0
        if (str.trim().length == 0){
            return str
        }
        var mch = str.match(/(=[^=]+); *safefunction/g)
        if (!(mch)){
            return str
        }
        mch.map(function(e){
            if (e.length > max_protolen){
                max_protolen = e.length
            }
        })
        return str.replace(/(=[^=]+;) *safefunction/g, function(_, e){
            return e + Array(max_protolen-e.length-14).fill(" ").join("") + 'safefunction'
        })
    }
    function vall(example, name_, skips, be_values){
        skips = skips || []
        be_values = be_values || []
        var protostr = generate4Prototype(example, name_, skips, be_values)
        var objectstr = generate4example(example, name_, skips, be_values)
        return protostr + objectstr
    }
    vall.generate4example = generate4example
    vall.generate4Prototype = generate4Prototype
    // placeholder1
}
function make_all(){
    var ret;
    ret = Cilame + '\r\n'
    ret += get_all + '\r\n'
    ret = ret.replace('// placeholder1', `
    console.log(
    Cilame + "\\r\\n" +
    "Cilame()\\r\\n" +
    vall(window,                 "window",               ${JSON.stringify(Cilame())}.concat(['_vLog', '_vPxy'])) +
    vall(document,               "document",             ['cookie', 'addEventListener', 'dispatchEvent', 'removeEventListener', "createElement", "getElementsByName"]) +
    vall(Node.prototype,         "Node.prototype",       ["location", 'addEventListener', 'dispatchEvent', 'removeEventListener']) +
    vall(navigator,              "navigator",            ['connection'],    ['languages']) +
    vall(window.location,        "window.location") +
    vall(window.localStorage,    "window.localStorage",   ["clear", "getItem", "key", "removeItem", "setItem", "length"]) +
    vall(window.sessionStorage,  "window.sessionStorage", ["clear", "getItem", "key", "removeItem", "setItem", "length"]) +
\`for (let key in navigator.__proto__) {
    navigator[key] = navigator.__proto__[key];
    if (typeof (navigator.__proto__[key]) != "function") {
        navigator.__proto__.__defineGetter__(key, function() {
            debugger ;var e = new Error();
            e.name = "TypeError";
            e.message = "Illegal invocation";
            e.stack = "VM988:1 Uncaught TypeError: Illegal invocation \\\\r\\\\n at <anonymous>:1:19";
            throw e;
        });
    }
}
window                = VmProxyB(window,                "window")
window.document       = VmProxyB(window.document,       "window.document")
window.navigator      = VmProxyB(window.navigator,      "window.navigator")
window.location       = VmProxyB(window.location,       "window.location")
window.localStorage   = VmProxyB(window.localStorage,   "window.localStorage")
window.sessionStorage = VmProxyB(window.sessionStorage, "window.sessionStorage")

hookFunc('eval')
hookFunc('Function')
start = true  // 主要的 VmProxyB 的log开关
// start1 = true // 一些未被实现的 _vPxy(new class Unknown{}) 的 Proxy 打印日志，让输出更清晰，不过尽量不要使用这个
\`)`)
    ret += '\r\n'
    ret += 'get_all()\r\n// 将生成的代码全部拷贝到 chrome 控制台执行即可'
    return ret
}
















// 以下就是就是一个补环境的简单处理，现在还不成熟，后面慢慢补







function Cilame(){
    // 生成一些重要的参数，比如 screen Screen 这种对应的系统对象
    // 这些系统对象原型结构稍微有点绕，统一成下面模式就行
    ;(function(){
        const $toString = Function.toString;
        const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random() + '').toString(36)));
        const myToString = function() {
            return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this);
        };
        function set_native(func, key, value) {
            Object.defineProperty(func, key, {
                "enumerable": false,
                "configurable": true,
                "writable": true,
                "value": value
            })
        };
        delete Function.prototype['toString'];
        set_native(Function.prototype, "toString", myToString);
        set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }");
        ;(typeof global=='undefined'?window:global).safefunction = function(func){
            set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`);
            return func
        };
        function make_constructor(name, Name, name_inject_objs, Name_inject_objs, proto, config){
            config = config !== undefined?config:{}
            var allow_illegal = config['allow_illegal']
            var illegalstr = (!allow_illegal)?'throw new TypeError("Illegal constructor");':''
            var evalstr = `
            var ${name}Constructor = function ${Name=="WindowProperties"?"EventTarget":Name}() { ${illegalstr} }
            safefunction(${name}Constructor);
            var ${name}Prototype = (proto!==undefined?proto:{});
            Object.defineProperties(${name}Prototype, {
                constructor: { value: ${name}Constructor, writable: true, configurable: true },
                [Symbol.toStringTag]: { value: "${Name}", configurable: true }
            });
            ${name}Constructor.prototype = ${name}Prototype;
            var ${Name} = function ${Name}() {}
            safefunction(${Name});
            var ${name} = new ${Name}();
            ${name}.__proto__ = ${name}Prototype;
            __cilame__['n']["${name}"] = ${name}
            __cilame__['N']["${Name}"] = ${Name}
            if (name_inject_objs.length){ name_inject_objs.map(function(e){ Object.defineProperty(e, "${name}", { configurable: true, writable: true, value: ${name} }); }) }
            if (Name_inject_objs.length){ Name_inject_objs.map(function(e){ Object.defineProperty(e, "${Name}", { configurable: true, writable: true, value: ${name}Constructor }); }) }
            `
            eval(evalstr)
        }
        ;(typeof global=='undefined'?window:global).make_constructor = make_constructor
        ;(typeof global=='undefined'?window:global).start = false
        ;(typeof global=='undefined'?window:global).start1 = false
        ;(typeof global=='undefined'?window:global)._vLog = function _vLog(){ if (start1){ 
            console.log.apply(console.log, [].slice.call(arguments))
        }}
        ;(typeof global=='undefined'?window:global)._vPxy = function(G, M){
            var _vLog = (typeof global=='undefined'?window:global)._vLog || console.log
            function LS(T, M, F){ return `${M}[${T.constructor.name}].(Prxoy)${F} ==>>`}
            return new Proxy(G, {
                apply:                    function(T, A, L){    _vLog(LS(G, M, 'apply') );                    return Reflect.apply(T, A, L) },
                construct:                function(T, L, N){    _vLog(LS(G, M, 'construct') );                return Reflect.construct(T, L, N) },
                deleteProperty:           function(T, P){       _vLog(LS(G, M, 'deleteProperty') );           return Reflect.deleteProperty(T, P) },
                get:                      function(T, P, R){    _vLog(LS(G, M, 'get'), P);                    return Reflect.get(T, P, R) },
                // defineProperty:           function(T, P, A){    _vLog(LS(G, M, 'defineProperty') );           return Reflect.defineProperty(T, P, A) },
                // getOwnPropertyDescriptor: function(T, P){       _vLog(LS(G, M, 'getOwnPropertyDescriptor') ); return Reflect.getOwnPropertyDescriptor(T, P) },
                getPrototypeOf:           function(T){          _vLog(LS(G, M, 'getPrototypeOf') );           return Reflect.getPrototypeOf(T) },
                has:                      function(T, P){       _vLog(LS(G, M, 'has') );                      return Reflect.has(T, P) },
                isExtensible:             function(T){          _vLog(LS(G, M, 'isExtensible') );             return Reflect.isExtensible(T) },
                ownKeys:                  function(T){          _vLog(LS(G, M, 'ownKeys') );                  return Reflect.ownKeys(T) },
                preventExtensions:        function(T){          _vLog(LS(G, M, 'preventExtensions') );        return Reflect.preventExtensions(T) },
                set:                      function(T, P, V, R){ _vLog(LS(G, M, 'set'), P);                    return Reflect.set(T, P, V, R) },
                setPrototypeOf:           function(T, P){       _vLog(LS(G, M, 'setPrototypeOf'));            return Reflect.setPrototypeOf(T, P) },
            })
        }
        function logA(tag, G_or_S, objectname, propertyname, value){
            console.table([{tag, G_or_S, objectname, propertyname,value}], ["tag","G_or_S","objectname","propertyname","value"]);
        }
        function logB(tag, GS, objectname, propertyname, value){
            console.info(tag, GS, `[${objectname}]`, `"${propertyname}"`, value);
        }
        function VmProxy(logger, object_, titlename, dont_log_value){
            return new Proxy(object_, {
                get (target, property) { 
                    if (start){
                        logger(titlename, "Get >>", target.constructor.name, property, dont_log_value?'<DONTLOG>':target[property]);
                    }
                    return target[property];
                },
                set (target, property, value) {
                    if (start){
                        logger(titlename, "Set <<", target.constructor.name, property, dont_log_value?'<DONTLOG>':value);
                    }
                    target[property] = value;
                }
            });
        };
        var VmProxyA = function (){return VmProxy.apply(this, [logA].concat([].slice.call(arguments)))}
        var VmProxyB = function (){return VmProxy.apply(this, [logB].concat([].slice.call(arguments)))}
        ;(typeof global=='undefined'?window:global).VmProxyA = VmProxyA
        ;(typeof global=='undefined'?window:global).VmProxyB = VmProxyB
        ;(typeof global=='undefined'?window:global).hookFunc = function hookFunc(H){
            eval(`
            _v${H} = ${H}
            window.${H} = function ${H}(){
                if (window.start){
                    console.log('-------------------- ${H}(*) --------------------')
                    console.log(arguments[0])
                }
                return _v${H}.apply(this, arguments)
            }
            safefunction(window.${H})
            `)
        }
    })();
    // 将核心结构初始化，也就是 window navigator document 等初始化处理好
    var __cilame__ = { 'n':{}, 'N':{}, 'c':{} } // 临时存储空间, n 为 new 对象, N 为原始方法.
    var GL = _global = (typeof global=='undefined'?window:global)
    make_constructor("eventTarget", "EventTarget", [], [GL], undefined, { allow_illegal: true })
    EventTarget.prototype.listeners = {};
    EventTarget.prototype.addEventListener = function(type, callback) {
        if(!(type in this.listeners)) { this.listeners[type] = []; }
        this.listeners[type].push(callback);
    };
    EventTarget.prototype.removeEventListener = function(type, callback) {
        if(!(type in this.listeners)) { return; }
        var stack = this.listeners[type];
        for(var i = 0, l = stack.length; i < l; i++) { if(stack[i] === callback){ stack.splice(i, 1); return this.removeEventListener(type, callback); } }
    };
    EventTarget.prototype.dispatchEvent = function(event) {
        if(!(event.type in this.listeners)) { return; }
        var stack = this.listeners[event.type];
        event.target = this;
        for(var i = 0, l = stack.length; i < l; i++) { stack[i].call(this, event); }
    };
    make_constructor("windowProperties",    "WindowProperties", [], [], new EventTarget, { allow_illegal: true })
    make_constructor("window",              "Window", [GL], [GL],       __cilame__['n']['windowProperties']) // WindowProperties 没有注入 window 环境
    window = new Proxy(window, {
        get: function(a,b,c){
            return a[b] || global[b]
        },
        set: function(a,b,c){
            global[b] = c
            return a[b] = c
        }
    })
    // window 生成之后将 global 内部的常用函数直接传到 window 里面
    var Gkeys = Object.getOwnPropertyNames(global), exclude = ['global', 'process', '_global']
    for (var i = 0; i < Gkeys.length; i++) {
        if (exclude.indexOf(Gkeys[i]) == -1){ window[Gkeys[i]] = global[Gkeys[i]] }
    }
    var EN = normal_env = [window, GL]
    make_constructor("navigator",   "Navigator",    EN, EN)
    window.clientInformation = navigator
    // 处理 document 初始化
    make_constructor("_vNode",      "Node",         [], EN, new EventTarget)
    make_constructor("_vDocument",  "Document",     [], EN, __cilame__["n"]['_vNode'], { allow_illegal: true })
    make_constructor("document",    "HTMLDocument", EN, EN, __cilame__["n"]['_vDocument'])
    ;(function(){
        'use strict';
        var cookie_cache = document.cookie = "";
        Object.defineProperty(document, 'cookie', {
            get: function() {
                console.log('==>> Get Cookie', cookie_cache);
                return cookie_cache;
            },
            set: function(val) {
                console.log('<<== Set Cookie', val);
                var cookie = val.split(";")[0];
                var ncookie = cookie.split("=");
                var flag = false;
                var cache = cookie_cache.split("; ");
                cache = cache.map(function(a) {
                    if (a.split("=")[0] === ncookie[0]) {
                        flag = true;
                        return cookie;
                    }
                    return a;
                })
                cookie_cache = cache.join("; ");
                if (!flag) {
                    cookie_cache += cookie + "; ";
                }
                return cookie_cache;
            }
        });
        global.init_cookie = function init_cookie(str){
            cookie_cache = str
        }
    })();
    // 处理 location 初始化，以及绑定 document
    make_constructor("location",    "Location",     EN, EN)
    location["ancestorOrigins"] = new (class DOMStringList {});
    location["assign"]          = function assign(){debugger;};  safefunction(location["assign"]);
    location["reload"]          = function reload(){debugger;};  safefunction(location["reload"]);
    location["replace"]         = function replace(){debugger;}; safefunction(location["replace"]);
    Object.defineProperty(location, 'href', {
        get: function(){
            return location.protocol + "//" + location.host + (location.port ? ":" + location.port : "") + location.pathname + location.search + location.hash;
        },
        set: function(href){
            var a = href.match(/([^:]+:)\/\/([^/:?#]+):?(\d+)?([^?#]*)?(\?[^#]*)?(#.*)?/);
            location.protocol = a[1] ? a[1] : "";
            location.host     = a[2] ? a[2] : "";
            location.port     = a[3] ? a[3] : "";
            location.pathname = a[4] ? a[4] : "";
            location.search   = a[5] ? a[5] : "";
            location.hash     = a[6] ? a[6] : "";
            location.hostname = location.host;
            location.origin   = location.protocol + "//" + location.host + (location.port ? ":" + location.port : "");
        }
    });
    document.location = location

    // 处理 localStorage 和 sessionStorage 的初始化
    function Storage(){}
    Storage.prototype.clear      = function clear(){            debugger; var self = this; Object.keys(self).forEach(function (key) { self[key] = undefined; delete self[key]; }); }
    Storage.prototype.getItem    = function getItem(key){       debugger; return this.hasOwnProperty(key)?String(this[key]):null }
    Storage.prototype.key        = function key(i){             debugger; return Object.keys(this)[i||0];} 
    Storage.prototype.removeItem = function removeItem(key){    debugger; delete this[key];}       
    Storage.prototype.setItem    = function setItem(key, val){  debugger; this[key] = (val === undefined)?null:String(val) }
    safefunction(Storage)
    _storage_obj = new Storage
    // window.localStorage
    make_constructor("localStorage", "Storage", EN, EN, _storage_obj)
    localStorage.__proto__["clear"]      = safefunction(localStorage.__proto__["clear"]);
    localStorage.__proto__["getItem"]    = safefunction(localStorage.__proto__["getItem"]);
    localStorage.__proto__["key"]        = safefunction(localStorage.__proto__["key"]);
    localStorage.__proto__["removeItem"] = safefunction(localStorage.__proto__["removeItem"]);
    localStorage.__proto__["setItem"]    = safefunction(localStorage.__proto__["setItem"]);
    localStorage["__#classType"] = "localStorage";
    Object.defineProperty(localStorage, 'length', { get: function(){ return Object.keys(this).length }, });
    // window.sessionStorage
    make_constructor("sessionStorage", "Storage", EN, EN, _storage_obj)
    sessionStorage.__proto__["clear"]      = safefunction(sessionStorage.__proto__["clear"]);
    sessionStorage.__proto__["getItem"]    = safefunction(sessionStorage.__proto__["getItem"]);
    sessionStorage.__proto__["key"]        = safefunction(sessionStorage.__proto__["key"]);
    sessionStorage.__proto__["removeItem"] = safefunction(sessionStorage.__proto__["removeItem"]);
    sessionStorage.__proto__["setItem"]    = safefunction(sessionStorage.__proto__["setItem"]);
    Object.defineProperty(sessionStorage, 'length', { get: function(){ return Object.keys(this).length }, });
    // navigator.connection
    make_constructor("_vconnect", "NetworkInformation", EN, EN)
    navigator.connection = _vconnect
    navigator.connection.__proto__["onchange"]            = null;
    navigator.connection.__proto__["effectiveType"]       = "4g";
    navigator.connection.__proto__["rtt"]                 = 50;
    navigator.connection.__proto__["downlink"]            = 10;
    navigator.connection.__proto__["saveData"]            = false;
    // window.performance
    make_constructor("performance", "Performance", EN, EN)
    Object.assign(performance, {
        "timeOrigin": 1619098076582.469,
        "timing": {
            "connectStart": 1619098076595,
            "navigationStart": 1619098076582,
            "loadEventEnd": 1619098077273,
            "domLoading": 1619098076680,
            "secureConnectionStart": 0,
            "fetchStart": 1619098076595,
            "domContentLoadedEventStart": 1619098077192,
            "responseStart": 1619098076668,
            "responseEnd": 1619098076878,
            "domInteractive": 1619098077163,
            "domainLookupEnd": 1619098076595,
            "redirectStart": 0,
            "requestStart": 1619098076602,
            "unloadEventEnd": 1619098076678,
            "unloadEventStart": 1619098076678,
            "domComplete": 1619098077272,
            "domainLookupStart": 1619098076595,
            "loadEventStart": 1619098077272,
            "domContentLoadedEventEnd": 1619098077196,
            "redirectEnd": 0,
            "connectEnd": 1619098076595
        },
        "navigation": {
            "type": 0,
            "redirectCount": 0
        }
    })
    make_constructor("_vtiming", "PerformanceTiming", EN, EN)
    make_constructor("_vnavigation", "PerformanceNavigation", EN, EN)
    performance['timing'] = Object.assign(_vtiming, performance['timing'])
    performance['navigation'] = Object.assign(_vnavigation, performance['navigation'])
    // window.indexedDB
    make_constructor("indexedDB", "IDBFactory", EN, EN)
    window.indexedDB.__proto__["cmp"]            = function cmp(){debugger;};            safefunction(window.indexedDB["cmp"]);
    window.indexedDB.__proto__["databases"]      = function databases(){debugger;};      safefunction(window.indexedDB["databases"]);
    window.indexedDB.__proto__["deleteDatabase"] = function deleteDatabase(){debugger;}; safefunction(window.indexedDB["deleteDatabase"]);
    window.indexedDB.__proto__["open"]           = function open(){debugger;};           safefunction(window.indexedDB["open"]);
    // window.XMLHttpRequest
    make_constructor("XMLHttpRequest", "XMLHttpRequest", EN, EN, undefined, { allow_illegal: true })
    XMLHttpRequest.prototype["UNSENT"]                = XMLHttpRequest["UNSENT"]                = 0;
    XMLHttpRequest.prototype["OPENED"]                = XMLHttpRequest["OPENED"]                = 1;
    XMLHttpRequest.prototype["HEADERS_RECEIVED"]      = XMLHttpRequest["HEADERS_RECEIVED"]      = 2;
    XMLHttpRequest.prototype["LOADING"]               = XMLHttpRequest["LOADING"]               = 3;
    XMLHttpRequest.prototype["DONE"]                  = XMLHttpRequest["DONE"]                  = 4;
    XMLHttpRequest.prototype["abort"]                 = function abort(){debugger;};                 safefunction(XMLHttpRequest.prototype["abort"]);
    XMLHttpRequest.prototype["getAllResponseHeaders"] = function getAllResponseHeaders(){debugger;}; safefunction(XMLHttpRequest.prototype["getAllResponseHeaders"]);
    XMLHttpRequest.prototype["getResponseHeader"]     = function getResponseHeader(){debugger;};     safefunction(XMLHttpRequest.prototype["getResponseHeader"]);
    XMLHttpRequest.prototype["open"]                  = function open(){debugger;};                  safefunction(XMLHttpRequest.prototype["open"]);
    XMLHttpRequest.prototype["overrideMimeType"]      = function overrideMimeType(){debugger;};      safefunction(XMLHttpRequest.prototype["overrideMimeType"]);
    XMLHttpRequest.prototype["send"]                  = function send(){debugger;};                  safefunction(XMLHttpRequest.prototype["send"]);
    XMLHttpRequest.prototype["setRequestHeader"]      = function setRequestHeader(){debugger;};      safefunction(XMLHttpRequest.prototype["setRequestHeader"]);

    // window.screen
    make_constructor("screen", "Screen", EN, EN)
    screen.__proto__["availWidth"]  = 1920;
    screen.__proto__["availHeight"] = 1040;
    screen.__proto__["width"]       = 1920;
    screen.__proto__["height"]      = 1080;
    screen.__proto__["colorDepth"]  = 24;
    screen.__proto__["pixelDepth"]  = 24;
    screen.__proto__["availLeft"]   = 0;
    screen.__proto__["availTop"]    = 0;
    screen.__proto__["orientation"] = new (class ScreenOrientation {});
    make_constructor("_vorientation", "ScreenOrientation", EN, EN)
    _vorientation.__proto__["angle"]               = 0;
    _vorientation.__proto__["type"]                = "landscape-primary";
    _vorientation.__proto__["onchange"]            = null;
    _vorientation.__proto__["lock"]                = function lock(){debugger;};                safefunction(_vorientation["lock"]);
    _vorientation.__proto__["unlock"]              = function unlock(){debugger;};              safefunction(_vorientation["unlock"]);
    _vorientation.__proto__["addEventListener"]    = function addEventListener(){debugger;};    safefunction(_vorientation["addEventListener"]);
    _vorientation.__proto__["dispatchEvent"]       = function dispatchEvent(){debugger;};       safefunction(_vorientation["dispatchEvent"]);
    _vorientation.__proto__["removeEventListener"] = function removeEventListener(){debugger;}; safefunction(_vorientation["removeEventListener"]);
    screen["orientation"] = _vorientation

    // 用于生成代码用，在环境中无影响，保留即可
    var nn = Object.keys(__cilame__['n'])
    var NN = Object.keys(__cilame__['N'])
    var AA = ['addEventListener', 'dispatchEvent', 'removeEventListener', 'clientInformation']
    return nn.concat(NN).concat(AA)
}
Cilame()



// console.log(localStorage)
// console.log(localStorage.length)
// console.log(localStorage.getItem("$_fb"))
// console.log(localStorage.removeItem("$_fb"))
// console.log(localStorage.getItem("$_fb"))
// console.log(localStorage)
// console.log(localStorage.setItem("$_fb", "hahaha"))
// console.log(localStorage.getItem("$_fb"))
// console.log(localStorage)







// sessionStorage.__proto__["length"]     = 2;
// sessionStorage.__proto__["clear"]      = function clear(){debugger;};      safefunction(sessionStorage.__proto__["clear"]);
// sessionStorage.__proto__["getItem"]    = function getItem(){debugger;};    safefunction(sessionStorage.__proto__["getItem"]);
// sessionStorage.__proto__["key"]        = function key(){debugger;};        safefunction(sessionStorage.__proto__["key"]);
// sessionStorage.__proto__["removeItem"] = function removeItem(){debugger;}; safefunction(sessionStorage.__proto__["removeItem"]);
// sessionStorage.__proto__["setItem"]    = function setItem(){debugger;};    safefunction(sessionStorage.__proto__["setItem"]);
// sessionStorage["$_cDro"] = "1";
// sessionStorage["$_YWTU"] = "FEQUsSBVzv0QWk6YXiwmU1rTQu5fgYnAS0QCjp2noTZ";



















// console.log(1,window)
// console.log(1,window.constructor)
// console.log(2,window.__proto__)
// console.log(2,window.__proto__.constructor)
// console.log(3,window.__proto__.__proto__)
// console.log(3,window.__proto__.__proto__.constructor)
// console.log(4,window.__proto__.__proto__.__proto__)
// console.log(4,window.__proto__.__proto__.__proto__.constructor)
// console.log()
// console.log(5,navigator)
// console.log(5,navigator.constructor)
// console.log(6,navigator.__proto__)
// console.log(6,navigator.__proto__.constructor)
// console.log(7,navigator.__proto__.__proto__)
// console.log(7,navigator.__proto__.__proto__.constructor)
// console.log()
// console.log(7,document)
// console.log(7,document.constructor)
// console.log(8,document.__proto__)
// console.log(8,document.__proto__.constructor)
// console.log(9,document.__proto__.__proto__)
// console.log(9,document.__proto__.__proto__.constructor)
// console.log(10,document.__proto__.__proto__.__proto__)
// console.log(10,document.__proto__.__proto__.__proto__.constructor)
// console.log(11,document.__proto__.__proto__.__proto__.__proto__)
// console.log(11,document.__proto__.__proto__.__proto__.__proto__.constructor)

