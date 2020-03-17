$(function () {

    layui.use(['table','form'], function(){
        var table = layui.table;
        var form = layui.form;
        table.render({
            elem: '#table',
            url: serverUrl + '/manage/media',
            where:{
                msgType: 5
            },
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
                {field: 'id', title: 'ID（可点击复制）',event: "copy"},
                {field: 'name', title: '素材名称'},
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
                layer.confirm('是否删除图文素材', function(index){
                    //向服务端发送删除指令
                    $.ajax({
                        url: serverUrl + "/manage/media/" + data.id,
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
            }else if (layEvent === 'content'){
                // 跳转详情
                parent.xadmin.add_tab('图文素材内容管理','image-text-media-content-list.html?id=' + data.id)
            }else if (layEvent === 'copy'){
                Copy(data.id);
                layer.msg("复制成功，回去粘贴到文本框即可");
            }
        });
        form.on('submit(*)', function(data){
            console.log(data)
            var index = layer.load();
            if (data.field.id === ""){
                // 新增
                $.ajax({
                    url: serverUrl + "/manage/media",
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
                    url: serverUrl + "/manage/media",
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
                                icon: 2 //2秒关闭（如果不配置，默认是3秒）
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
    // 重置表单
    layui.use('form', function(){
        let form = layui.form;
        form.val("form", {
            id:"",
            name:"",
            msgType: 5,
            content: ""
        });
    });
    layer.open({
        title: "添加图文素材",
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
        title: "修改图文素材",
        type: 1,
        content: $('#form'),
        area: ["800px", "600px"],
        maxmin: true,
        shadeClose: true,
        shade:0.4,
    });
}
