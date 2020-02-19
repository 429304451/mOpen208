// 2020/02/16 You-Changwei 429304451 再次整理 准备做开源项目启动
// 定义一个全局变量 作为我开发游戏的常用管理
window.GM = {}
// 好吧 一些基础配置先写在这里吧
GM.version = "1.001"
GM._host = "https://www.youchangwei.top"
GM.mImp = "paoku"
GM.appid = "wx663ac84b119bfe90"

GM.bannerAdid = [
    "adunit-7bda26d2453232e0",  //
]

let adunitids = {
    "1": "adunit-1579ec5db796be94",  //
}
let chapingAdids = {
    "1": "adunit-283e8e9b892d3384",
}

GM.hasLoadImg = {};
GM.hasLoadSound = {};
GM.hasLoadPrefab = {};
GM.hasLoadJson = {};

// 取消点击绑定
cc.Node.prototype.unbindTouch = function() {
    this.off(cc.Node.EventType.TOUCH_START);
    this.off(cc.Node.EventType.TOUCH_MOVE);
    this.off(cc.Node.EventType.TOUCH_END);
    this.off(cc.Node.EventType.TOUCH_CANCEL);

    this.off(cc.Node.EventType.MOUSE_ENTER);
    this.off(cc.Node.EventType.MOUSE_LEAVE);
    return this;
};

GM.pAdd = function (v1, v2) {
    return cc.v2(v1.x + v2.x, v1.y + v2.y);
};

GM.pSub = function (v1, v2) {
    return cc.v2(v1.x - v2.x, v1.y - v2.y);
};

cc.Node.prototype.bindTouchLocate = function(pxOrCcp, py) {
    this.on(cc.Node.EventType.TOUCH_START, function(event) {
        this.lBeganPos_ = this.getPosition();
        this.lBeganPoint_ = cc.v2(event.touch._point.x, event.touch._point.y); //  event.touch._point;
    }, this);

    this.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
        this.setPosition(GM.pAdd(this.lBeganPos_, GM.pSub(event.touch._point, this.lBeganPoint_)));
    }, this);

    this.on(cc.Node.EventType.TOUCH_END, function(event) {
        var pw = cc.winSize.width, ph = cc.winSize.height;
        if (this.getParent() != null) {
            var size = this.getParent().getContentSize();
            pw = size.width;
            ph = size.height;
        }
        console.log("Node Location: ", this.x, this.y, "Percentage:", this.x/pw, this.y/ph);
    }, this);

    // this._touchListener.swallowTouches = false;
    return this;
};

// 快速绑定点击函数 touchSilence-是否静默点击 Shield-是否有点击cdTime
cc.Node.prototype.quickBt = function(fn, touchSilence, Shield) {
    this.unbindTouch();
    
    this.lastClickTime = 0; // 上次点击时间
    this.clickCdTime = 300  // 毫秒
    this.canTouch = true;
    this.iHasTouchBegan = false;

    this.on(cc.Node.EventType.TOUCH_START, function(event) {
        if (this.canTouch == false){
            return;
        }
        this.iHasTouchBegan = true;
        this.BeganScale_ = this.getScale();
        this.BeganOpacity_ = this.opacity;
        if (!touchSilence) {
            this.setScale(this.BeganScale_*0.9);
            this.opacity = this.BeganOpacity_*0.9;
        } else {
            this._startPos = cc.v2(event.currentTouch._point.x, event.currentTouch._point.y);
        }
        
    }, this);

    this.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
        if (this.canTouch == false) {
            return;
        }
        if (this.iHasTouchBegan == false) {
            return;
        }
        this.iHasTouchBegan = false;
        if (!touchSilence) {
            this.setScale(this.BeganScale_);
            this.opacity = this.BeganOpacity_;
        };
    }, this);

    this.on(cc.Node.EventType.TOUCH_END, function(event) {
        if (this.canTouch == false) {
            return;
        }
        if (this.iHasTouchBegan == false) {
            return;
        }
        this.iHasTouchBegan = false;
        if (!touchSilence) {
            this.setScale(this.BeganScale_);
            this.opacity = this.BeganOpacity_;
            util.SoundClick();
        };
        if (!Shield) {
            var now = util.getNow();
            if (now - this.lastClickTime < this.clickCdTime) {
                console.log("---屏蔽过快点击---");
                return;
            };
            this.lastClickTime = now;
        };
        fn && fn(event);

    }, this);

    this.autoClick = function () {
        fn();
    }

    return this;
};

cc.Node.prototype.onClick = function(func, target, isNotScale){
    let button=this.getComponent(cc.Button);
    if(!button){
        button=this.addComponent(cc.Button);
        button.transition = cc.Button.Transition.SCALE;
    }
    if(isNotScale){
        button.transition = cc.Button.Transition.NONE;
    }else{
        button.zoomScale = 0.9
    }
    const CD_TIME = 300;
    let LAST_CLICK_TIME = 0;
    let closure = function(){
        util.SoundClick();
        let now = util.getNow();
        if (now - LAST_CLICK_TIME < CD_TIME ) {
            console.log("---屏蔽过快点击---");
            return;
        }
        LAST_CLICK_TIME = now;
        func.call(target);
    };
    this.off("click");
    this.on("click", closure, target);
    this.autoClick = function () {
        func.call(target);
    }
};
/**
 * 设置节点上label组件的文本
 * @param str
 */
cc.Node.prototype.setLabel=function(str){
    this._lwLabel = this._lwLabel || this.getComponent(cc.Label);
    if (this._lwLabel && str) {
        this._lwLabel.string = str;
    }
};

cc.Node.prototype.delayCall = function(func, delayTime, bRepeat) {
    var action = cc.sequence(
        cc.delayTime(delayTime),
        cc.callFunc(func)
    );
    if (bRepeat) {
        if (typeof bRepeat === "number") {
            action = action.repeat(bRepeat);
        } else {
            action = action.repeatForever();
        }
    };
    this.runAction(action);
};

