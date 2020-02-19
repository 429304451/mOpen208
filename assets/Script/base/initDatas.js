/****************************************************************************
 * Filename:   游戏数据 
 * Summary:    游戏所有数据初始化
 *****************************************************************************/

//所有数据模块
var dataKeys = [
    "gameData",
]
for (let k in dataKeys) {
    try{
        var dataModuleName = dataKeys[k];
        var className = require(dataModuleName)
        window[dataModuleName] = window[dataModuleName] || new className()
    } catch (e) {
        cc.log(e)
    }
}