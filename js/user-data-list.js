$(function () {
    layui.use(['table','form'], function(){
        let table = layui.table;
        let form = layui.form;
        table.render({
            elem: '#table',
            url: serverUrl + '/manage/statistic',
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
                {field: 'subscribeNumber', title: '新增人数'},
                {field: 'unsubscribeNumber', title: '取关人数'},
                {field: 'increaseNumber', title: '净增人数'},
                {field: 'totalNumber', title: '总人数'},
                {fixed: 'right', title: '操作', align:'center', toolbar: '#barDemo'}
            ]]
        });
        table.on('tool(table)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            var data = obj.data //获得当前行数据
                ,layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent === 'detail'){
                parent.xadmin.add_tab("新增详情","user-data-detail.html?recordTime=" + data.recordTime,true);
            }
        });
    });

});