cc.Node.prototype.runAc = function (action) {
    this.stopAllActions();
    cc.director.getActionManager().removeAllActionsFromTarget(this);
    this.runAction(action);
}
/**
 * 参考c#的String.format() ,使用方式 "ac{0}vb{1}b".format("m","n") => acmvbnb
 * @param args
 * @returns {String}
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};

/***********************Node*************************/
//禁用多点触摸
cc.Node.maxTouchNum = 1;
cc.Node.touchNum = 0;
let __dispatchEvent__ = cc.Node.prototype.dispatchEvent;
cc.Node.prototype.dispatchEvent = function (event) {
    if(this._canMultiTouch)
    {
        return __dispatchEvent__.call(this, event);
    }
    switch (event.type) {
        case cc.Node.EventType.TOUCH_START:
            if (cc.Node.touchNum < cc.Node.maxTouchNum) {
                cc.Node.touchNum++;
                this._canTouch = true;
                __dispatchEvent__.call(this, event);
            }
            break;
        case cc.Node.EventType.TOUCH_MOVE:
            if (!this._canTouch && cc.Node.touchNum < cc.Node.maxTouchNum) {
                this._canTouch = true;
                cc.Node.touchNum++;
            }

            if (this._canTouch) {
                __dispatchEvent__.call(this, event);
            }

            break;
        case cc.Node.EventType.TOUCH_END:
            if (this._canTouch) {
                this._canTouch = false;
                cc.Node.touchNum--;
                __dispatchEvent__.call(this, event);
            }
            break;
        case cc.Node.EventType.TOUCH_CANCEL:
            if (this._canTouch) {
                this._canTouch = false;
                cc.Node.touchNum--;
                __dispatchEvent__.call(this, event);
            }
            break;
        default:
            __dispatchEvent__.call(this, event);
    }
};

//多点触摸屏蔽时,如果被点的界面被销毁或隐藏会导致界面不能点击的问题
let onPostActivated = cc.Node.prototype._onPostActivated;
cc.Node.prototype._onPostActivated = function (active) {
    if(!active && this._canTouch){
    this._canTouch = false;
    cc.Node.touchNum--;
    }
    onPostActivated.call(this,active);
    this.emit("active",active)
};

let onPreDestroy = cc.Node.prototype._onPreDestroy;
cc.Node.prototype._onPreDestroy = function () {
    if(this._canTouch){
    this._canTouch = false;
    cc.Node.touchNum--;
    }

    this.emit("destory")
    onPreDestroy.call(this);
};
/***********************Node*************************/


//重写getChildByName 避免循环
let CHILD_ADDED = "child-added";
let CHILD_REMOVED = "child-removed";

let getChildByName = cc.Node.prototype.getChildByName;
cc.Node.prototype.getChildByName = function(name){
    if(!this._childByName)
    {    
        this._childByName = {}

        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i < len; i++) 
        {
            var childName = locChildren[i]._name
            if(childName)
            {
                this._childByName[childName] = locChildren[i]
            }
        }

        this.on(CHILD_ADDED,child=>{
            if(child._name)
            {
                this._childByName[child._name] = child;
            }
        })
    
        this.on(CHILD_REMOVED,child=>{
            if(child._name && this._childByName[child._name] == child)
            {
                this._childByName[child._name] = undefined;
            }
        })

    }
    return this._childByName[name]
};

// ###util 部分
//工具类
window.util = {};
// 本地测试的时候开启来为True 不要上传到svn
util.isChangweiTest = true
// 屏幕打印函数  一般调试的时候用  往上飘一会  util.mlog("打印")
util.PrintPosDiff = 15;

util.init = function () {
    // benchmarkLevel 微信对手机的评分 1位默认值 <10大概就是低端机
    if (CC_WECHATGAME) {
        util.systemInfo = wx.getSystemInfoSync();
        if (util.systemInfo == null) {
            util.systemInfo = 15;
        }
    } else {
        util.systemInfo = {
            benchmarkLevel: 13,
        }
    }
    if (util.systemInfo.benchmarkLevel < 2) {
        util.systemInfo.benchmarkLevel = 15;
    }
    // 低端机判断
    if (util.systemInfo.benchmarkLevel < 8.5) {
        util.isLowConfig = true;
    } else {
        util.isLowConfig = false;
    }
    console.log("util.isLowConfig", util.isLowConfig);
}

// 规定 up-正面动画 down-背面动画 left左朝向动画 right-右朝向动画 后面跟_die的就是死亡动作
util.verifyAnimation = function(states, aniTab) {
    if (aniTab.hasTransAnimation) {
        return;
    } else {
        // 都是从1开始 到数组结束？ ok 就这么搞
        for (let i in states) {
            if (aniTab[i]) {
                let key = states[i];
                if (typeof aniTab[i][1] === 'number') {
                    aniTab[key] = [];
                    for (let j = aniTab[i][1]; j <= aniTab[i][2]; j++) {
                        let str = aniTab[i][0] + j;
                        if (aniTab[i][3]) {
                            // 需要翻转flipX
                            let dic = {flipX: true, str: str}
                            aniTab[key].push(dic)
                        } else {
                            aniTab[key].push(str)
                        }
                    }
                } else {
                    aniTab[key] = aniTab[i];
                }
            }
        }
        aniTab.hasTransAnimation = true;
    }
}

util.commonFixScale = function (node) {
    if (this.defScale) {

    } else {
        var defaultRatio = 1280/720;
        var ratio = null;
        if (cc.winSize.height/cc.winSize.width > 1) {
            ratio = cc.winSize.height/cc.winSize.width;
        } else {
            ratio = cc.winSize.width/cc.winSize.height;
        }
        var defScale = defaultRatio/ratio;
        if (defScale < 0.99) {
            defScale = defScale/0.95;
            if (defScale > 1) {
                defScale = 1;
            }
        } else if (defScale > 1) {
            defScale = 1;
        }
        this.defScale = defScale;
    }
    
    if (node) {
        var children = node.children;
        for (let i = 0; i < children.length; i++) {
            children[i].setScale(this.defScale);
        }
    }
}

util.getSaveDic = function () {
    var dic = {}
    for (let i in gameData.autoKey) {
        dic[i] = gameData[i]
    }
    return JSON.stringify(dic);
}

