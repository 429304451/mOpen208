

cc.Class({
    extends: baseData,
    name: "gameData",

    properties: {
        _lastSaveKey: "LOCAL",                 //上一次保存的id
    },

    //临时,无登录本地存储
    ctor() {
        this.initSaveData("LOCAL")
        this.initGameData()
    },

    //登录上一个账号有数据.用在服务器登录失败
    initLastSaveData() {
        var savekey = this.readValue("_lastSaveKey")
        if(savekey)
        {
            this.initSaveData(savekey)
            return true
        }

        return false
    },
    
    //设置自动保存这些数据
    initSaveData(key) {
        this.set("_lastSaveKey",key)
        this.storeValue("_lastSaveKey")
        this.setSaveKey(key);
        this.autoReadSave("settingMusic")
        this.autoReadSave("settingEffect")
        this.autoReadSave("settingVibrate")

        this.autoReadSave("golds");     // 金币数量
        this.autoReadSave("diamonds");  // 钻石数量

        this.autoReadSave("checkPoint");// 游戏进行到第几关
        this.autoReadSave("shareTime"); // 分享次数
        this.autoReadSave("watchTime"); // 看视频次数
        this.autoReadSave("todate");    // 今天玩的是哪一天
        this.autoReadSave("openid");

        this.autoReadSave("mName");     // 昵称
        this.autoReadSave("mHead");     // 头像url
    },

    initGameData(){
        this.undefinedOrSet("settingMusic","open")
        this.undefinedOrSet("settingEffect","open")
        this.undefinedOrSet("settingVibrate","open")

        this.undefinedOrSet("golds", 0)
        this.undefinedOrSet("diamonds", 0);

        this.undefinedOrSet("checkPoint", 1)
        this.undefinedOrSet("shareTime", 0)
        this.undefinedOrSet("watchTime", 0);
        this.undefinedOrSet("todate", util.getDate());
        this.undefinedOrSet("openid", "white");

        this.undefinedOrSet("mName", "white")
        this.undefinedOrSet("mHead", "")

        // console.log("initGameData", this);
    }
});