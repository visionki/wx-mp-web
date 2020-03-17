$(function () {

    layui.use(['table','form'], function(){
        var table = layui.table;
        var form = layui.form;
        table.render({
            elem: '#table',
            url: serverUrl + '/manage/reply',
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
                {field: 'id', title: 'ID'},
                {field: 'keyWord', title: '关键词'},
                {field: 'matchingType', title: '匹配类型',templet: '<div>{{d.matchingType == 0?"精确匹配":"模糊匹配"}}</div>'},
                {field: 'msgType', title: '消息类型',templet: '<div>{{d.msgType == 0?"文本":""}}{{d.msgType == 5?"图文（外链型）":""}}{{d.msgType == 6?"图文（官方文章）":""}}</div>'},
                {field: 'messageName', title: '素材名称'},
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
                        url: serverUrl + "/manage/reply/" + data.id,
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
                                    icon: 2 //2秒关闭（如果不配置，默认是3秒）
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
            var index = layer.load();
            if (data.field.id === ""){
                // 新增
                $.ajax({
                    url: serverUrl + "/manage/reply",
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
                                icon: 2 //2秒关闭（如果不配置，默认是3秒）
                            });
                        }
                    }
                })
            } else {
                // 更新
                $.ajax({
                    url: serverUrl + "/manage/reply",
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

        // form.on('select(msgType)', function(data){
        //
        //     console.log(data.elem); //得到select原始DOM对象
        //     console.log(data.value); //得到被选中的值
        //     console.log(data.othis); //得到美化后的DOM对象
        // });
    });

});

function newTag(){
    // 重置表单
    layui.use('form', function(){
        let form = layui.form;
        form.val("form", {
            id:"",
            keyWord:"",
            matchingType: 0,
            msgType: 0,
            messageId:""
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