util.mlog = function () {
    
    var scene = cc.director.getScene();
    var uTime = 6.5;
    if (util.PrintPosDiff > 1) {
        util.PrintPosDiff -= 1; 
    } else {
        util.PrintPosDiff = 15;
    }
    var mstr = "";
    for (var i in arguments) {
        if (i == 0) {
            mstr += arguments[i];
        } else {
            mstr += " ; " + arguments[i];
        }
    }

    var node = new cc.Node("loadText");
    var label = node.addComponent(cc.Label);
    node.color = new cc.Color(80, 19, 0);
    node.position = cc.v2(cc.winSize.width / 2, util.PrintPosDiff * 30);
    label.fontSize = 30;
    label.Font = "黑体"
    label.string = mstr;
    scene.addChild(node);
    node.zIndex = 9999;

    if (util.isChangweiTest) {
        console.log("mlog--", mstr);
    }
    
    var action = cc.sequence(
        cc.spawn(
            cc.fadeOut(uTime),
            cc.moveBy(uTime, cc.v2(0, 400))
        ),
        cc.removeSelf()
    );
    node.runAction(action);
};
// 加载资源创建精灵  因为是异步加载的  你不能loadSp后就直接得到精灵了  要加载完后对其操作
/*
util.loadSp(self.btn_email, "img2/HelloWorld", function (node) {
    node.setPosition(x, y);
});
*/
util.loadSp = function (parent, path, func) {
    if (GM.hasLoadImg[path]) {
        var node = new cc.Node("loadSp");
        //调用新建的node的addComponent函数，会返回一个sprite的对象 
        var sprite = node.addComponent(cc.Sprite);
        //给sprite的spriteFrame属性 赋值  
        sprite.spriteFrame = GM.hasLoadImg[path];
        parent.addChild(node);
        if (func) {
            func(node);
        }
    } else {
        cc.loader.loadRes(path, cc.SpriteFrame, function(err, spriteFrame){ 
            if (err) {
                cc.error(err.message || err);
                return;
            }
            // cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
            var node = new cc.Node("loadSp");
            //调用新建的node的addComponent函数，会返回一个sprite的对象 
            var sprite = node.addComponent(cc.Sprite);
            //给sprite的spriteFrame属性 赋值  
            sprite.spriteFrame = spriteFrame;
            GM.hasLoadImg[path] = spriteFrame;
            parent.addChild(node);
            if (func) {
                func(node);
            }
        })
    }
};
// 找到两个不同节点的相对相差位置  var pos = util.moveToOtherWordPoint(self.btn_email, self.btn_setting)  self.btn_email.setPosition(pos); 就能移动到相同的相对位置了
util.moveToOtherWordPoint = function(mNode, toNode) {
    var worldPos1 = mNode.convertToWorldSpace(cc.v2(0, 0));
    var worldPos2 = toNode.convertToWorldSpace(cc.v2(0, 0));
    return cc.v2(mNode.x + (worldPos2.x-worldPos1.x), mNode.y + (worldPos2.y-worldPos1.y));
};
// 播放音效 传入本地路径 util.playSound("common/Common_Panel_Dialog_Pop_Sound")
util.playSound = function (path, isLoop) {
    if (gameData.settingEffect == "close") {
        return;
    }
    if (isLoop == null) {
        isLoop = false;
    }
    var fullPath = "audio/"+path;
    var playSoundID = 0;
    if (GM.hasLoadSound[fullPath]) {
        playSoundID = cc.audioEngine.playEffect(GM.hasLoadSound[fullPath], isLoop);
    } else {
        cc.loader.loadRes(fullPath, cc.AudioClip, function (err, clip) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            playSoundID = cc.audioEngine.playEffect(clip, isLoop);
            GM.hasLoadSound[fullPath] = clip;
        });
    }
    return playSoundID;
};
util.stopSound = function (playSoundID) {
    cc.audioEngine.stopEffect(playSoundID);
}
// 播放音乐
util.playMusic = function (path) {
    if (gameData.settingMusic == "close") {
        return;
    }
    var fullPath = "audio/"+path;
    cc.audioEngine.stopMusic(GM.curPlayMusicID);
    cc.audioEngine.stopMusic();
    if (GM.hasLoadSound[fullPath] == null) {
        cc.loader.loadRes(fullPath, cc.AudioClip, function (err, clip) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            GM.curPlayMusicID = cc.audioEngine.playMusic(clip, true);
            GM.hasLoadSound[fullPath] = clip;
        });
    } else {
        GM.curPlayMusicID = cc.audioEngine.playMusic(GM.hasLoadSound[fullPath], true);
    }
}

util.stopMusic = function (musicID) {
    cc.audioEngine.stopMusic(GM.curPlayMusicID);
    cc.audioEngine.stopMusic();
}

