var aDic = {}
aDic.desc = "尝试1";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "easy/ShaderTry1"; // 路径 为便于查找
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
varying vec2 uv0;

void main () {
    float ratio = 0.;
    vec4 myColor = texture2D(texture, uv0);
    ratio = myColor[0] > myColor[1]?(myColor[0] > myColor[2] ?myColor[0] : myColor[2]) :(myColor[1] > myColor[2]? myColor[1] : myColor[2]);
    if (ratio != 0.0)  
    {
        myColor[0] = myColor[0] /  ratio;                                
        myColor[1] = myColor[1] /  ratio;                                   
        myColor[2] = myColor[2] /  ratio;                               
        myColor[3] = ratio;
    }
    else
    {
        myColor[3] = 0.0; 
    }
    gl_FragColor = myColor;
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
    }.bind(this))
}

module.exports = aDic;