var aDic = {}
aDic.desc = "获取像素颜色区间";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "easy/ShaderColorCs"; // 路径 为便于查找
aDic.init = function (uiShader) {
    // ## 使用两张图片 一张图片 还是额外的展示
    initMsg.useModel(0);
    // ## 逻辑篇
    let mVert = `
uniform mat4 viewProj;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
void main () {
    vec4 pos = viewProj * vec4(a_position, 1);
    gl_Position = pos;
    uv0 = a_uv0;
}`;
    let mFrag = `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

uniform float num1;
uniform float num2;
uniform vec3 pos;

void main () {
    vec4 mycolor = texture2D(texture, uv0);
    float colorvalue = (mycolor.r+mycolor.g+mycolor.b)/3.;
    if (colorvalue >= (num1-0.05) && colorvalue <= (num1+0.05) ) {
        mycolor.r = pos.x;
        mycolor.g = num2;
        mycolor.b += pos.y;
    }
    gl_FragColor = mycolor;
}
`
    var lab = {
        vert: mVert,
        frag: mFrag,
        name: this.path
    }
    let sprite = uiShader.sp_sd.getComponent(cc.Sprite);
    uiShader.lb_fuzhu.active = true;

    initMsg.changeDSp(initMsg.imgPath.xiong, function () {
        let material = util.useShader(sprite, lab);
        this._material = material;
        this.addTouch();
        this.useSlider();
        // # 使用一些默认值展示
        uiShader.changeSld1(0.56);
        uiShader.changeSld2(0.01);
        this.changePos(cc.v2(272, 10))
    }.bind(this))
}

aDic.addTouch = function () {
    var mNode = GM.uiShader.sp_sd;
    mNode.on(cc.Node.EventType.TOUCH_START, function(event) {
        var pos = mNode.convertToNodeSpace(cc.v2(event.touch._point.x, event.touch._point.y));
        aDic.changePos(pos)
    });

    mNode.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
        var pos = mNode.convertToNodeSpace(cc.v2(event.touch._point.x, event.touch._point.y));
        aDic.changePos(pos)
    });

    mNode.on(cc.Node.EventType.TOUCH_END, function(event) {
        var pos = mNode.convertToNodeSpace(cc.v2(event.touch._point.x, event.touch._point.y));
        aDic.changePos(pos)
    });
}

aDic.changePos = function (pos) {
    // console.log("pos", pos);
    let x = pos.x/GM.uiShader.sp_sd.width;
    let y = pos.y/GM.uiShader.sp_sd.height;
    GM.uiShader.lb_fuzhu.setLabel("x:"+x.toFixed(2)+" y:"+y.toFixed(2))
    this._material.setPos(x, 1-y, 0);
}

aDic.useSlider = function () {
    // 使用主业的slider滑块来控制开关
    var self = GM.uiShader;
    self.node_slide.active = true;
    let material = this._material;
    self.sld1Func = function (progress_1) {
        material.setNum1(progress_1);
    }
    self.sld2Func = function (progress_2) {
        material.setNum2(progress_2);
    }
}

module.exports = aDic;