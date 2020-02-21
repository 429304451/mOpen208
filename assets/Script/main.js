//游戏入口函数,为主场景main Canvas加载的脚本,尽量简洁

cc.Class({
    extends: cc.Component,
    onLoad () {
        GM.mainScene = this;
        wxUtil.setKeepScreenOn();
        util.init();
        initMsg.init();
    },
    start () {
        if (initMsg.inTest) {
            FLUIManager.open("shader/uiShader");
        } else {
            FLUIManager.open("hall/uiHall");
        }
        // FLUIManager.open("game/uiGame");
        
        // FLUIManager.open("games/chengyu/uiChengyu");  // 成语小游戏
        // FLUIManager.open("games/plusOne/uiPlusOne");
    },
    
});
