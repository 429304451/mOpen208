
cc.Class({
    extends: baseNode,

    properties: {
        
    },

    start () {
        GM.uiChengyu = this;
        this.updateTime = 0;
        this.delayCallArrays = [];  // 这个是延迟几秒后执行的定时器列表
        this.updataCallArrays = []; // 这个是用于临时开定时器执行的列表
        this.addEvents();
    },
    onEnter () {
        this.initDatas();
    },
    initDatas () {
        // 清空
        this.node_add.removeAllChildren();
        this.ans_add.removeAllChildren();
        // ## 数据初始化
        this.selectIndex = null;
        this.kuangTab = [];
        this.kuangIndexTab = [];
        this.unSolveTab = [];   // 还没有填字的表格
        this.ansZiTab = [];     // 答案有哪些字
        this.ansBtnTab = [];
        for (let i = 0; i < 9; i++) {
            this.kuangIndexTab[i] = [];
        }
        // 配置关卡的辅助线
        if (initMsg.peiGuan) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    this.createZiFuzhu(i, j)
                }
            }
        }
        // 当前玩的是第几关
        if (gameData.checkPoint > chengyuPeizi.length-1) {
            gameData.set("checkPoint", chengyuPeizi.length-1);
        } else if (gameData.checkPoint < 1) {
            gameData.set("checkPoint", 1);
        }
        // gameData.set("checkPoint", 1)
        if (initMsg.peiGuan) {
            this.checkPoint = 83;
        } else {
            this.checkPoint = gameData.checkPoint;
        }
        this.peiziDic = chengyuPeizi[this.checkPoint-1];
        var length = this.peiziDic.posx.length;
        var nowIndex = 0;
        this.lb_checkPoint.setLabel("第 "+this.checkPoint+" 关")

        for (let i = 0; i < length; i++) {
            let x = this.peiziDic.posx[i];
            let y = this.peiziDic.posy[i];
            if (i == this.peiziDic.kong[nowIndex]) {
                this.createZiKuang(x, y, this.peiziDic.word[i]);
                nowIndex += 1;
            } else {
                this.createZiAlready(x, y, this.peiziDic.word[i], i)
            }
            this.kuangIndexTab[x][y] = this.kuangTab[this.kuangTab.length-1]
        }

        if (!initMsg.peiGuan) {
            this.createAnsBtns();
            this.setKuangSelect(this.unSolveTab[0].msg.index)
        }
    },
    addEvents () {
        var self = this;
        this.btn_home.quickBt(function () {
            self.touchClose();
            initMsg.backHall();
        });

        this.btn_howplay.quickBt(function () {
            FLUIManager.open("games/chengyu/uPlayWay");
        });

        this.btn_tip.quickBt(function () {
            GM.uiChengyu.makeATip();
        });
    },
    // 提示一下 如果选中的框 是空白的 btn里面有答案  直接点击过去 没有答案 把正确答案下下来 填充上去
    makeATip () {
        var selectKuang = this.kuangTab[this.selectIndex];
        var ansZi = selectKuang.msg.zi;

        // 把所有没完成的字下下来
        for (let i = 0; i < this.unSolveTab.length; i++) {
            if (this.unSolveTab[i].ansBtn && this.unSolveTab[i].msg.right == false) {
                let ansBtn = this.unSolveTab[i].ansBtn;
                // 归位
                ansBtn.active = true;
                this.unSolveTab[i].labStr.string = "";
                this.unSolveTab[i].lab_er.active = false;
                this.unSolveTab[i].msg.right = false;
                this.unSolveTab[i].ansBtn = null;
                ansBtn.setPosition(ansBtn.ansMsg.x, ansBtn.ansMsg.y);
            }
        }

        var btn = null;
        for (let i = 0; i < this.ansBtnTab.length; i++) {
            if (this.ansBtnTab[i].active && this.ansBtnTab[i].ansMsg.zi == ansZi) {
                btn = this.ansBtnTab[i];
                break;
            }
        };

        if (btn) {
            GM.uiChengyu.touchAns(btn)
        }
    },
    // 配置关卡的辅助线
    createZiFuzhu (x, y) {
        var node = cc.instantiate(this.zi_fuzhu);
        node.labStr = node.getChildByName("label").getComponent(cc.Label);
        node.labStr.string = x+","+y;
        this.node_add.addChild(node);
        x = 74*(x-4);
        y = 74*(y-4);
        node.setPosition(x, y);
    },
    // 已经存在的字
    createZiAlready (x, y, zi, index) {
        var node = cc.instantiate(this.zi_kuang);
        // 是否是已经
        node.msg = {x: x, y: y, zi: zi, right: true, index: this.kuangTab.length, over: true}
        node.labStr = node.getChildByName("label").getComponent(cc.Label);
        node.labStr.string = zi;
        var lb_jiao = node.getChildByName("lb_jiao")
        if (initMsg.peiGuan) {
            lb_jiao.active = true;
            lb_jiao.setLabel(index)
        }
        this.node_add.addChild(node);
        x = 74*(x-4);
        y = 74*(y-4);
        node.setPosition(x, y);
        this.kuangTab.push(node);
    },
    // 创建要填写的子框
    createZiKuang (x, y, zi) {
        var node = cc.instantiate(this.zi_kuangbai);
        node.soundStr = "game/chengyu/common"
        node.msg = {x: x, y: y, zi: zi, index: this.kuangTab.length, right: false, over: false, tian: true}
        node.labStr = node.getChildByName("label").getComponent(cc.Label);
        node.lab_er = node.getChildByName("lab_er");
        if (initMsg.peiGuan) {
            node.labStr.string = zi;
        }
        this.node_add.addChild(node);
        x = 74*(x-4);
        y = 74*(y-4);
        node.setPosition(x, y);
        node.quickBt(function () {
            GM.uiChengyu.setKuangSelect(node.msg.index);
        });
        this.kuangTab.push(node);
        this.unSolveTab.push(node);
        this.ansZiTab.push(zi);
    },
    // 创建答案文字
    createAnsBtns () {
        var mX = 84.25;
        util.shuffle(this.ansZiTab);
        for (let i = 0; i < this.ansZiTab.length; i++) {
            let shu = Math.floor((i)/8);
            let x = (i%8 - 4)*mX + mX/2;
            let y = -mX/2 - shu*84.25;

            let node = cc.instantiate(this.zi_ans);
            node.soundStr = "game/chengyu/click"
            node.labStr = node.getChildByName("label").getComponent(cc.Label);
            node.labStr.string = this.ansZiTab[i];
            this.ans_add.addChild(node);
            node.setPosition(x, y);
            node.ansMsg = {x: x, y: y, zi: this.ansZiTab[i]}
            node.quickBt(function () {
                GM.uiChengyu.touchAns(node)
            });
            this.ansBtnTab.push(node);
        };
    },
    // 选中框 的点击事件 回退
    setKuangSelect (index) {
        // 如果身上本身有字 则回退
        var selectKuang = this.kuangTab[index];
        if (selectKuang.ansBtn) {
            let ansBtn = selectKuang.ansBtn;
            var pos = cc.v2(ansBtn.ansMsg.x, ansBtn.ansMsg.y);
            ansBtn.active = true;
            selectKuang.labStr.string = "";
            selectKuang.lab_er.active = false;
            selectKuang.msg.right = false;
            var action = cc.sequence(
                cc.moveTo(0.15, pos),
                cc.callFunc(function () {
                    // selectKuang.labStr 
                }, this)
            );
            selectKuang.ansBtn = null;
            ansBtn.runAc(action);
        }

        if (this.selectIndex == index) {

        } else {
            util.display(this.kuangTab[index], "img2/chengyu/hongkuang")
            if (this.selectIndex != null && this.kuangTab[this.selectIndex].msg.over == false) {
                util.display(this.kuangTab[this.selectIndex], "img2/chengyu/zikuang")
            }   
            this.selectIndex = index;
        }

        for (let i = 0; i < this.unSolveTab.length; i++) {
            if (this.unSolveTab[i] == this.kuangTab[index]) {
                this.lastIndex = i;
                break;
            }
        };
    },
    touchAns (node) {
        // util.mlog(node.ansMsg.zi)
        // 如果目前选中的是白框 那么就移动过去 隐藏
        var selectKuang = this.kuangTab[this.selectIndex];
        // 如果原本就有填充答案了 答案回退
        if (selectKuang.ansBtn) {
            let ansBtn = selectKuang.ansBtn;
            var action = cc.moveTo(0.15, cc.v2(ansBtn.ansMsg.x, ansBtn.ansMsg.y));
            ansBtn.active = true;
            ansBtn.runAc(action);
        }
        var sPos = util.moveToOtherWordPoint(node, selectKuang);
        selectKuang.ansBtn = node;

        var action = cc.sequence(
            cc.moveTo(0.15, sPos),
            cc.callFunc(function () {
                // 隐藏自己 判断是否是正确答案
                node.active = false;
                selectKuang.labStr.string = node.ansMsg.zi;
                if (node.ansMsg.zi == selectKuang.msg.zi) {
                    selectKuang.msg.right = true;
                    // util.mlog("答案正确 现在需要判断整条是否完整 做动作")
                }
                this.ansJudge(selectKuang);
            }, this)
        );

        node.runAc(action);
    },
    ansJudge (selectKuang) {
        var msg = selectKuang.msg;
        var x = msg.x;
        var y = msg.y;

        var careXTab = [];
        var allRight = true;
        for (let i = 0; i > -4; i--) {  
            let add = x+i;
            if (add > -1) {
                if (this.kuangIndexTab[add][y]) {
                    if (this.kuangIndexTab[add][y].labStr.string == "") {
                        break;
                    } else {
                        careXTab.push(this.kuangIndexTab[add][y])
                        if (this.kuangIndexTab[add][y].msg.right == false) {
                            allRight = false;
                        }
                    }
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        for (let i = 1; i < 4; i++) {  
            let add = x+i;
            if (add < 9) {
                if (this.kuangIndexTab[add][y]) {
                    
                    if (this.kuangIndexTab[add][y].labStr.string == "") {
                        break;
                    } else {
                        careXTab.push(this.kuangIndexTab[add][y])
                        if (this.kuangIndexTab[add][y].msg.right == false) {
                            allRight = false;
                        }
                    }
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        // x轴4个填满才有后面的处理
        if (careXTab.length == 4) {
            if (allRight) {
                this.makeSuccess(careXTab, true)
            } else {
                this.makeErrorWarn(careXTab);
            }
        }
        // ### y轴处理
        var careYTab = [];
        allRight = true;
        for (let i = 0; i > -4; i--) {  
            let add = y+i;
            if (add > -1) {
                if (this.kuangIndexTab[x][add]) {
                    if (this.kuangIndexTab[x][add].labStr.string == "") {
                        break;
                    } else {
                        careYTab.push(this.kuangIndexTab[x][add])
                        if (this.kuangIndexTab[x][add].msg.right == false) {
                            allRight = false;
                        }
                    }
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        for (let i = 1; i < 4; i++) {  
            let add = y+i;
            if (add < 9) {
                if (this.kuangIndexTab[x][add]) {
                    
                    if (this.kuangIndexTab[x][add].labStr.string == "") {
                        break;
                    } else {
                        careYTab.push(this.kuangIndexTab[x][add])
                        if (this.kuangIndexTab[x][add].msg.right == false) {
                            allRight = false;
                        }
                    }
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        if (careYTab.length == 4) {
            if (allRight) {
                this.makeSuccess(careYTab, false)
            } else {
                this.makeErrorWarn(careYTab);
            }
        }
        

        if (careYTab.length != 4 && careXTab.length != 4) {
            // 先随便找一个
            this.findTianchong()
        }
    },
    makeErrorWarn (tab) {
        console.log("makeErrorWarn");
        util.playSound("game/chengyu/error")
        for (let i = 0; i < tab.length; i++) {
            if (tab[i].msg.over == false && tab[i].lab_er) {
                tab[i].lab_er.active = true;
                tab[i].lab_er.setLabel(tab[i].labStr.string)
            }
        };
    },
    makeSuccess (tab, xDir) {
        // 全部变成绿色的
        if (xDir) {
            tab.sort(function(a, b){
                return a.x - b.x;
            })
            util.playSound("game/chengyu/right");
            for (let i = 0; i < tab.length; i++) {
                let node = tab[i];
                node.msg.over = true;
                if (node.lab_er) {
                    node.lab_er.active = false;
                }
                if (node.ansBtn) {
                    this.removeAnsBtn(node.ansBtn)
                }
                if (node.canTouch) {
                    node.unbindTouch();
                }
                let action = cc.sequence(
                    cc.delayTime(i*0.1),
                    cc.scaleTo(0.12, 1.2),
                    cc.callFunc(function () {
                        util.display(node, "img2/chengyu/zikuang3")    
                    }, this),
                    cc.scaleTo(0.12, 1),
                );
                node.runAc(action)
            };
            this.findTianchong();
        } else {
            tab.sort(function(a, b){
                return b.y - a.y;
            })
            util.playSound("game/chengyu/right");
            for (let i = 0; i < tab.length; i++) {
                let node = tab[i];
                node.msg.over = true;
                if (node.lab_er) {
                    node.lab_er.active = false;
                }
                if (node.ansBtn) {
                    this.removeAnsBtn(node.ansBtn)
                }
                if (node.canTouch) {
                    node.unbindTouch();
                }
                let action = cc.sequence(
                    cc.delayTime(i*0.1),
                    cc.scaleTo(0.12, 1.2),
                    cc.callFunc(function () {
                        util.display(node, "img2/chengyu/zikuang3")
                        // 如果你身上挂有答案节点 去掉
                    }, this),
                    cc.scaleTo(0.12, 1),
                );
                node.runAc(action)
            };
            this.findTianchong();
        }
    },
    removeAnsBtn (ansBtn) {
        for (let i = 0; i < this.ansBtnTab.length; i++) {
            if (this.ansBtnTab[i] == ansBtn) {
                this.ansBtnTab.splice(i, 1);
                ansBtn.removeFromParent();
                break;
            }
        };
    },
    findTianchong () {
        for (let i = this.lastIndex; i < this.unSolveTab.length; i++) {
            if (this.unSolveTab[i].labStr.string == "") {
                this.setKuangSelect(this.unSolveTab[i].msg.index)
                return;
            }
        };
        for (let i = 0; i < this.unSolveTab.length; i++) {
            if (this.unSolveTab[i].labStr.string == "") {
                this.setKuangSelect(this.unSolveTab[i].msg.index)
                break;
            }
        };

        console.log("findTianchong", this.ansBtnTab.length);
        // 走到这里说明没有下一个填充了
        if (this.ansBtnTab.length == 0) {
            var success = true;
            // 说明全都填写了 至于有没有成功要检查一下
            for (let i = 0; i < this.kuangTab.length; i++) {
                if (this.kuangTab[i].msg.over == false) {
                    success = false;
                    break;
                }
            };
            if (success) {
                this.node.delayCall(function () {
                    this.touchClose();
                    if (GM.front) {
                        GM.front.backHall();
                    }
                    GM.hasWin = true;
                    FLUIManager.open("games/chengyu/uWin");
                }.bind(this), 1);
            }   
        }
    },

})