// 因为点击下按钮 起来 实在是太常用了 所以单独封装出来 util.SoundClick()
util.SoundClick = function () {
    util.playSound("common/Common_Panel_Dialog_Pop_Sound")
};
// 这里不能去掉img2 的原因是目前还没有封装完全  对于plist的图还没写进来 而且用户传的可能是#xx.png  util.display(self.sp_head, "img2/userhead/touxiang001")
util.display = function(node, fileName) {
    if (fileName === undefined)
        return node.getSpriteFrame();
    else if (typeof fileName === 'string') {
        if (GM.hasLoadImg[fileName]) {
            node.getComponent(cc.Sprite).spriteFrame = GM.hasLoadImg[fileName];
        } else {
            cc.loader.loadRes(fileName, cc.SpriteFrame, function(err, spriteFrame){ 
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                // cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
                GM.hasLoadImg[fileName] = spriteFrame;
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    }
};

util.preloadSp = function (fileName, func) {
    if (GM.hasLoadImg[fileName]) {
        if (func) {
            func(GM.hasLoadImg[fileName]);
        }
    } else {
        cc.loader.loadRes(fileName, cc.SpriteFrame, function(err, spriteFrame){ 
            if (err) {
                cc.error(err.message || err);
                return;
            }
            GM.hasLoadImg[fileName] = spriteFrame;
            if (func) {
                func(GM.hasLoadImg[fileName]);
            }
        });
    }
}
// 获取后缀名 util.getSuffixName("xxx.plist") -> plist
util.getSuffixName = function(filename) {
    var index1 = filename.lastIndexOf(".");
    var index2 = filename.length;
    //后缀名
    var postf  = filename.substring(index1+1, index2);
    return postf
};
// 弹窗的通用动作
util.mShow = function (self) {
    var children = self.node.children;
    for (var i = 0; i < children.length; i++) {
        if(children[i]._name != "lwMaskName" ){
            var oriScale = children[i].getScale()
            var action1 = cc.scaleTo(0.005, 0.5);
            var action2 = cc.scaleTo(0.13, oriScale+0.05);
            var action3 = cc.scaleTo(0.13, oriScale);
            var action4 = cc.scaleTo(0.08, oriScale+0.02);
            var action5 = cc.scaleTo(0.08, oriScale);
            var seq = undefined
            seq = cc.sequence(cc.hide(),action1,cc.show(),action2,action3,action4,action5);
            seq.easing(cc.easeOut(1.0))
            children[i].runAction(seq);
        }
    }
}
// 加载网络图片 如果提示跨域请求失败让服务端处理   util.loadUrlImg(this.sprite_head, "http://tools.itharbors.com/christmas/res/tree.png")
util.loadUrlImg = function(node, picUrl, suffix) {
    if(!picUrl) return;
    // 某些机型可能出现空格，统一去除
    picUrl = picUrl.replace(/\s+/g,"");
    if (GM.hasLoadImg[picUrl]) {
        node.getComponent(cc.Sprite).spriteFrame = GM.hasLoadImg[picUrl];
    } else {
        if (suffix) {

        } else {
            suffix = util.getSuffixName(picUrl);
        }
        cc.loader.load({url: picUrl, type: suffix}, function (err, texTure) {
            if(texTure) {
                var spriteFrame = new cc.SpriteFrame(texTure);
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                // console.log('cache', picUrl)
                GM.hasLoadImg[picUrl] = spriteFrame;
            }
        });
    }
};
// 从父节点脱落 到新的节点去 util.exto(this.hello_word, this.parent_node)
util.exto = function(child, father, zorder) {
    zorder = zorder || 0;
    var oldFather = child.getParent();
    if (oldFather) {
        child.removeFromParent(false);
        father.addChild(child, zorder);
    } else {
        father.addChild(child, zorder);
    }
};
// CocosCreater2.0后已经去掉了颜色穿透  所以要透明穿透只能把这个节点及其子节点设置颜色  util.setColor(this.hello_word, cc.color(0, 0, 0))
util.setColor = function(node, color) {
    node.color = color;
    var children = node.getChildren();
    for (var i = 0; i < children.length; i++) {
        util.setColor(children[i], color);
    }
};

util.getKey = function(tab, key) {
    
    if (tab && tab[key]) {
        return tab[key];
    } else {
        console.log("错误 表没有找到key", tab, key);
        cc.error("tab can't find key = " + key)
        return null
    }
};
/**
 * 显示通用提示窗口
 * @param obj 初始化信息 {desc:提示内容 confirmText：确认按钮文本 cancleText：取消按钮文本 confirmFunc:确认回调 cancelFunc：取消回调 btnCount：按钮个数}
 */ 
util.showTip = function(obj){
    FLUIManager.clearUI("common/uiCommonTips");
    FLUIManager.open("common/uiCommonTips", (uiScript)=>{
        uiScript.init(obj);
    });
};

util.showDlg = function(path, obj){
    FLUIManager.clearUI(path);
    FLUIManager.open(path, (uiScript)=>{
        uiScript.init(obj);
    });
};
/**
 * 显示漂浮文字
 * @param str 文字内容
 * @param time 显示时间
 */
util.showAlert=function(str,time){
    if (!str) {
        return;
    }
    time = time || 2
    FLUIManager.clearUI("common/uiAlert");
    FLUIManager.open("common/uiAlert", (uiScript)=>{
        uiScript.init(str, time);
    });
};

util.ifNull = function(mParam, mDefault){
    if (mParam == null) {
        return mDefault;
    } else {
        return mParam;
    }
};
/**
 * 返回时间搓对应的日期
 * @param time
 * @returns {*}
 */
util.getDateString=function(time){
    return new Date(time*1000).Format("yyyy-MM-dd hh:mm:ss");
};
// 获取当前时间
util.getNow = function () {
    return new Date().getTime();
}
// 获取当前时间
util.getDate = function () {
    var date = new Date();
    date = (date.getMonth() + 1)*100 + date.getDate();
    return date;
}
util.encodeTab = function (tab) {
    var str = "";
    for (let key in tab) {
        str = str+key+"="+util.urlencode(tab[key])+"&";
    }
    str = str.slice(0, -1);
    return str;
}
util.urlencode = function(str) {  
    if (typeof str === 'object') {
        str = JSON.stringify(str)
    }
    str = (str + '').toString();   
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
} 
util.setNodeMap = function (node, nodeDict) {
    var linkWidget = function(self, nodeDict) {
        var children = self.children;
        for (var i = 0; i < children.length; i++) {
            var widgetName = children[i].name;
            if (widgetName && widgetName.indexOf("_") > 0) {
                var nodeName = widgetName;
                if (nodeDict[nodeName]) {
                    console.log("控件名字重复!" + children[i].name);
                }
                nodeDict[nodeName] = children[i];
            }
            if (children[i].childrenCount > 0) {
                linkWidget(children[i], nodeDict);
            }
        }
    }.bind(this);
    linkWidget(node, nodeDict);
}

util.setNodeMapAll = function (node, nodeDict) {
    var linkWidget = function(self, nodeDict) {
        var children = self.children;
        for (var i = 0; i < children.length; i++) {
            var nodeName = children[i].name;
            nodeDict[nodeName] = children[i];
            if (children[i].childrenCount > 0) {
                linkWidget(children[i], nodeDict);
            }
        }
    }.bind(this);
    linkWidget(node, nodeDict);
}

util.getRandom = function (maxSize) {
    return Math.floor(Math.random() * maxSize) % maxSize;
}
util.tabcontains = function (tab, value) {
    for (var i = 0; i < tab.length; i++) {
        if (tab[i] == value) {
            return true;
        }
    }
    return false;
};
util.openUi = function(uiPath, callBack) {
    let fullUrl = 'ui/' + uiPath;
    if (GM.hasLoadPrefab[fullUrl]) {
        var temp = cc.instantiate(GM.hasLoadPrefab[fullUrl]);
        callBack(temp);
    } else {
        cc.loader.loadRes(fullUrl, function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            GM.hasLoadPrefab[fullUrl] = prefab;
            var temp = cc.instantiate(prefab);
            callBack(temp);
        });
    }
}
util.useShader = function(sprite, lab) {
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        console.warn('Shader not surpport for canvas');
        return;
    }
    if (!sprite || !sprite.spriteFrame || sprite.lab == lab) {
        return;
    }
    if (lab) {
        if (lab.vert == null || lab.frag == null) {
            console.warn('Shader not defined', lab);
            return;
        }
        cc.dynamicAtlasManager.enabled = false;
        
        let material = new ShaderMaterial();
        let name = lab.name ? lab.name : "None"
        material.callfunc(name, lab.vert, lab.frag, lab.defines || []);

        let texture = sprite.spriteFrame.getTexture();
        material.setTexture(texture);
        material.updateHash();

        sprite._material = material;
        sprite._renderData.material = material;
        sprite.lab = lab;
        return material;
    } else {
        // 这个就是直接变成灰色
        sprite.setState(1);
    }
}
util.useLabShader = function (sprite, shader) {
    
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        console.warn('Shader not surpport for canvas');
        return;
    }
    if (!sprite || !sprite.spriteFrame || sprite.getState() === shader) {
        return;
    }
    // 传入shader就直接用了
    if (ShaderType[shader]) {
        let name = ShaderType[shader];
        let lab = ShaderLab[name];
        if (!lab) {
            console.warn('Shader not defined', name);
            return;
        }
        cc.dynamicAtlasManager.enabled = false;
        
        let material = new ShaderMaterial();
        material.callfunc(name, lab.vert, lab.frag, lab.defines || []);

        let texture = sprite.spriteFrame.getTexture();
        material.setTexture(texture);
        material.updateHash();

        sprite._material = material;
        sprite._renderData.material = material;
        sprite._state = shader;
        return material;
    }
    else {
        // 这个就是直接变成灰色
        sprite.setState(1);
    }
}
// textLabel-要处理的label maxNum-最多显示几位中文字符 超过的话显示...
util.setTextMaxCharCode = function (str, maxNum) {
    if (maxNum == null) {
        maxNum = 4;
    }
    if (str.length <= maxNum) {
        return str;
    } else {
        // 区别中英文字符 默认为 9个英文字符长度==5个中文字符等长
        var num = 0;
        for (let i in str) {
            var charCode = str.charCodeAt(i);
            if (charCode > 32 && charCode < 127) {
                num += 5/9;
            } else {
                num += 1;
            }
            if (num > maxNum) {
                str = str.substr(0, i);
                str += ".."
                return str;
            }
        }
        return str;
    }
}
util.getStrLength = function (str) {
    var num = 0;
    for (let i in str) {
        var charCode = str.charCodeAt(i);
        if (charCode > 32 && charCode < 127) {
            num += 5/9;
        } else {
            num += 1;
        }
    }
    return num;
}

