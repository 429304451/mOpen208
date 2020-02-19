var aDic = {}
aDic.desc = "二杰效果合集\n点击下面的左右按钮有更多";
// 如果没有指明图片 默认使用的双图片对比 
aDic.path = "easy/ShaderErjie"; // 路径 为便于查找
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

uniform int choose;  //滤镜模式
uniform vec3 pos;

float width = 480.0;
float height = 320.0;
float degree = 0.5;  //滤镜程度， 越高越明显， 默认 0.5 黑白镜0.5以上无意义，
                   
#define radius 0.2 //(Scale*70.0)    //区域半径
#define center vec2(pos.x, pos.y)    //区域中心点

//左上， 右上， 左下， 右下
#define vertexPosition0 vec2(0.0, 1.0)
#define vertexPosition1 vec2(1.0, 1.0)
#define vertexPosition2 vec2(0.0, 0.0)
#define vertexPosition3 vec2(1.0, 0.0)

// int FM_NONE                = 0;  //无， 即跟普通sprite无差别
int FM_SEARCH_LIGHT        = 0;  //探照灯
int FM_R_SEARCH_LIGHT      = 1;  //反探照灯， 即区域内为看不见
int FM_MAGNIFIER           = 2;  //放大镜
int FM_R_MAGNIFIER         = 3;  //缩小镜
int FM_CONVEX              = 4;  //凸透镜
int FM_R_CONVEX            = 5;  //反凸透镜， 即凹透镜
int FM_BLACK_WHITE         = 6;  //黑白镜
int FM_R_BLACK_WHIT        = 7;  //反黑白， 即只有镜内为彩色， 其它的都为黑白
int FM_FUZZY               = 8;  //模糊
int FM_R_FUZZY             = 9;  //反模糊， 即只有区域内的为清晰的， 其它都是模糊的

float mDistance () {
    float dis = distance(vec2(v_texCoord.x, v_texCoord.y*height/width), center);
    return dis;
}

//探照灯
vec4 searchLight()
{
    // center为 放大区域的中点
    float dis = mDistance();
    //探照灯
    if (choose == FM_SEARCH_LIGHT) {
        if(dis < radius) {
            vec4 color =  texture2D(texture, v_texCoord);
            float act = 1.-dis/radius;
            return vec4(color.rgb*pow(act, degree), color.a);
        } else {
            return vec4(0.0, 0.0, 0.0, 0.0);
        }
    } else {
        //反探照灯
        if (dis <= radius) {
            return vec4(0.0, 0.0, 0.0, 0.0);
        } else {
            vec4 color =  texture2D(texture, v_texCoord);
            float act = 1.-dis/radius;
            return vec4(color.rgb*pow(act, degree), color.a);
        }
    }
    return vec4(0.0, 0.0, 0.0, 0.0);
}

//放缩小
vec4 magnifier() {
    float dis = mDistance();
    vec2 mPos = v_texCoord.xy;
    vec2 newPos;
    vec2 lt = vertexPosition0;
    vec2 rt = vertexPosition1;
    vec2 lb = vertexPosition2;
    vec2 rb = vertexPosition3;
    vec2 imageSize = vec2(abs(rb.x-lb.x), abs(rt.y-rb.y));
    if (choose == FM_R_MAGNIFIER) {
        if (dis < radius) {
            newPos.x = 1./degree * (mPos.x - center.x)  + center.x;
            newPos.y = 1./degree * (mPos.y - center.y)  + center.y;
            newPos  = vec2(newPos.x-lt.x, newPos.y-lb.y);//+vec2(-240., -160.);
            // return vec4(1.0);
            //radius为 放大半径
            return texture2D(texture, vec2(newPos.x / imageSize.x, newPos.y / imageSize.y));
        } else {
            return texture2D(texture, v_texCoord);
        }
    } else {
        if (dis < radius) {
            newPos.x = degree * (mPos.x - center.x)  + center.x;
            newPos.y = degree * (mPos.y - center.y)  + center.y;
            newPos  = vec2(newPos.x-lt.x, newPos.y-lb.y);//+vec2(-240., -160.);
            // return vec4(1.0);
            //radius为 放大半径
            return texture2D(texture, vec2(newPos.x / imageSize.x, newPos.y / imageSize.y));
        } else {
            return texture2D(texture, v_texCoord);
        }
    }
}

//凸凹透镜
vec4 convex() {
    //center为 放大区域的中点
    float dis = mDistance();
    vec2 newPos;
    vec2 mPos = v_texCoord.xy;
    if (dis <= radius) {
        newPos = mPos;
        float act = dis/radius;
        if(choose == FM_CONVEX) {
            //凸透镜
            newPos.x = pow(act,degree)*(mPos.x-center.x)+center.x;
            newPos.y = pow(act,degree)*(mPos.y-center.y)+center.y;
        } else {
            //凹透镜
            newPos.x = (1.-pow(act,degree))*(mPos.x-center.x)+center.x;
            newPos.y = (1.-pow(act,degree))*(mPos.y-center.y)+center.y;
        }
        vec2 lt = vertexPosition0;
        vec2 rt = vertexPosition1;
        vec2 lb = vertexPosition2;
        vec2 rb = vertexPosition3;
        vec2 imageSize = vec2(abs(rb.x-lb.x), abs(rt.y-rb.y));
        newPos  = vec2(newPos.x-lt.x, newPos.y-lb.y);
        return texture2D(texture, vec2(newPos.x/imageSize.x, newPos.y/imageSize.y));
    } else {
        return texture2D(texture, v_texCoord);
    }
    return texture2D(texture, v_texCoord);
}

