 /* 测试库 */
(function(window){
    var $dev = {
        load: function(){
        }
    };

    if (typeof module == "object" && module.exports) {   // CommonJS
        module.exports = $dev;
    }else{  //Browser
        window.$dev = $dev;
    }
})(window);