// 获得两点之间顺时针旋转的角度
util.TwoPointAngle = function (pointFrom, pointTo) {
    // console.log("pointFrom", pointFrom, pointTo);
    var dx = Math.abs(pointFrom.x - pointTo.x);
    var dy = Math.abs(pointFrom.y - pointTo.y);
    var z = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    var cos = dy / z;
    var radina = Math.acos(cos) // 用反三角函数求弧度
    var angle = Math.floor(180 / (Math.PI / radina)) // 将弧度转换成角度
    if (pointTo.x > pointFrom.x && pointTo.y > pointFrom.y) { // 鼠标在第四象限
        angle = 180 - angle;
    }else if (pointTo.x == pointFrom.x && pointTo.y > pointFrom.y) { // 鼠标在y轴负方向上
        angle = 180;
    }else if (pointTo.x > pointFrom.x && pointTo.y == pointFrom.y) { // 鼠标在x轴正方向上
        angle = 90;
    }else if (pointTo.x < pointFrom.x && pointTo.y > pointFrom.y) {  // 鼠标在第三象限
        angle = 180 + angle;
    }else if (pointTo.x < pointFrom.x && pointTo.y == pointFrom.y) { // 鼠标在x轴负方向
        angle = 270;
    }else if (pointTo.x < pointFrom.x && pointTo.y < pointFrom.y) {  // 鼠标在第二象限
        angle = 360 - angle;
    }
    angle = -180 - angle; 
    return angle;
}

util.loadJson = function (path, func) {
    var fullPath = "json/"+path;
    if (GM.hasLoadJson[fullPath] == null) {
        cc.loader.loadRes(fullPath, function(err, res) {
            if (err) {
                cc.error(err);
            } else {
                GM.hasLoadJson[fullPath] = res.json
                if (func != null)
                    func(res.json)
            }
        });
    } else {
        if (func) {
            func(GM.hasLoadJson[fullPath])
        }
    }
};
util.rand = function (st, ed) {
    if (ed == null) {
        ed = st;
        st = 0;
    }
    return Math.random() * (ed - st) + st;
};
util.randInt = function (st, ed) {
    return Math.round(this.rand(st, ed));
}
util.pointDistance = function (a, b) {
    var x = a.x-b.x, y = a.y-b.y;
    return Math.sqrt(x * x + y * y);
}
util.pointDirectAdd = function (mPoint, toPoint, add) {
    var distance = util.pointDistance(mPoint, toPoint)
    var x = (toPoint.x - mPoint.x)/distance;
    var y = (toPoint.y - mPoint.y)/distance;
    // return cc.v2(mPoint.x+add*x/distance, mPoint.y+add*y/distance)
    return cc.v2(toPoint.x+add*x, toPoint.y+add*y)
}
util.isNull = function(x){
    if (x == undefined) {
        return true
    }
    if (x === "") {
        return true
    }
    if(x == null){
        return true
    }
    return false
}
//深拷贝对象
util.copyObj = function(obj1,obj2){
    var obj2 = obj2 || {};
    for (let name in obj1){
        if (typeof obj1[name] === "object") { 
            obj2[name]= (obj1[name].constructor===Array)?[]:{};
            util.copyObj(obj1[name],obj2[name]);
        } else {
            obj2[name]=obj1[name];
        }
    }
    return obj2;
}

util.formatNum = function (num) {
    if (num == null) {
        num = 0;
    }
    var str = "" + num;
    var count = 0
    var result = ""

    for(let i = str.length-1; i >= 0; i--) { 
        count += 1;
        var s = str[i];
        result = s+result;
        if (count == 3 && i != 0) {
            result = ","+result
            count = 0
        }
    }
    return result;
}

let thousandTab = {
    th1: Math.pow(10,3),
    th2: Math.pow(10,6),
    th3: Math.pow(10,9),
    th4: Math.pow(10,12),
    th5: Math.pow(10,15),
    th6: Math.pow(10,18),
    th7: Math.pow(10,21),
    th8: Math.pow(10,24),
}

// 赛车所用的简易表示num字符
util.getEasyNum = function(realNum) {
    realNum = Math.floor(realNum);

    var result = ""
    var baseNum = 100000
    // 五位数以内 全部显示
    if (realNum < baseNum) {
        result = util.formatNum(realNum)
    } else if (realNum >= baseNum && realNum < baseNum*thousandTab.th1) {
        var countNum = Math.floor(realNum/thousandTab.th1)
        result = util.formatNum(countNum)+"K"
    } else if (realNum >= baseNum*thousandTab.th1 && realNum < baseNum*thousandTab.th2) {
        var countNum = Math.floor(realNum/thousandTab.th2)
        result = util.formatNum(countNum)+"M"
    } else if (realNum >= baseNum*thousandTab.th2 && realNum < baseNum*thousandTab.th3) {
        var countNum = Math.floor(realNum/thousandTab.th3)
        result = util.formatNum(countNum)+"B"
    } else if (realNum >= baseNum*thousandTab.th3 && realNum < baseNum*thousandTab.th4) {
        var countNum = Math.floor(realNum/thousandTab.th4)
        result = util.formatNum(countNum)+"T"
    } else if (realNum >= baseNum*thousandTab.th4 && realNum < baseNum*thousandTab.th5) {
        var countNum = Math.floor(realNum/thousandTab.th5)
        result = util.formatNum(countNum)+"P"
    } else if (realNum >= baseNum*thousandTab.th5 && realNum < baseNum*thousandTab.th6) {
        var countNum = Math.floor(realNum/thousandTab.th6)
        result = util.formatNum(countNum)+"E"
    } else if (realNum >= baseNum*thousandTab.th6 && realNum < baseNum*thousandTab.th7) {
        var countNum = Math.floor(realNum/thousandTab.th7)
        result = util.formatNum(countNum)+"o"
    }
    return result
}