//黑白
vec4 blackWhite() {
    float dis = mDistance();
    if (choose == FM_BLACK_WHITE) {
        //黑白
        vec4 color =  texture2D(texture, v_texCoord);
        if (dis < radius) {
            float c = (color.r+color.g+color.b)/3.;
            return vec4(c+(color.r-c)*degree, c+(color.g-c)*degree, c+(color.b-c)*degree, color.a);
        } else {
            return color;
        }
    } else {
        //反黑白
        vec4 color = texture2D(texture, v_texCoord);
        if(dis < radius) {
            return color;
        } else {
            float c = (color.r+color.g+color.b)/3.;
            return vec4(c+(color.r-c)*degree, c+(color.g-c)*degree, c+(color.b-c)*degree, color.a);
        }
    }
}

//模糊
vec4 fuzzy() {
    // center为 区域的中点
    float dis = mDistance();

    vec2 newPos = v_texCoord.xy;
    vec2 lt = vertexPosition0;
    vec2 rt = vertexPosition1;
    vec2 lb = vertexPosition2;
    vec2 rb = vertexPosition3;
    
    vec2 imageSize = vec2(abs(rb.x-lb.x), abs(rt.y-rb.y));
    newPos  = vec2(newPos.x-lt.x, newPos.y-lb.y);
    
    float ds = degree/50.;
    //得到旁边四个点的像素
    vec4 l =  texture2D(texture,vec2((newPos.x-ds)/imageSize.x, newPos.y/imageSize.y));
    vec4 u =  texture2D(texture,vec2(newPos.x/imageSize.x, (newPos.y+ds)/imageSize.y));
    vec4 r =  texture2D(texture,vec2((newPos.x+ds)/imageSize.x, newPos.y/imageSize.y));
    vec4 d =  texture2D(texture,vec2(newPos.x/imageSize.x, (newPos.y-ds)/imageSize.y));
    vec4 color =  texture2D(texture, v_texCoord);
    
    vec4 dc = (l+u+r+d)/4.;
    if(choose == FM_FUZZY) {
        //模糊
        if(dis <= radius) {
            return dc;
        } else {
            return color;
        }
    } else {
        //反模糊
        if(dis <= radius) {
            return color;
        } else {
            return dc;
        }
    }
}

void main(void) {
    //悲剧switch不能用
    if(choose == FM_SEARCH_LIGHT || choose == FM_R_SEARCH_LIGHT) {
        gl_FragColor = searchLight();
    } else if(choose == FM_MAGNIFIER || choose == FM_R_MAGNIFIER) {
        gl_FragColor = magnifier();
    } else if(choose == FM_CONVEX || choose == FM_R_CONVEX) {
        gl_FragColor = convex();
    } else if(choose == FM_BLACK_WHITE || choose == FM_R_BLACK_WHIT) {
        gl_FragColor = blackWhite();
    } else if(choose == FM_FUZZY || choose == FM_R_FUZZY) {
        gl_FragColor = fuzzy();
    }
}
`
    var lab = {
        vert: mVert,
        frag: mFrag,
        name: this.path
    }
    let sprite = uiShader.sp_sd.getComponent(cc.Sprite);
    uiShader.lb_fuzhu.active = true;
    this.nowNum = 0;

    initMsg.changeDSp(initMsg.imgPath.frozen, function () {
        let material = util.useShader(sprite, lab);
        this._material = material;
        this.addTouch();
        this.useBtnNext();

        this.changePos(cc.v2(240, 210));
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
    console.log("pos", pos);
    let x = pos.x/GM.uiShader.sp_sd.width;
    let y = pos.y/GM.uiShader.sp_sd.height;
    GM.uiShader.lb_fuzhu.setLabel("x:"+x.toFixed(2)+" y:"+y.toFixed(2))
    this._material.setPos(x, 1-y, 0);
}


aDic.useBtnNext = function () {
    var self = GM.uiShader;
    self.node_next.active = true;
    let material = this._material;
    var mStr = "二杰效果合集";
    var tab = [
        "探照灯", "反探照灯", "放大镜", "缩小镜", "凸透镜",
        "凹透镜", "黑白镜", "反黑白", "模糊", "反模糊"
    ];

    var nowNum = this.nowNum;
    self.next_func = function () {
        nowNum += 1;
        if (nowNum > tab.length-1) {
            nowNum = 0;
        }
        let str = tab[nowNum];
        material.setChoose(nowNum);
        self.lb_desc.setLabel(mStr+"\n"+str);
    }
    self.before_func = function () {
        nowNum -= 1;
        if (nowNum < 0) {
            nowNum = tab.length-1;
        }
        let str = tab[nowNum];
        material.setChoose(nowNum);
        self.lb_desc.setLabel(mStr+"\n"+str);
    }
}

module.exports = aDic;