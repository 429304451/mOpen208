var aDic = {}
aDic.desc = "彬思水坑效果\n用鼠标点击下面的图片试试";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "ordinary/ShaderBinsWater"; // 路径 为便于查找
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
varying vec4 color;
uniform vec3 pos;

uniform float num1;
uniform float num2;

float waterwid = num1;  // 水坑宽
float deepwid = num2;   // 水底部宽

//const float waterwid = 0.5;
//const float deepwid = 0.01;
const float pi = 3.141592653589793;

float CountScale(float left,float right)
{
    //水深
    float depth = pos.y;
    //防止怪异现象
    if (depth > 1.)
    {
        depth = 1.;
    }
    else if (depth < 0.)
    {
        depth = 0.;
    }
    //像素Y值缩放
    float scale = 1.-depth;
    float length = right - left;
    float mysca = pi/length;
    //向下弯曲的坐标值定在0.-1.之间
    float mpos = (uv0.x - left)/length;
    if (mpos < (1.-deepwid)/2. )
    {
        mpos = 1./(1.-deepwid)*(mpos);
        scale = (1.-depth) + depth *(0.5001-0.5*(sin(-pi/2.+mpos*2.*pi)) );
    }
    else if( mpos > (1.+deepwid)/2.)
    {
        mpos = 1./(1.-deepwid)*(mpos-deepwid);
        scale = (1.-depth)+ (depth)*(.5001-.5*( sin(-pi/2.+(mpos)*2.*pi) ) );
    }
    return scale;
}

void main() {
    float scale = 1.;
    float left  = pos.x - waterwid/2.;
    float right = pos.x + waterwid/2.;
    if (uv0.x > left && uv0.x < right )
    {
        scale = CountScale(left,right);
    }
    vec4 mycolor = vec4(0.0);
    if (1.-uv0.y < scale )
    {
        mycolor = texture2D(texture, vec2(uv0.x,1./scale*(uv0.y-1.+scale))  );
    }
    
    gl_FragColor = mycolor;
}
`
	uiShader.lb_fuzhu.active = true;
    var lab = {
        vert: mVert,
        frag: mFrag,
        name: this.path
    }
    let sprite = uiShader.sp_sd.getComponent(cc.Sprite);

    initMsg.changeDSp(initMsg.imgPath.road1, function () {
        sprite.setState(0);
        let material = util.useShader(sprite, lab);
        this._material = material;
        this.addTouch();
        this.useSlider();
        // # 使用一些默认值展示
        uiShader.changeSld1(0.8);
        uiShader.changeSld2(0.01);
        this.changePos(cc.v2(240, 145))
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