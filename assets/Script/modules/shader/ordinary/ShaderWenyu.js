// 文煜的跑马灯
var aDic = {}
aDic.desc = "文煜的跑马灯";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "ordinary/ShaderWenyu"; // 路径 为便于查找
aDic.init = function (uiShader) {
    // ## 使用两张图片 一张图片 还是额外的展示
    initMsg.useModel(2);

    util.openUi("shader/wenyu/WenyuMain", function(panel) {
        uiShader.node_add.addChild(panel);
    })
}

module.exports = aDic;