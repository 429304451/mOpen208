var aDic = {}
aDic.desc = "颜色渐变效果\n下面两个按钮可更换颜色";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "ordinary/ShaderColorGrad"; // 路径 为便于查找
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
uniform vec3 color1;
uniform vec3 color2;

void main () {
    vec4 clrx = color * texture2D(texture, uv0);
    float rd = (uv0.x+uv0.y)/2.0;

    float r = color1.x/255. + (color2.x - color1.x)/255.0*rd;
    float g = color1.y/255. + (color2.y - color1.y)/255.0*rd;
    float b = color1.z/255. + (color2.z - color1.z)/255.0*rd;

    gl_FragColor = vec4(r, g, b, clrx.a);
}
`
    var lab = {
        vert: mVert,
        frag: mFrag,
        name: this.path
    }
    let sprite = uiShader.sp_sd.getComponent(cc.Sprite);
    this.nowNum = 0;

    initMsg.changeDSp(initMsg.imgPath.bigCircle, function () {
        let material = util.useShader(sprite, lab);
        this._material = material;
        let tab = initMsg.useColorTab[this.nowNum];
        material.setColor1(tab[0]);
        material.setColor2(tab[1]);
        this.useBtnNext();
    }.bind(this))
}

aDic.useBtnNext = function () {
    var self = GM.uiShader;
    self.node_next.active = true;
    let material = this._material;

    var nowNum = this.nowNum;
    self.next_func = function () {
        nowNum += 1;
        if (nowNum > initMsg.useColorTab.length-1) {
            nowNum = 0;
        }
        let tab = initMsg.useColorTab[nowNum];
        material.setColor1(tab[0]);
        material.setColor2(tab[1]);
    }
    self.before_func = function () {
        nowNum -= 1;
        if (nowNum < 0) {
            nowNum = initMsg.useColorTab.length-1;
        }
        let tab = initMsg.useColorTab[nowNum];
        material.setColor1(tab[0]);
        material.setColor2(tab[1]);
    }
}

module.exports = aDic;