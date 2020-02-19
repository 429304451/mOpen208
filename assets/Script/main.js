//游戏入口函数,为主场景main Canvas加载的脚本,尽量简洁

cc.Class({
    extends: cc.Component,
    onLoad () {
        GM.mainScene = this;
        wxUtil.setKeepScreenOn();
    },
    start () {
        util.init();
        // FLUIManager.open("game/uiGame");
        FLUIManager.open("shader/uiShader");
    },
    
});
