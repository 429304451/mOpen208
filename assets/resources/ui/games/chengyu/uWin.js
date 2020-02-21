
cc.Class({
    extends: baseNode,

    properties: {
        
    },
    start () {
        this.addEvents();
    },
    onEnter () {
        var action3 = cc.sequence(
            cc.scaleTo(0.8, 1.1).easing(cc.easeOut(0.9)),
            cc.scaleTo(1, 1).easing(cc.easeIn(1)),
        ).repeatForever();
        this.node_start.runAc(action3);
        // 播放恭喜过关声音 比较大就不加入开源项目里面
        if (GM.uPlayWay) {
            GM.uPlayWay.closeSelf();
        }
        this.setContent();
    },
    // 通关的成语显示
    setContent () {
        this.checkPoint = gameData.checkPoint;
        var idiom = chengyuPeizi[this.checkPoint-1].idiom;
        // 如果是游戏通关才进来的 要增加到下一关
        if (GM.hasWin) {
            GM.hasWin = false;
            if (chengyuPeizi[this.checkPoint]) {
                // 说明有下一关的内容 可以增加关卡
                gameData.add("checkPoint", 1);
                // 如果有做排行榜 这里就发送数据给子域
            }
        }
        // 成语内容
        var mX = 200;
        var mY = 60;
        console.log("idiom", idiom);
        for (let i = 0; i < idiom.length; i++) {
            let shu = Math.floor((i)/3);
            let x = (i%3 - 1)*mX;
            let y = -mY/2 - shu*mY;

            let node = cc.instantiate(this.sp_kuang);
            node.getChildByName("label").getComponent(cc.Label).string = idiom[i];
            node.content = idiom[i];

            this.node_content.addChild(node);
            node.setPosition(x, y);

            node.quickBt(function () {
                if (CC_WECHATGAME) {
                    wxUtil.setClipboardData(node.content)
                } else {
                    util.mlog("如果是微信就提示复制到剪贴板")
                }
            });
        }
    },
    addEvents () {
        var self = this;

        this.btn_zhujiemian.quickBt(function () {
            self.touchClose();
            initMsg.backHall();
        });

        this.btn_next.quickBt(function () {
            self.touchClose();
            FLUIManager.open("games/chengyu/uiChengyu");
        });

        this.btn_xuanyao.quickBt(function () {
            util.mlog("炫耀")
        });
    }


})
