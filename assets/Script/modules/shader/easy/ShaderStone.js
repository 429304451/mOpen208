var aDic = {}
aDic.desc = "石头效果";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "easy/ShaderStone"; // 路径 为便于查找
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
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float clrbright = (c.r + c.g + c.b) * (1. / 3.);
    float gray = (0.6) * clrbright;
    gl_FragColor = vec4(gray, gray, gray, c.a);
}
`
    var lab = {
        vert: mVert,
        frag: mFrag,
        name: this.path
    }
    let sprite = uiShader.sp_sd.getComponent(cc.Sprite);
    // let material = util.useShader(sprite, lab);

    initMsg.changeDSp(initMsg.imgPath.pikaqiu, function () {
        let material = util.useShader(sprite, lab);
    })
}

module.exports = aDic;