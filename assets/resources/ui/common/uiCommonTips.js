
cc.Class({
    extends: baseNode,

    properties: {

    },

    start () {

    },
    // util.showTip({desc:"恭喜您！成功获得\n金币+200", btnCount: 1})
    init (obj) {
        this.node.stopAllActions();
        var self = this;

        this.lb_desc.setLabel(obj.desc);
        
        if (obj.confirmText) {
            this.lb_confirm.getComponent(cc.Label).string = obj.confirmText;
        }

        if (obj.cancleText) {
            this.lbl_cancle.getComponent(cc.Label).string = obj.cancleText;
        }

        this.btn_close.onClick(()=>{
            if (obj.cancelFunc) {
                obj.cancelFunc();
            }
            self.touchClose();
        });

        this.btn_confirm.onClick(()=>{
            if (obj.confirmFunc) {
                obj.confirmFunc();
            }
            self.touchClose();
        });

        this.btn_cancel.onClick(()=>{
            if (obj.cancelFunc) {
                obj.cancelFunc();
            }
            self.touchClose();
        });

        if (obj.btnCount && obj.btnCount == 1) {
            this.btn_cancel.active = false;
            this.btn_confirm.x = 0;
        } else {
            this.btn_cancel.active = true;
            this.btn_confirm.x = 120;
        }

        if (obj.time) {
            this.node.delayCall(function () {
                self.touchClose();
            }, obj.time);
        }
    }
});