$(function () {

    layui.use(['form'], function(){
        var form = layui.form;
        $.ajax({
            url: serverUrl + '/manage/tag',
            type: "GET",
            headers: {
                "Authorization": $.cookie('token')
            },
            data:{
                pageNo:1,
                pageSize:10000
            },
            success:function (res) {
                codeCheck(res);
                if (res.code === 200){
                    let list = res.data.list;
                    let htmlStr = "<select name=\"tagId\" lay-verify=\"required\" lay-filter=\"tagId\">\n" +
                        "                        <option value=\"\" >请选择标签</option>";
                    htmlStr += "\n" +
                        "                                            <option value=\"0\" >所有用户</option>";
                    for(let i =0;i < list.length;i++){
                        htmlStr += "\n" +
                            "                                            <option value=\"" + list[i].id + "\" >" + list[i].tagName + "</option>";
                    }
                    htmlStr+="\n" +
                        "                        </select>";
                    $("#tag").html(htmlStr);
                    form.render();
                }else {
                    layer.msg(res.msg, {
                        icon: 2 //2秒关闭（如果不配置，默认是3秒）
                    });
                }
            }
        });
        form.on('submit(*)', function(data){
            layer.confirm('确认发送？', function(index){
                console.log(data.field);
                var index = layer.load();
                $.ajax({
                    url: serverUrl + "/manage/kfMessage/send",
                    type: "POST",
                    headers: {
                        "Authorization": $.cookie('token')
                    },
                    data: JSON.stringify(data.field ),
                    contentType: "application/json",
                    success:function (res) {
                        //关闭
                        layer.close(index);
                        codeCheck(res);
                        if (res.code === 200){
                            // 成功
                            layer.closeAll();
                            layer.msg(res.data, {
                                icon: 1,
                                time: 1500 //2秒关闭（如果不配置，默认是3秒）
                            });
                        }else {
                            layer.msg(res.msg, {
                                icon: 2,
                                time: 3000 //2秒关闭（如果不配置，默认是3秒）
                            });
                        }
                    }
                });
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        })
    });

});

function goMedia() {
    let megType = $("#msgType").val();
    if (megType === "0"){
        parent.xadmin.add_tab('文本素材','text-media-list.html')
    }else if (megType === "5"){
        parent.xadmin.add_tab('图文素材(外链型)','image-text-media-list.html')
    }else if (megType === "6"){
        parent.xadmin.add_tab('图文素材(官方文章)','official-image-text-media-list.html')
    }
}
