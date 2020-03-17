$(function () {

    layui.use(['table','form'], function(){
        var table = layui.table;
        table.render({
            elem: '#table',
            url: serverUrl + '/manage/media/officialArticle',
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
                {field: 'mediaId', title: 'ID（可点击复制）',event: "copy"},
                {field: 'titles', title: '内含文章数量',templet: '<div>{{d.titles.length-d.titles.replace(/;/g,"").length}}篇</div>'},
                {field: 'coverUrl', title: '封面',templet: '<div><img onclick="show_img(this)" src="{{d.coverUrl}}" style="height: 100%"/></div>'},
                {field: 'titles', title: '图文列表名称'},
                {field: 'createTime', title: '同步时间'},
            ]]
        });


        table.on('tool(table)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            let data = obj.data //获得当前行数据
                ,layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent === 'copy'){
                Copy(data.mediaId);
                layer.msg("复制成功，粘贴到素材id即可");
            }
        })
    });

});

function synchronization(){
    layui.use(['table','form'], function(){
        var table = layui.table;
        let index = layer.load();
        $.ajax({
            url: serverUrl + "/manage/media/officialArticle/synchronization",
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
                    layer.msg('同步成功', {
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
