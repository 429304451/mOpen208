var aDic = {}
aDic.desc = "烟雾效果\n抄的未完善";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "ordinary/ShaderSmoke"; // 路径 为便于查找
aDic.init = function (uiShader) {
    // ## 使用两张图片 一张图片 还是额外的展示
    initMsg.useModel(0);
    // ## 逻辑篇
    let mVert = `
uniform mat4 viewProj;
attribute vec3 a_position;
attribute vec2 a_uv0;

varying vec2 v_texCoord1;
varying vec2 v_texCoord2;
varying vec2 v_texCoord3;

uniform float num1; // u_cloudSpeed;
uniform float time;
const float layer1Speed = 0.1*4.;
const float layer2Speed = 0.2*4.;
const float layer3Speed = 0.05*4.;   

void main () { 
    gl_Position = viewProj * vec4(a_position, 1);               
    
    float time1 = mod(time * layer1Speed * num1, 1.0);
    float time2 = mod(time * layer2Speed * num1, 1.0);
    float time3 = mod(time * layer3Speed * num1, 1.0);
    
    v_texCoord1 = a_uv0;
    v_texCoord1.x += time1;
    
    v_texCoord2 = a_uv0;            
    v_texCoord2.xy += time2;
    
    v_texCoord3 = a_uv0;            
    v_texCoord3.xy += time3;
}`;
    let mFrag = `
uniform sampler2D texture;
uniform sampler2D texture1;
uniform sampler2D texture2;
varying vec2 v_texCoord1;
varying vec2 v_texCoord2;
varying vec2 v_texCoord3;

uniform float time;
uniform float num2;  // u_amount

void main () {
    vec4 col = texture2D(texture, v_texCoord1) * texture2D(texture1, v_texCoord2) * texture2D(texture2, v_texCoord3);   
    col.a = (col.r + col.g + col.b) * 0.33;

    col -= 1.0 - num2;
    col = max(col, 0.0);
    col *= (1.0 / num2);

    col.r = 1.0 - col.r;
    col.g = 1.0 - col.g;
    col.b = 1.0 - col.b;
    gl_FragColor = col;

    //gl_FragColor = texture2D(texture, v_texCoord1);
}
`
    var lab = {
        vert: mVert,
        frag: mFrag,
        name: this.path
    }
    let sprite = uiShader.sp_sd.getComponent(cc.Sprite);
    uiShader.lb_fuzhu.active = true;

    initMsg.changeDSp(initMsg.imgPath.noise_256, function () {
        let material = util.useShader(sprite, lab);
        this._material = material;

        util.preloadSp("img2/"+initMsg.imgPath.noise_512, function (spriteFrame) {
            let texture = spriteFrame.getTexture();
            material.setTexture1(texture);
        })

        util.preloadSp("img2/"+initMsg.imgPath.noise_1024, function (spriteFrame) {
            let texture = spriteFrame.getTexture();
            material.setTexture2(texture);
        })

        this.updateTime();
        this.useSlider();
        // // # 使用一些默认值展示
        uiShader.changeSld1(0.18);
        uiShader.changeSld2(1.0);
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