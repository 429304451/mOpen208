var aDic = {}
aDic.desc = "传入纹理";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "easy/ShaderTexture"; // 路径 为便于查找
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
uniform sampler2D texture1;
uniform vec4 color;
varying vec2 uv0;

void main () {
    vec4 mycolor = texture2D(texture1, uv0);
    gl_FragColor = mycolor;
}
`
    var lab = {
        vert: mVert,
        frag: mFrag,
        name: this.path
    }
    let sprite = uiShader.sp_sd.getComponent(cc.Sprite);

    initMsg.changeDSp(initMsg.imgPath.frozen, function () {
        let material = util.useShader(sprite, lab);
        util.preloadSp("img2/"+initMsg.imgPath.xiong, function (spriteFrame) {
            let texture = spriteFrame.getTexture();
            material.setTexture1(texture);
        })

    }.bind(this))
}



module.exports = aDic;