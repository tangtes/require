# require
JavaScript代码加载器，支持同步、异步加载方式。

#使用方法
同步：require.include("js/jquery.min.js"); <br/>
同步：require.include(["",""]); <br/>

异步：require.include("js/jquery.min.js",function(){ }); <br/>
异步：require.include(["",""],function(){ }); <br/>

同步：var obj = require("js/jquery.min.js"); <br/>

#待实现的计划
1.实现加载CSS文件。 <br/>
2.实现服务器端合并多个脚本（根据文件大小决定合并数量），减少网络请求。 <br/>
3.实现JS库合并为单文件加载。如：jquery-ui包含多个JS和CSS文件，请求时服务器端合并、缓存为单文件。 <br/>