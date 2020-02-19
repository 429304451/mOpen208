
var ItemMoveActionTag = 123;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        util.setNodeMap(this.node, this);

        // 选择界面当前是第几个 this._ItemIndex
        this.itemIndex = 0;
        // item结点集合
        this.mItemSet = [];
        // Item间隔
        this.mInterval = -300;

        this.loadDisplay();

        this.addBigTouch();
    },

    loadDisplay () {
        // 装入第一个
        this.Wenyu_com.index = 0;
        this.mItemSet.push(this.Wenyu_com)
        // 再装入9个
        for (var i = 1; i < 10; i++) {
            var item = cc.instantiate(this.Wenyu_com);
            item.x = (item.width + this.mInterval) * i;
            item.index = i;
            this.node_add.addChild(item);
            this.mItemSet.push(item);
        }
        var dx = this.mItemSet[this.itemIndex].x;
        this.itemWidth = this.mItemSet[0].width;
        this.moveItem(dx);
        this.adjustItem();
    },
    moveItem (dx) {
        var Xmin = (this.mInterval + this.itemWidth) * this.mItemSet.length/2;
        let Xmax = -1*Xmin;
        var tempWidth = -1*(this.mInterval + this.itemWidth) * this.mItemSet.length;

        for (var i = 0; i < this.mItemSet.length; i++) {
            var item = this.mItemSet[i];
            item.x = item.x + dx;
            // 调整位置， 让她循环起来
            if (item.x < Xmin) {
                item.x += tempWidth;
            } else if (item.x > Xmax) {
                item.x -= tempWidth;
            }
        }

    },
    soundKaka: function () {
        util.playSound("common/kaka");
    },
    stopItemAction: function () {
        for (var i = 0; i < this.mItemSet.length; i++) {
            this.mItemSet[i].stopActionByTag(ItemMoveActionTag);
        }
    },
    // 当触控结束后， 调整一下位置， 结点始终居中
    adjustItem: function (centerItem, speed) {
        // 新的居中 Item
        // 计算好要移动多少
        var dx = null;
        for (var i = 0; i < this.mItemSet.length; i++) {
            var item = this.mItemSet[i];
            var tempDx = item.x;
            // 对中间占有者， 做些惩罚， 让其容易退位
            if (i == this.itemIndex) {
                var tax = (item.width + this.mInterval) / 1.5;
                if (tempDx > 0) {
                    tempDx += tax;
                } else {
                    tempDx -= tax;
                }
            }
            if (dx == null || (Math.abs(tempDx) < Math.abs(dx))) {
                dx = tempDx;
                centerItem = i;
            }
        }

        // 先停止之前的动作
        this.stopItemAction();
        var self = this;
        // 移动过去
        var dx = this.mItemSet[centerItem].x;
        var speed = speed || 1000;
        var delay = Math.abs(dx) / speed;
        for (var i = 0; i < this.mItemSet.length; i++) {
            var action = cc.moveBy(delay, cc.v2(-dx, 0));
            if (i == 0) {
                action = cc.sequence(action, cc.callFunc(function() {
                    self.itemIndex = centerItem;
                }));
            }
            action.setTag(ItemMoveActionTag);
            this.mItemSet[i].runAction(action);
        }
    },

    update (dt) {
        for (var i = 0; i < this.mItemSet.length; i++) {
            if (this.mItemSet[i] && this.mItemSet[i].script) {
                this.mItemSet[i].script.changePosX();
            }
        }
    },

    addBigTouch () {
        this.big_touch.on(cc.Node.EventType.TOUCH_START, function(event) {
            this.startPosX = event.touch._point.x;
            this.stopItemAction();
            this.mPreX = this.startPosX;
        }, this);

        this.big_touch.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
            var dx = event.touch._point.x - this.mPreX;
            this.moveItem(dx);
            this.mPreX = event.touch._point.x;
        }, this);

        this.big_touch.on(cc.Node.EventType.TOUCH_END, function(event) {
            var dx = event.touch._point.x - this.mPreX;
            this.moveItem(dx);
            if (Math.abs(event.touch._point.x - this.startPosX) > 30) {
                this.soundKaka();
            }
            // 调整位置
            this.adjustItem();
            this.mPreX = null;
        }, this);

        // this.big_touch._touchListener.swallowTouches = false;
    }
});