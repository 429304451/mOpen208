
cc.Class({
    extends: baseNode,

    properties: {

    },

    start () {
        var self = this;

        this.btn_zhujiemian.quickBt(function () {
            self.touchClose();
            initMsg.backHall();
        });
        this.btn_zaici.quickBt(function () {
            self.touchClose();
            GM.plusOne.restart();
        });
    },
    onEnter () {
        this.nowInShow = true;

        this.lb_best.setLabel("最高分 : "+gameData.pluasOneMaxScore);
        this.lb_score.setLabel(GM.plusOne._curScore);
    },
    
});