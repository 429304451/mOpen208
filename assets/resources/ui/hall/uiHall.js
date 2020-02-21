
cc.Class({
    extends: baseNode,

    properties: {

    },
    start() {
        this.addEvents();
    },
    addEvents () {
        var self = this;
        this.btn_1.quickBt(function () {
            self.touchClose();
            FLUIManager.open("shader/uiShader");
        });

        this.btn_2.quickBt(function () {
            self.touchClose();
            FLUIManager.open("games/chengyu/uiChengyu");
        });

        this.btn_3.quickBt(function () {
            self.touchClose();
            FLUIManager.open("games/plusOne/uiPlusOne");
        });
    },
});