//深拷贝数组
util.copyArr = function(arr1){
    let arr2 = JSON.parse(JSON.stringify(arr1))
    return arr2;
}

util.shuffle = function (array) {
    for (var i = array.length-1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = array[randomIndex]; 
        array[randomIndex] = array[i]; 
        array[i] = itemAtIndex;
    }
}
// ##FLUIManager
window.FLUIManager = {
    //当前打开的窗口列表
    uiList: [],
    //缓存中的窗口列表
    cacheUIList: [],
    //正在打开的窗口
    openingUI:{},
};
/**
 * 打开界面
 * @param {String} uiPath ui预制体的相对路径如:"hall/uiHall",注:路径必需在resource/ui目录下
 * @param {Function} callBack 加载成功回调 
 * @param {Function} bWin 是否是注窗口
 */
FLUIManager.open = function(uiPath, callBack, bWin) {
    if (this.openingUI[uiPath]) {
        cc.error("窗口正在打开中:"+uiPath);
        return
    }
    this.openingUI[uiPath] = true;
    var initFame = function(frame) {
        var panel = frame.getComponent(frame._name);
        if (callBack) {
            callBack(panel);
        }
        if (panel) {
            panel.show();
        }
        this.openingUI[uiPath] = null;
    }.bind(this)

    var findtemp = this.findUI(uiPath)
    if (findtemp) {
        cc.error("窗口重复创建,直接显示上一个窗口:"+uiPath);
        findtemp.active = true;
        initFame(findtemp);
        return;
    }
    // 缓存--
    for (var i = 0; i < FLUIManager.cacheUIList.length; i++) {
        var temp = FLUIManager.cacheUIList[i];
        if (temp && temp.pathName === uiPath) {
            temp.active = true;
            temp.parent = cc.Canvas.instance.node;
            temp.bWin = bWin;
            FLUIManager.uiList.push(temp)
            FLUIManager.cacheUIList.splice(i, 1);
            initFame(temp);
            return;
        }
    }
    // 非缓存--
    cc.loader.loadRes('ui/' + uiPath, function(err, prefab) {
        if (err) {
            this.openingUI[uiPath] = null;
            cc.error(err.message || err);
            return;
        }
        var temp = cc.instantiate(prefab);
        temp.pathName = uiPath;
        temp.parent = cc.Canvas.instance.node;
        temp.bWin = bWin;
        FLUIManager.uiList.push(temp)
        initFame(temp);
    }.bind(this));
};

FLUIManager.closeAllDlg = function () {
    for (let index = FLUIManager.uiList.length - 1; index >= 0; index--) {
        var temp = FLUIManager.uiList[index];
        if (temp && !temp.bWin) {
            temp.active = false;
            var panel = temp.getComponent(temp._name);
            if(panel && panel.hide) {
                panel.hide();
            }
            temp.removeFromParent(false);
            FLUIManager.cacheUIList.push(temp);
            FLUIManager.uiList.splice(index, 1);
        }
    }
}
/**
 * 关闭界面
 * @param {String,object} uiPath ui预制体的相对路径,也可以传入窗口句柄,如:FLUIManager.close(this);
 * @param {Function} callBack 成功回调 
 * @param {Bool} clear 清除界面,默认不清除界面 
 */
FLUIManager.close = function(uiPath, callBack, clear) {
    for (var i = FLUIManager.uiList.length - 1; i >= 0; i--) {
        var temp = FLUIManager.uiList[i];
        if (temp && (temp.pathName === uiPath || (typeof (uiPath) == "object" && temp === uiPath.node))) {
            temp.active = false;
            if (clear) {
                temp.removeFromParent(true);
            } else {
                var panel = temp.getComponent(temp._name);
                if(panel && panel.hide)
                {
                    panel.hide();
                }
                temp.removeFromParent(false);
                FLUIManager.cacheUIList.push(temp);
            }
            FLUIManager.uiList.splice(i, 1);
            if (callBack) {
                callBack();
            }
            return;
        }
    }
    cc.error("FLUIManager.close fail not found ui "+uiPath)
}

/**
 * 查找界面
 * @param {String,Object} uiPath ui预制体的相对路径
 * @param {Bool} uiScript 是否返回预制体(否则返回Node)
 * @returns {cc.Node,baseNode}  窗口句柄,uiScript
 */
FLUIManager.findUI = function(uiPath,uiScript) {
    for (var i = FLUIManager.uiList.length - 1; i >= 0; i--) {
        var temp = FLUIManager.uiList[i];
        if (temp && temp.pathName === uiPath) {
            if (typeof(uiScript) !== "undefined") {
                return temp.getComponent(temp._name);
            }
            return temp;
        }
    }
};
/**
 * 用于调用前清理一下，防止重复创建窗口
 * @param path
 */
FLUIManager.clearUI = function (uiPath, clear) {
    if(this.findUI(uiPath)) {
        if (clear) {
            this.close(uiPath, null, clear);
        } else {
            this.close(uiPath);
        }
    }
};
/**
 * 退出游戏
 */
FLUIManager.exitGame = function () {
    if (CC_WECHATGAME)
    {
        wx.exitMiniProgram()
    }
};

