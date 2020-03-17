$(function () {

    $.ajax({
        url: serverUrl + "/manage/statistic/info",
        type: "GET",
        headers: {
            "Authorization": $.cookie('token')
        },
        success:function (res) {
            codeCheck(res);
            if (res.code === 200){
                $("#subscribeNumber").html(res.data.subscribeNumber);
                $("#unsubscribeNumber").html(res.data.unsubscribeNumber);
                $("#increaseNumber").html(res.data.increaseNumber);
                $("#totalNumber").html(res.data.totalNumber);
            }else {
                layer.msg(res.msg, {
                    icon: 2  //2秒关闭（如果不配置，默认是3秒）
                });
            }
        }
    });
});
