cc.Class({
    extends: cc.Component,

    properties: {
        numLabel:{
            default:null,
            type:cc.Label
        },
    },

    onLoad () {
        var self = this;
        this.findTileBg();
        this.node.quickBt(function () {
            if(GM.plusOne.canTouch && !self.game.isCal){
                self.game.isCal = true;
                // 连击次数归零
                initMsg.plusOneDF.combo = 0;
                self.setNum(parseInt(self.numLabel.string)+1, true, false);
            }
        });
    },
    findTileBg () {
        if (this.tile_bg) {

        } else {
            this.tile_bg = cc.find("tile_bg", this.node);
        }
    },
    // 产生新方块
    newTile (row, col) {
        this.node.setPosition(5+(5+this.node.width)*col+this.node.width/2,5+(5+this.node.height)*row+this.node.height/2);
        this.node.setScale(0);
        this.node.runAction(cc.scaleTo(0.1,1));
        this.setArrPosition(row, col);
    },
    // 移动到特定点
    moveTo (row, col){
        this.row = row;
        this.col = col;
        this.node.stopActionByTag(1);
        var action = cc.moveTo(0.2,cc.v2(5+(5+this.node.width)*col+this.node.width/2,5+(5+this.node.height)*row+this.node.height/2));
        this.node.runAction(action);
        action.setTag(1);
    },
    // 方块销毁
    destoryTile (){
        var action = cc.sequence(cc.scaleTo(0.1,0),cc.callFunc(function(node){
            node.destroy();
        },this.node,this.node));
        this.node.runAction(action);
    },
    // 设置方块在数组的位置
    setArrPosition (row, col){
        this.row = row;
        this.col = col;
    },
    // 设置方块数字
    setNum (num, exeLogic, playEffect){
        this.findTileBg();
        this.game.maxNum = num>this.game.maxNum?num:this.game.maxNum;
        this.numLabel.string = num;
        // console.log("initMsg.plusOneColors", initMsg.plusOneColors);
        switch(num){
            case 1:
                this.tile_bg.color = initMsg.plusOneColors.num1;
                break;
            case 2:
                this.tile_bg.color = initMsg.plusOneColors.num2;
                break;
            case 3:
                this.tile_bg.color = initMsg.plusOneColors.num3;
                break;  
            case 4:
                this.tile_bg.color = initMsg.plusOneColors.num4;
                break;
            case 5:
                this.tile_bg.color = initMsg.plusOneColors.num5;
                break;
            case 6:
                this.tile_bg.color = initMsg.plusOneColors.num6;
                break;  
            case 7:
                this.tile_bg.color = initMsg.plusOneColors.num7;
                break;
            case 8:
                this.tile_bg.color = initMsg.plusOneColors.num8;
                break;
            case 9:
                this.tile_bg.color = initMsg.plusOneColors.num9;
                break;  
            case 10:
                this.tile_bg.color = initMsg.plusOneColors.num10;
                break;
            case 11:
                this.tile_bg.color = initMsg.plusOneColors.num11;
                break;
            case 12:
                this.tile_bg.color = initMsg.plusOneColors.num12;
                break;  
            case 13:
                this.tile_bg.color = initMsg.plusOneColors.num13;
                break;
            case 14:
                this.tile_bg.color = initMsg.plusOneColors.num14;
                break;
            case 15:
                this.tile_bg.color = initMsg.plusOneColors.num15;
                break;
            case 16:
                this.tile_bg.color = initMsg.plusOneColors.num16;
                break;
            case 17:
                this.tile_bg.color = initMsg.plusOneColors.num17;
                break;
            case 18:
                this.tile_bg.color = initMsg.plusOneColors.num18;
                break;
            case 19:
                this.tile_bg.color = initMsg.plusOneColors.num19;
                break;
            case 20:
                this.tile_bg.color = initMsg.plusOneColors.num20;
                break;
            default:
                this.tile_bg.color = initMsg.plusOneColors.nums;
                break;
        }
        // 播放特效
        if (playEffect) {
            this.node.runAction(cc.sequence(cc.scaleTo(0.15,1.5),cc.scaleTo(0.15,1)));
        }
        // 消除逻辑
        if (exeLogic){
            // 执行逻辑
            var isMove = this.game.operateLogic(this.row, this.col, parseInt(this.numLabel.string), true);
            // 能量条-1
            if(!isMove){
                console.log("能量条-1");
                for (var i = 1; i <= 5; i++) {
                    var power = this.game["power_"+i];
                    if (power.active) {
                        var costBarAction = cc.sequence(cc.scaleTo(0.1,0), cc.callFunc(function(mPower){
                            mPower.active = false;
                        }, null, power));
                        power.runAction(costBarAction);
                        break;
                    }
                }

                // 游戏结束逻辑判断：能量条为空
                if(this.game.power_5.active == false){
                    if (this.game.scoreNum && this.game.scoreNum.string) {
                        initMsg.plusOneDF.score = this.game.scoreNum.string;
                    }
                    GM.plusOne.canTouch = false;
                    
                    if (GM.plusOne.reliveTime == 0) {
                        GM.plusOne.showRelive();
                    } else {
                        GM.plusOne.showBalance();
                    }
                }
            }
        }
    },
});