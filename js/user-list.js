let nickName = "";
let tagName = "";

$(function () {
    layui.use(['table','form'], function(){
        let table = layui.table;
        let form = layui.form;

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
                    // 设置表单里的
                    let list = res.data.list;
                    let htmlStr = "<select name=\"tagName\" lay-filter=\"tagName\">\n" +
                        "                        <option value=\"\" >无标签</option>";
                    for(let i =0;i < list.length;i++){
                        htmlStr += "\n" +
                            "                                            <option value=\"" + list[i].tagName + "\" >" + list[i].tagName + "</option>";
                    }
                    htmlStr+="\n" +
                        "                        </select>";
                    $("#tag").html(htmlStr);
                    // 设置顶部的
                    list = res.data.list;
                    htmlStr = "<select name=\"tagName\" lay-filter=\"tagName\">\n" +
                        "                        <option value=\"\" >全部用户</option>";
                    for(let i =0;i < list.length;i++){
                        htmlStr += "\n" +
                            "                                            <option value=\"" + list[i].tagName + "\" >" + list[i].tagName + "</option>";
                    }
                    htmlStr+="\n" +
                        "                        </select>";
                    $("#tagName").html(htmlStr);

                    form.render();
                }else {
                    layer.msg(res.msg, {
                        icon: 2 //2秒关闭（如果不配置，默认是3秒）
                    });
                }
            }
        });

        table.render({
            elem: '#table',
            url: serverUrl + '/manage/user',
            where:{
                nickName: nickName,
                tagName: tagName
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
                {field: 'id', title: 'ID'},
                {field: 'headUrl', title: '头像',templet: '<div><img onclick="show_img(this)" src="{{d.headUrl}}" style="height: 100%"/></div>'},
                {field: 'nickName', title: '昵称'},
                {field: 'sex', title: '性别',templet: '<div>{{d.sex == 0?"女":"男"}}</div>'},
                {title: '地区',templet: '<div>{{d.country}} {{d.province}} {{d.city}}</div>'},
                {field: 'tagName', title: '标签'},
                {field: 'remark', title: '备注'},
                {field: 'subscribe', title: '是否关注',templet: '<div>{{d.subscribe == 0?"否":"是"}}</div>'},
                {field: 'subscribeTime', title: '关注时间'},
                {field: 'createdTime', title: '创建时间（首次关注时间）'},
                {field: 'updateTime', title: '更新时间（取消关注时间）'},
                {fixed: 'right', title: '操作', align:'center', toolbar: '#barDemo'}
            ]]
        });
        table.on('tool(table)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            var data = obj.data //获得当前行数据
                ,layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent === 'edit'){
                editTag(data)
            }
        });
        form.on('submit(update)', function(data){
            console.log(data.field)
            var index = layer.load();
            // 更新
            $.ajax({
                url: serverUrl + "/manage/user",
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
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        form.on('submit(sreach)', function(data){
            console.log(data.field)
            nickName = data.field.nickName;
            tagName = data.field.tagName;
            table.render({
                elem: '#table',
                url: serverUrl + '/manage/user',
                where:{
                    nickName: nickName,
                    tagName: tagName
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
                    {field: 'id', title: 'ID'},
                    {field: 'headUrl', title: '头像',templet: '<div><img onclick="show_img(this)" src="{{d.headUrl}}" style="height: 100%"/></div>'},
                    {field: 'nickName', title: '昵称'},
                    {field: 'sex', title: '性别',templet: '<div>{{d.sex == 0?"女":"男"}}</div>'},
                    {title: '地区',templet: '<div>{{d.country}} {{d.province}} {{d.city}}</div>'},
                    {field: 'tagName', title: '标签'},
                    {field: 'subscribeTime', title: '关注时间'},
                    {field: 'remark', title: '备注'},
                    {field: 'createdTime', title: '创建时间（首次关注时间）'},
                    {field: 'updateTime', title: '更新时间（取消关注时间）'},
                    {fixed: 'right', title: '操作', align:'center', toolbar: '#barDemo'}
                ]]
            });

            table.reload("table", {});
            // 更新
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });

    });

});


function editTag(data) {
    // 填充表单
    layui.use('form', function(){
        let form = layui.form;
        form.val("form", data);
    });
    layer.open({
        title: "修改用户信息",
        type: 1,
        content: $('#form'),
        area: ["800px", "600px"],
        maxmin: true,
        shadeClose: true,
        shade:0.4,
    });
}
function synchronization(){
    layui.use(['table','form'], function(){
        var table = layui.table;
        let index = layer.load();
        $.ajax({
            url: serverUrl + "/manage/user/synchronization",
            type: "GET",
            headers: {
                "Authorization": $.cookie('token')
            },
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
                    table.reload("table", {})
                }else {
                    layer.msg(res.msg, {
                        icon: 2 //2秒关闭（如果不配置，默认是3秒）
                    });
                }
            }
        });
    });
}
