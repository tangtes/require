/**
 * 模块加载器 V1.1
 * Mooke
 * 2016-2-19
 */
(function (window) {
    //输出日志（字符串或对象）
    function log(obj) { console ? console.log(obj) : alert(obj); }

    //代码加载器（文件路径）,返回对象或null。
    var require = function (path) {
        if (require.cache[path]) return require.cache[path];
        var obj = null;
        require.get(path, function (data) {
            if (data === null) {
                return log("error:require_get. " + path);
            } else {
                obj = require.evalCode("(function(){var module={exports:{}};" + data + ";return module.exports;})();");
                require.cache[path] = obj;  //缓存对象
            }
        });
        return obj;
    };

    //缓存列表
    require.cache = {};

    //ajax获取文件内容（文件路径、回调、是否异步[默认同步]）
    require.get = function (url, callFnt, isAsync) {
        if (isAsync == null) isAsync = false;  //是否异步
        var xhr;
        try {
            xhr = new XMLHttpRequest();
        } catch (e) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (callFnt) callFnt(xhr.status == 200 ? xhr.responseText : null, url);
            }
        }
        xhr.open("GET", url, isAsync);
        xhr.send();
    }

    //在全局执行代码。支持chrome、IE8+
    require.evalCode = function (code) {
        with (window) { return eval(code); }    //(window.execScript || window.eval)(code);    
    };

    //导入指定路径的脚本（路径字符串或数组，回调方法[默认同步，有回调将使用异步]）
    require.include = function (path, callFnt) {
        var isAsync = (typeof callFnt == "function");
        if (typeof path == "object") {    //处理路径数组
            var count = 0, codeList = {};   //异步时记录已加载的路径数量
            for (var i = 0; i < path.length; i++) {
                if (isAsync) {              //异步处理
                    if (require.cache[path[i]]) {
                        count++;
                        if (path.length == count) return callFnt();
                        continue;
                    }
                    require.get(path[i], function (data, url) {
                        if (data === null) {
                            log("error:include_get_async. " + url);
                        } else {
                            if (!require.cache[url]) require.cache[url] = true; //异步操作时先判断
                            codeList[url] = data;     //记录代码
                            count++;
                            if (path.length == count) { //路径都加载后顺序执行代码
                                for (var j = 0; j < path.length; j++) {
                                    require.evalCode(codeList[path[j]]);
                                }
                                codeList = null;
                                callFnt();  //执行异步回调
                            }
                        }
                    }, isAsync);
                } else {
                    require.include(path[i]);   //同步处理
                }
            }
            return;
        }
        if (this.cache[path]) {     //检测缓存
            if (isAsync) callFnt(); //执行异步回调
            return;
        }
        this.get(path, function (data) {
            if (data === null) {
                log("error:include_get. " + path);
            } else {
                require.cache[path] = true;
                require.evalCode(data);
                if (isAsync) callFnt();  //执行异步回调
            }
        }, isAsync);
    };

    if (typeof module == "object" && module.exports) { //CommonJS
        module.exports = require;
    } else {  //Browser
        window.require = require;
    }
})(window);