/* eslint-disable */
var initMsg = {};
initMsg.dt = 0.01667;
initMsg.dt3 = 0.0125;
initMsg.dt4 = 0.0111;
initMsg.white = "white"

initMsg.backHall = function () {
	FLUIManager.open("hall/uiHall");
}

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

initMsg.nowShader = "ShaderCircleLamp";
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

// ### uiChengyu 成语游戏
initMsg.peiGuan = false;  // 是否处于配置关卡模式
// ### 游戏 点我+1
initMsg.plusOneColors = {
    startBg: cc.color(89,69,61),
    overBg: cc.color(89,69,61),
    gameBg: cc.color(89,69,61),
    topBg: cc.color(166,137,124),
    tileBg: cc.color(166,137,124),
    powerBarBg: cc.color(166,137,124),
    power: cc.color(100,107,48),

    num1: cc.color(217,202,184),
    num2: cc.color(197,167,128),
    num3: cc.color(166,133,104),
    num4: cc.color(115,86,69),
    num5: cc.color(64,40,32),
    num6: cc.color(115,100,56),
    num7: cc.color(140,89,70),
    num8: cc.color(115,56,50),
    num9: cc.color(115,32,32),
    num10: cc.color(115,103,88),
    num11: cc.color(140,121,97),
    num12: cc.color(191,146,107),
    num13: cc.color(191,140,11),
    num14: cc.color(213,185,112),
    num15: cc.color(174,122,98),
    num16: cc.color(181,91,82),
    num17: cc.color(107,86,85),
    num18: cc.color(73,58,61),
    num19: cc.color(176,125,98),
    num20: cc.color(232,171,127),
    nums: cc.color(222,153,36)
};

initMsg.plusOneDF = {
    score: 0,
    combo:0,
};

module.exports = initMsg;