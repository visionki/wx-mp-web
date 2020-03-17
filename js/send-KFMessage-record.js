$(function () {
    layui.use(['table','form'], function(){
        var table = layui.table;
        table.render({
            elem: '#table',
            url: serverUrl + '/manage/kfMessage/record',
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
                {field: 'tag', title: '目标用户'},
                {field: 'msgType', title: '消息类型',templet: '<div>{{d.msgType == 0?"文本":""}}{{d.msgType == 5?"图文（外链型）":""}}{{d.msgType == 6?"图文（官方文章）":""}}</div>'},
                {field: 'mediaName', title: '素材名称'},
                {field: 'successCount', title: '发送成功数量'},
                {field: 'failCount', title: '发送失败数量'},
                {field: 'total', title: '总用户数'},
                {field: 'sendTime', title: '发送时间'}
            ]]
        });
    });

});

