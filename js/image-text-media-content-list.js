$(function () {
    $("#messageId").val(getQueryVariable("id"));
    layui.use(['table','form','upload'], function(){
        var table = layui.table;
        var form = layui.form,
            upload = layui.upload;
        //执行实例
        upload.render({
            elem: '#img' //绑定元素
            ,url: serverUrl + '/manage/file/upload' //上传接口
            ,field : "file"
            ,headers:{
                "Authorization": $.cookie('token')
            }
            ,done: function(res){
                codeCheck(res);
                //上传完毕回调
                $("#img").attr("src",res.data);
                $("#picUrl").val(res.data);
            }
            ,error: function(){
                //请求异常回调
                alert("上传失败")
            }
        });
        table.render({
            elem: '#table',
            url: serverUrl + '/manage/media/articleList/' + getQueryVariable("id"),
            headers: {
                "Authorization": $.cookie('token')
            },
            request: {
                pageName: 'pageNo'
                ,limitName: 'pageSize'
            },
            limit: 15,
            limits: [15,30,45,60],
            page: true,
            parseData: function(res){
                codeCheck(res);
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "count": res.data.total, //解析数据长度
                    "data": res.data.list //解析数据列表
                };
            },
            response: {
                statusCode: 200,
            },
            cols:  [[
                {field: 'title', title: '标题'},
                {field: 'description', title: '副标题'},
                {field: 'picUrl', title: '图片图片',templet: '<div><img onclick="show_img(this)" src="{{d.picUrl}}" style="height: 100%"/></div>'},
                {field: 'url', title: '跳转链接'},
                {field: 'sort', title: '排序序号'},
                {field: 'createTime', title: '创建时间'},
                {field: 'updateTime', title: '更新时间'},
                {fixed: 'right', title: '操作', align:'center', toolbar: '#barDemo'}
            ]]
        });
        //监听行工具事件
        table.on('tool(table)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            var data = obj.data //获得当前行数据
                ,layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent === 'del'){
                layer.confirm('确认删除？', function(index){
                    //向服务端发送删除指令
                    $.ajax({
                        url: serverUrl + "/manage/media/article/" + data.id,
                        type: "DELETE",
                        headers: {
                            "Authorization": $.cookie('token')
                        },
                        success:function (res) {
                            codeCheck(res);
                            if (res.code === 200){
                                // 成功
                                layer.msg('操作成功', {
                                    icon: 1,
                                    time: 1500 //2秒关闭（如果不配置，默认是3秒）
                                });
                                obj.del(); //删除对应行（tr）的DOM结构
                            }else {
                                layer.msg(res.msg, {
                                    icon: 2,
                                    time: 3000 //2秒关闭（如果不配置，默认是3秒）
                                });
                            }
                        }
                    })
                });
            } else if(layEvent === 'edit'){
                editTag(data)
            }
        });
        form.on('submit(*)', function(data){
            console.log(data.field)
            console.log("提交")
            var index = layer.load();
            if (data.field.id === ""){
                // 新增
                $.ajax({
                    url: serverUrl + "/manage/media/article",
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
                            layer.msg('操作成功', {
                                icon: 1,
                                time: 1500 //2秒关闭（如果不配置，默认是3秒）
                            });
                            table.reload("table", {})
                        }else {
                            layer.msg(res.msg, {
                                icon: 2,
                                time: 3000 //2秒关闭（如果不配置，默认是3秒）
                            });
                        }
                    }
                })
            } else {
                // 更新
                $.ajax({
                    url: serverUrl + "/manage/media/article",
                    type: "PUT",
                    headers: {
                        "Authorization": $.cookie('token')
                    },
                    data: JSON.stringify(data.field),
                    contentType: "application/json",
                    success:function (res) {
                        //关闭
                        layer.close(index);
                        codeCheck(res);
                        if (res.code === 200){
                            // 成功
                            layer.closeAll();
                            layer.msg('操作成功', {
                                icon: 1,
                                time: 1500 //2秒关闭（如果不配置，默认是3秒）
                            });
                            table.reload("table", {})
                        }else {
                            layer.msg(res.msg, {
                                icon: 2,
                                time: 3000 //2秒关闭（如果不配置，默认是3秒）
                            });
                        }
                    }
                })
            }
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });

});

function newTag(){
    $("#img").attr("src","images/img.jpg");
    // 重置表单
    layui.use('form', function(){
        let form = layui.form;
        form.val("form", {
            id:"",
            title:"",
            description:"",
            picUrl:"",
            url:"",
            sort:""
        });
    });
    layer.open({
        title: "添加用户标签",
        type: 1,
        content: $('#form'),
        area: ["800px", "600px"],
        maxmin: true,
        shadeClose: true,
        shade:0.4,
    });
}

function editTag(data) {
    // 填充表单
    layui.use('form', function(){
        let form = layui.form;
        form.val("form", data);
    });
    $("#img").attr("src",data.picUrl);
    $("#picUrl").val(data.picUrl);
    layer.open({
        title: "修改用户标签",
        type: 1,
        content: $('#form'),
        area: ["800px", "600px"],
        maxmin: true,
        shadeClose: true,
        shade:0.4,
    });
}
