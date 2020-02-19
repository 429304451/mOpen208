var aDic = {}
aDic.desc = "墨水池";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "easy/ShaderInk"; // 路径 为便于查找
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

float waterwid = num1;
float deepwid = num2;

void main () {
    vec3 texel = texture2D(texture, uv0).rgb;
    texel = vec3(dot(vec3(pos.x, pos.y, waterwid), texel));
    texel = vec3(texture2D(texture, vec2(texel.r, .16666)).r);
    gl_FragColor = vec4(texel, deepwid);
}
`
    var lab = {
        vert: mVert,
        frag: mFrag,
        name: this.path
    }
    let sprite = uiShader.sp_sd.getComponent(cc.Sprite);
    uiShader.lb_fuzhu.active = true;

    initMsg.changeDSp(initMsg.imgPath.frozen, function () {
        let material = util.useShader(sprite, lab);
        this._material = material;
        this.addTouch();
        this.useSlider();
        // # 使用一些默认值展示
        uiShader.changeSld1(0.24);
        uiShader.changeSld2(0.8);
        this.changePos(cc.v2(57, 162))
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