// ###Http 部分
window.HTTP = {
    HTTPTimeout: 2000,
    iMvid: 1,
    maxFailTime: 1,
    fileList: {},
    /**
     * @param params 参数列表
     * @param callback 成功回调
     * @param failCallback 失败回调可选
     */
    GET: function (url, params, callback, failCallback) {
        var hasReturnFail = false
        var hasFailCalled = false
        var strUrl = url; // + "?";
        let addUrl = util.encodeTab(params)
        if (addUrl != "") {
            strUrl += "?" + addUrl;
        }
        var onSuc = function() {
            this.fileList[strUrl] = 0;
        }.bind(this);
        
        var onFail = function()
        {
            if(hasFailCalled) {
                return
            }
            hasFailCalled = true
            if (!this.fileList[strUrl]) {
                this.fileList[strUrl] = 1;
                this.GET(url,params, callback,failCallback)
            } else {
                this.fileList[strUrl] ++;
                if (this.fileList[strUrl] >= this.maxFailTime)
                {
                    if(failCallback && !hasReturnFail){
                        hasReturnFail = true
                        failCallback()
                    }
                    this.fileList[strUrl] = 0;
                    return;
                } else {
                    this.GET(url,params, callback,failCallback)
                }
            }
        }.bind(this);
        var time = (new Date()).Format("m:s.S");
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onerror = function () {
            console.log("[断网重连]")
            onFail()
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4)
            {
                if ( xhr.status >= 200 && xhr.status < 300) {
                    if(callback)
                    {
                        var respone = xhr.response;
                        console.log("rev:",respone);
                        var resObj = JSON.parse(respone);
                        callback(resObj);
                    }
                    onSuc();
                }else{
                    //真机断网不走
                    onFail();
                    console.log("rev error:",strUrl,xhr.readyState,xhr.status);
                }
            }
        };
        xhr.open("GET", strUrl, true);
        xhr.timeout = this.HTTPTimeout;
        xhr.send();
    },
    POST: function (url, params, suc,fail) {
        var hasFailCalled = false
        var onFail = ()=>
        {
            if (hasFailCalled) {
                return
            }
            hasFailCalled = true;
            console.log(url,"[返回失败]")
            fail && fail();
        }
        var sendParams = util.encodeTab(params)
        if (sendParams.length > 4000) {
            cc.error("数据过长,发送失败")
            return;
        }
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var respone = xhr.responseText;
                    if (suc) {
                        var resObj = JSON.parse(respone);
                        suc(resObj);
                    }
                }else{
                    onFail();
                }
            }
        };
        xhr.onerror = function () {
            onFail();
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
        xhr.timeout = this.HTTPTimeout;
        xhr.send(sendParams);
    },
};

// ###wxUtil 部分
window.wxUtil = {};
/**
 * 微信转发分享
 * @param obj {title:分享标题,query:分享时带的字段,success:分享成功回调,fail:分享失败回调,imageUrl:转发显示图片的链接,显示图片长宽比是 5:4}
 */
wxUtil.shareToWx = function (obj) {
    if (!CC_WECHATGAME) {
        util.showAlert("当前不是微信小游戏环境\n无法分享")
        return;
    }
    GM.waitShareCallBack = true
    wxData.set("shareCallback", null)
    wxData.set('shareTime', util.getNow())

    let shareInfo = initMsg.getShareInfo();
    obj.title = shareInfo.title;
    obj.imageUrl = shareInfo.imageUrl;
    obj.query = shareInfo.query;
    // 统计分享次数
    // console.log("统计分享次数", shareInfo.shareUrl);
    let suc = obj.success
    let fail = obj.fail

    obj.fail = function (res) {
        console.log("回调分享失败");
        if (GM.waitShareCallBack) {
            gameData.add("shareTime", 1);
            GM.waitShareCallBack = false;
            fail(res)
        }
    }

    obj.cancel = function (res) {
        console.log("回调分享取消");
        if (GM.waitShareCallBack) {
            gameData.add("shareTime", 1);
            GM.waitShareCallBack = false;
            fail(res)
        }
    }
    obj.success = function (res) {
        if (GM.waitShareCallBack) {
            GM.waitShareCallBack = false;
            gameData.add("shareTime", 1);
            suc(res)
        }
    }

    wxData.set("shareCallback", obj);
    wx.showShareMenu({
        withShareTicket: true,
        success: () => {
            console.log("showShareMenu 成功");
            wx.shareAppMessage(obj);
        },
        fail: () => {
            console.log("showShareMenu 失败");
        },
        cancel: () => {
            console.log("showShareMenu 取消转发");
            obj.fail()
        },
    });
};

wxUtil.setClipboardData = function (data) {
    if (CC_WECHATGAME) {
        wx.setClipboardData({
            data: data, //公众号id
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        console.log("复制成功：", res.data);
                    }
                });
            }
        });
    }
}

wxUtil.startOtherGame = function (strAppID, path, callback) {
    if (!CC_WECHATGAME || wx.navigateToMiniProgram == null) {
        console.log('当前不是微信小程序环境!', strAppID, path)
        return
    }
    wx.navigateToMiniProgram({
        appId: strAppID,
        path: path,
        extraData: {},
        envVersion: 'release',
        success(res) {
            console.log(res, "[打开成功]")
            if (callback) {
                callback(true)
            }
        },
        fail(res) {
            console.log(res, "[打开失败]")
            if (callback) {
                callback(false)
            }
        },
    })
};

wxUtil.getSystemInfoSync = function () {
    if (CC_WECHATGAME) {
        return wx.getSystemInfoSync()
    }
}

wxUtil.vibrate = function() {
    if (CC_WECHATGAME) {
        if (gameData.get("settingVibrate") == "open"){
            wx.vibrateLong({});
        }
    }
}

//使手机发生较短时间的振动（15 ms）
wxUtil.vibrateShort = function () {
    if (CC_WECHATGAME) {
        if (gameData.get("settingVibrate") == "close") {
            return
        }
        wx.vibrateShort({
            success: res => {
                console.log('震动成功');
            },
            fail: (err) => {
                console.log('震动失败');
            }
        })
    }
}

//设置屏幕常亮不休眠
wxUtil.setKeepScreenOn = function () {
    if (!CC_WECHATGAME) {
        return
    }
    wx.setKeepScreenOn({
        keepScreenOn: true,
        success: res => {
            console.log('设置成功');
        },
    })
}

