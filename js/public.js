$(function () {
    if (!$.cookie('token')){
        // 不存在cookie跳转到登录页
        window.location.href = "./login.html"
    }
    console.log("存在token，是登陆状态")
});

/**
 * 方法拦截器，处理全局时事件
 * @param res 返回数据
 */
function codeCheck(res) {
    if (res.code === 403){
        // TODO 让token失效并跳转到登录页面
        window.parent.location.href = "login.html";
        $.removeCookie("token")
    }
}

/**
 * 显示大图片
 * @param t
 */
function show_img(t) {
    var t = $(t);
    console.log()
    //页面层
    layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        shadeClose: true, //开启遮罩关闭
        end: function (index, layero) {
            return false;
        },
        area: ["800px", "600px"],
        content: '<div style="text-align:center"><img src="' + $(t).attr('src') + '" /></div>'
    });
}

/**
 * 获取url中的参数
 * @param variable
 * @returns {string|boolean}
 */
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

/**
 * 复制到剪贴板
 * @param str
 * @constructor
 */
function Copy(str) {
    var save = function(e) {
        e.clipboardData.setData('text/plain', str);
        e.preventDefault();
    };
    document.addEventListener('copy', save);
    document.execCommand('copy');
    document.removeEventListener('copy', save);
    console.log('复制成功');
}
