/* eslint-disable */
var initMsg = {};
initMsg.dt = 0.01667;
initMsg.dt3 = 0.0125;
initMsg.dt4 = 0.0111;
initMsg.white = "white"

// ### 一些图片路径定义
initMsg.imgPath = {
	frozen: "big/frozen",
	xiong: "big/xiong",
	pikaqiu: "big/pikaqiu",
	hello: "big/HelloWorld",
	road1: "big/road1",
	bigCircle: "big/bigCircle",
	roleme: "big/roleme",
	shuiwen: "big/shuiwen",
	noise_256: "big/noise_256",
	noise_512: "big/noise_512",
	noise_1024: "big/noise_1024",
}


// ### shader篇
// 简单效果
initMsg.shaderEasyTab = [
	"ShaderErjie",   // 二杰效果集合
	"ShaderIce",     // 冰冻效果
	"ShaderStone",   // 石头
	"ShaderColorCs", // 获取像素颜色区间
	"ShaderInk",     // 墨水池
	"ShaderRelief",  // 浮雕
	"ShaderCircleLamp", // 圆球跑马灯
	"ShaderTry1",    // 尝试1
	"ShaderThreshold",  // 阈值阈缺
	"ShaderTexture", // 传入纹理
];
// 一般效果
initMsg.shaderOrdinaryTab = [
	"ShaderBinsWater", // 彬思水坑
	"ShaderColorGrad", // 颜色渐变效果
	"ShaderSmoke",     // 烟雾效果
	"ShaderWenyu",     // 文煜的跑马灯
	"ShaderFace",      // 随手写的脸动效果
];

// test-ShaderOutShine

initMsg.nowShader = "ShaderSmoke";
initMsg.hasAddSdTouch = false;

initMsg.useModel = function (useModel) {
	// 0-默认显示两张图片比对 1-只使用一张图片 2-使用add模式
	var self = GM.uiShader;
	// 如果前面使用add模式 后面人就要清除掉展示自己的新的部分
	if (initMsg.nowUseModel == 2) {
		self.node_add.removeAllChildren();
	}
	initMsg.nowUseModel = useModel;
	if (initMsg.nowUseModel == 1) {
		self.node_double.active = false;
		self.node_only.active = true;
		self.node_add.active = false;
	} else if (initMsg.nowUseModel == 2) {
		self.node_double.active = false;
		self.node_only.active = false;
		self.node_add.active = true;
	} else {
		self.node_double.active = true;
		self.node_only.active = false;
		self.node_add.active = false;
	}

	// ### 一些重置的代码也放这里下
	self.lb_fuzhu.active = false;
	// 重置 slide回调
	self.node_slide.active = false;
	if (self.sld1Func) {
		self.sld1Func = null;
	}
	if (self.sld2Func) {
		self.sld2Func = null;
	}
	// ### 前后按钮
	self.node_next.active = false;
	if (self.next_func) {
		self.next_func = null;
	}
	if (self.before_func) {
		self.before_func = null;
	}
	// ### time更新
	self.update_ext = null;
	self.needUpdate = false;
	// ### 取消所有bind事件
	self.sp_sd.unbindTouch();
}

initMsg.changeDSp = function (path, func) {
	var fullPath = "img2/"+path;
	util.preloadSp(fullPath, function () {
		util.display(GM.uiShader.sp_default, fullPath);
		util.display(GM.uiShader.sp_sd, fullPath);
		if (func) {
			func();
		}
	})
}

initMsg.useColorTab = [
	[cc.color(255,0,112), cc.color(0,255,20)],
    [cc.color(253,88,233), cc.color(255,255,255)],
    [cc.color(78,111,255), cc.color(179,243,255)],
    [cc.color(41,255,0), cc.color(255,255,255)],
    [cc.color(161,88,253), cc.color(255,182,219)],
    [cc.color(0,154,255), cc.color(0,255,215)],
];



module.exports = initMsg;