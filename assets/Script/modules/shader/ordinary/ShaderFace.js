var aDic = {}
aDic.desc = "随手写的脸动效果";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "ordinary/ShaderFace"; // 路径 为便于查找
aDic.init = function (uiShader) {
    // ## 使用两张图片 一张图片 还是额外的展示
    initMsg.useModel(0);
    // ## 逻辑篇
    let mVert = `
uniform mat4 viewProj;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 v_texCoord;
void main () {
    vec4 pos = viewProj * vec4(a_position, 1);
    gl_Position = pos;
    v_texCoord = a_uv0;
}`;
    let mFrag = `
uniform sampler2D texture;
varying vec2 v_texCoord;
uniform vec3 pos;

uniform float num1;
uniform float num2;
uniform int choose; // colorState

float width = 480.0;
float height = 320.0;

#define center vec2(0.5, 0.5)
#define resolution vec2(width, height)

vec4 ChooseColor(int which) {
    //默认颜色 1 青色 2橙色 3洋红 4钢蓝 5春天的绿色 6浅粉红
    vec4 color = vec4(0.,1.,1.,1.);
    if (which == 1) {    
        color = vec4(1.,0.64,0.,1.);     
    } else if (which == 2) {   
        color = vec4(1.,0.,1.,1.);       
    } else if (which == 3) {   
        color = vec4(0.27,0.51,0.71,1.); 
    } else if (which == 4) {   
        color = vec4(0.24,0.7,0.44,1.);  
    } else if (which == 5) {   
        color = vec4(1.,0.71,0.76,1.);  
    }
    return color;
}
//画圆  位置 大小 颜色
float drawCircle(vec2 pos, float size) {
    float dis = sqrt( pow( v_texCoord.x-pos.x,2.) + pow(2./3.*(v_texCoord.y-pos.y),2.));
    float stroke = 0.;
    if (dis < size) {
        stroke = 1.;
    }
    return stroke;
}
float drawRect(vec2 Xli, vec2 Yli) {
    float stroke = 0.;
    if (v_texCoord.x > Xli.x && v_texCoord.x < Xli.y && v_texCoord.y > Yli.x && v_texCoord.y < Yli.y) {
        stroke = 1.;
    }
    return stroke;
}
float CoutNear() {
    float near = 1.4-2.*distance(vec2(pos.x,pos.y),center);
    if (near < 0.1) {
        near = 0.1;
    } else if (near > 0.3333) {
        near = 0.3333;
    }
    return near;
}
// 0.533333~0.6> 
float drawIwant() {
    float near = CoutNear();
    float strokeCount = 0.;
    strokeCount += drawCircle(vec2(1.-near,1.-1.5*near),near);
    strokeCount += drawCircle(vec2(near,1.-1.5*near),near);
    strokeCount += drawCircle(vec2(near,1.5*near),near);
    strokeCount += drawCircle(vec2(1.-near,1.5*near),near);
    strokeCount += drawRect(vec2(0.,1.),vec2(1.5*near,1.-1.5*near));
    strokeCount += drawRect(vec2(near,1.-near),vec2(0.,1.));
    return strokeCount;
}
//0.53333  0.45
float drawTcir() {
    //float near = 0.5-distance(vec2(pos.x,pos.y),center);
    float near = 1.4-2.*distance(vec2(pos.x,pos.y),center);
    if (near < 0.3333) {
        near = 0.33333;
    } else if (near > 0.5) {
        near = 0.5;
    }
    float strokeCount = 0.;
    strokeCount += drawCircle(vec2(1.-near,0.5),0.3333);
    strokeCount += drawCircle(vec2(near,0.5),0.3333);
    strokeCount += drawRect(vec2(near,1.-near),vec2(0.,1.));
    return strokeCount;
}
//0.45~0
float drawOcir() {
    float near = 2.*distance(vec2(pos.x,pos.y),center);
    if (near > 0.9) {
        near = 0.9;
    }
    float strokeCount = 0.;
    strokeCount += drawCircle(vec2(0.5,0.5),0.3333-0.1*(0.9-near) );
    return strokeCount;
}
float MyDraw() {
    float strokeCount = 0.;
    float near = distance(vec2(pos.x,pos.y),center);
    if (near < 0.45) {
        strokeCount = drawOcir();
    } else if(near >= 0.45 && near < 0.5333) {
        strokeCount = drawTcir();
    } else {
        strokeCount = drawIwant();
    }
    return strokeCount;
}
void main() {
    vec4 mycolor = vec4(0.);
    float strokeCount = MyDraw();
    if (strokeCount > 0.) {
        float Mydis = distance(vec2(pos.x,pos.y),center);
        mycolor = ChooseColor(choose);
    } else {
        mycolor = vec4(0.);
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
    this._colorState = 0;
    this._stateMax = 5;

    initMsg.changeDSp(initMsg.imgPath.frozen, function () {
        let material = util.useShader(sprite, lab);
        this._material = material;
        this.addTouch();
        // this.useSlider();
        // // # 使用一些默认值展示
        // uiShader.changeSld1(0.8);
        // uiShader.changeSld2(0.01);
        // this.changePos(cc.v2(240, 145))
    }.bind(this))
}

aDic.changeColorState = function () {
    this._colorState += 1;
    if (this._colorState > this._stateMax) {
        this._colorState = 0;
    }
    this._material.setChoose(this._colorState);
}

aDic.addTouch = function () {
	var mNode = GM.uiShader.sp_sd;
	mNode.on(cc.Node.EventType.TOUCH_START, function(event) {
	    var pos = mNode.convertToNodeSpace(cc.v2(event.touch._point.x, event.touch._point.y));
	    aDic.changeColorState();
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