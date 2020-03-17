$(function () {
    console.log()
    layui.use(['table','form'], function(){
        let table = layui.table;
        let form = layui.form;
        table.render({
            elem: '#table',
            url: serverUrl + '/manage/statistic/detail?recordTime=' + getQueryVariable("recordTime"),
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
                {field: 'recordTime', title: '日期'},
                {field: 'tagName', title: '标签'},
                {field: 'number', title: '新增人数'}
            ]]
        });
    });
});