// ###baseData 事件通知部分
let _dataEvent = cc.systemEvent;
let _saveKey = "";
window.baseData = cc.Class({
    properties: {
        _eventHandlers:{
            default:{}
        },
    },
    //设置保存的关键字头.一般为用户名
    setSaveKey(key) {
        _saveKey = key;
    },
    /**
    * 设置数据
    * @param {String} key 数据索引 
    * @param {Any} type 数据类型
    * @param {Any} value 数据值 
    */
    set(key, value, type) {
        //不加此判断,在creator编辑器中会报错
        let eventKey = this.__cid__+key
        this[key] = type?type(value):value;
        if(this._eventHandlers[eventKey])
        {
            for(let i in this._eventHandlers[eventKey])
            {
                let handler = this._eventHandlers[eventKey][i]
                if(handler) {
                    if(handler.activeInHierarchy) {
                        handler.emit(eventKey, value)
                    } else {
                        if(handler._catchEvents) {
                            handler._catchEvents[eventKey] = value
                        } else {
                            handler._catchEvents = {}
                            handler.on("active", active=>{
                            if (active) {
                                for(let key in handler._catchEvents)
                                {
                                    handler.emit(key, handler._catchEvents[key])
                                }
                                handler._catchEvents = {}
                            }
                        })
                    }
                }
            }
            }
        }
        if (_dataEvent) {
            _dataEvent.emit(eventKey,value);
        }
        return value
    },
    //加数值,必须是数字类型
    add (key, value) {
        this.plus(key, value)
    },
    get (key) {
        return this[key];
    },
    /**
    * 加减数据
    * @param {String} key 数据索引 
    * @param {int,floot} value 数据值，加减前最好要格式化parseInt,parseFloat确保不是其他类型
    */
    plus (key, value) {
        let oriValue = Number(this.get(key))
        let addValue = Number(value)
        if (!addValue && addValue!== 0) {
            cc.error("plus value error key value = ",key,value)
            return
        }
        this.set(key, oriValue + addValue)
    },
    /**
    * 数据监听
    * @param {String} key 数据索引 
    * @param {Function}} callback 回调,在首次调用或数据发生改变时会调用(数据不可为undefine) 
    */
    on (key, callback, handler) {
        if (typeof(callback) !== "function") {
            return;
        }
        //不加此判断,在creator编辑器中会报错
        if (handler) {
            handler = handler.node || handler
            let eventKey = this.__cid__+key
            handler.on(eventKey, callback, handler);
            this._eventHandlers[eventKey] = this._eventHandlers[eventKey] || []
            let hasPushed = false
            for (let id in this._eventHandlers[eventKey]) {
                if(handler == this._eventHandlers[eventKey][id]) {
                    hasPushed = true
                    break;
                }
            }
            if (!hasPushed) {
                this._eventHandlers[eventKey].push(handler)
            }
        } else if(_dataEvent) {
            _dataEvent.on(this.__cid__+key,callback);
        }
        var value = this.get(key);
        if (value !== undefined) {
            callback(value);
        }
    },
    off(key,callback,handler)
    {
        if (handler){
            handler = handler.node || handler
            if (callback) {
                handler.off(this.__cid__+key,callback,handler);
            } else {
                handler.targetOff(this.__cid__+key);
            }
        } else if(_dataEvent) {
            _dataEvent.off(this.__cid__+key,callback);
        }
    },
    /**
    * 绑定数据到cc.Label,cc.EditBox上,显示的数值会实时变化
    * @param {String} key 数据索引 
    * @param {cc.Label}} lable 显示对应值的控件 
    * @param {Int}} iBaseNum 对应值为数字的时候,进行倍率 
    */
    bindLable(key, lable, useDefaultConver) {
        var nodeLable = lable.getComponent(cc.Label) || lable.getComponent(cc.EditBox)
        if (!nodeLable) {
            cc.error("bindLable arg2 mush be a cc.Lable")
            return;
        }
        // this.off(key,lable);
        this.on(key, function(text){
            if(!cc.isValid(lable)){
                return
            }
            if (lable.changeStrFunc) {
                lable.changeStrFunc(text);
            } else {
                if (useDefaultConver) {
                    text = util.getEasyNum(text);
                }
            }
            nodeLable.string = text;
        }.bind(this));
    },
    /**
    * 设置数据
    * 值有在值为undefined的时候才会设置
    * @param {Object} values 数据对象
    */
    undefinedOrSet (key, value, type) {
        if (util.isNull(this.get(key))){
            this.set(key, value, type)
        }
    },
    save (key) {
        if(!this.__cid__ || this.__cid__ == "") {
            cc.error("必须要有类名才能保存值")
            return;
        }
        var value = this.get(key)
        if(value === null || value === undefined || value === "undefined" || value === "null") {
            cc.sys.localStorage.removeItem(_saveKey+this.__cid__+key);
        } else {
            cc.sys.localStorage.setItem(_saveKey+this.__cid__+key,JSON.stringify(value));
        }
        return value
    },
    read (key, def) {
        if (!this.__cid__ || this.__cid__ == "") {
            cc.error("必须要有类名才能保存值")
            return;
        }
        var value = cc.sys.localStorage.getItem(_saveKey+this.__cid__+key);
        if (value !== "") {
            try{
                value = JSON.parse(value)
                if (value === null || value === undefined) {
                    value = def
                }
            } catch(e) {
                cc.error(key+" "+value)
                cc.error(e)
            }
        } else {
            value = undefined
        }
        return value
    },
    /**
    * 自动存取数据,目前只支持String类型,第一次调用的时候会读取配置.后面会自动保存
    * @param {String} key 数据索引 
    * @param {String} def 默认数值 (弃用))
    */
    autoReadSave(key, def) {
        this.autoKey = this.autoKey || {}
        if (this.autoKey[key]) {
            return;
        }
        this.autoKey[key] = true;
        let isFirst = true;
        let value = this.read(key,def)
        if (value !== undefined) {
            this.set(key,value)
        } else {
            isFirst = null;
        }
        cc.game.on(cc.game.EVENT_HIDE,()=>{
            this.save(key)
        });
        this.on(key,function(text){
            if (isFirst) {
                isFirst = null;
                return;
            }
            this.save(key)
        }.bind(this));
        return value;
    },
    getIsAutoSave (key) {
        return this.autoKey && this.autoKey[key]
    },
    storeValue (key) {
        let value = this.get(key)
        cc.sys.localStorage.setItem(key,value);
    },
    readValue(key)
    {
        let value = cc.sys.localStorage.getItem(key);
        return value
    },
});

// ###baseNode 部分
window.baseNode = cc.Class({
    extends: cc.Component,
    properties: {
        openAction:{
            default: false,
        },
    },
    //privete: 如果进行继承需要在子类里面调用this._super();
    onLoad () {
        //只有带"_"的 节点名字才会加入映射
        util.setNodeMap(this.node, this);
        this.cantouch = false
    },
    onEnter () {
        
    },
    show() {
        this.__showing__ = true
        var children = this.node.parent.children;
        var zIndex = 0;
        for (let i = 0; i < children.length; i++) {
            let max = Math.max(zIndex,children[i].zIndex)
            if (max < cc.macro.MAX_ZINDEX) {
                zIndex = max;
            }
        }
        this.node.zIndex = zIndex + 1;
        if(this.openAction){
            util.mShow(this);
        }
    },
    touchClose() {
        this.nowInShow = false;
        FLUIManager.close(this);
    },
    hide () {
        this.node.zIndex = 0;
    },
    lateUpdate()
    {
        if (this.__showing__ && this.onEnter) {
            this.__showing__ = false;
            if(this.openAction){
                this.cantouch = false
                this.scheduleOnce(function () {
                    this.cantouch = true
                },0.7)
                this.scheduleOnce(function () {
                    this.onEnter()
                },0.02)
            }else{
                this.cantouch = true
                this.onEnter()
            }
        }
    },
});




