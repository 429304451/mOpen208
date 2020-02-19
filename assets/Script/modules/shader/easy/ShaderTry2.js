var aDic = {}
aDic.desc = "水波纹尝试";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "easy/ShaderTry2"; // 路径 为便于查找
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
varying vec2 uv0;

uniform float time;

//float useTime = sin(time);

vec3 waveNormal (vec2 p) {
    vec3 normal = texture2D(texture, p).xyz;
    normal = -1.0 + normal * 2.0;
    return normalize(normal);
}

void main () {
    float timeFactor = 0.1;
    float offsetFactor = 0.5;
    float refractionFactor = 0.7;

    vec3 normal = waveNormal(uv0 + vec2(10.0*time*timeFactor, time*timeFactor));
    vec2 p = -1.0 + 2.0 * uv0;
    vec3 eyePos = vec3(0., 0., 10.); // 眼睛位置 位于中心点正上方 
    vec3 inVec = normalize(vec3(p, 0)-eyePos);
    vec3 refractVec = refract(inVec, normal, refractionFactor); // 根据入射向量，法线，折射系数计算折射向量
    vec2 v_texCoordN = uv0;
    v_texCoordN += refractVec.xy * offsetFactor;
    v_texCoordN.x -= 10.0*time*timeFactor*0.6; // 移动水面贴图，可选

    gl_FragColor = texture2D(texture, v_texCoordN);
}
`
    var lab = {
        vert: mVert,
        frag: mFrag,
        name: this.path
    }
    let sprite = uiShader.sp_sd.getComponent(cc.Sprite);
    uiShader.lb_fuzhu.active = true;

    initMsg.changeDSp(initMsg.imgPath.shuiwen, function () {
        let material = util.useShader(sprite, lab);
        this._material = material;

        util.preloadSp("img2/"+initMsg.imgPath.water, function (spriteFrame) {
            // util.display(GM.uiShader.sp_default, fullPath);
            // util.display(GM.uiShader.sp_sd, fullPath);
            // if (func) {
            //     func();
            // }
            let texture = spriteFrame.getTexture();
            material.setTexture1(texture);
            material.updateHash();

        })

        this.updateTime();

        // this.addTouch();
        // this.useSlider();
        // // # 使用一些默认值展示
        // uiShader.changeSld1(0.56);
        // uiShader.changeSld2(0.01);
        // this.changePos(cc.v2(272, 10))
    }.bind(this))
}

aDic.updateTime = function () {
    let material = this._material;
    var self = GM.uiShader;
    self.needUpdate = true;
    var time = 0;
    self.update_ext = function (dt) {
        time += dt/10;
        material.setTime(time)
    }
}

module.exports = aDic;