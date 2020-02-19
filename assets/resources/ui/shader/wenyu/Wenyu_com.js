
cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        util.setNodeMap(this.node, this);
        this.node.script = this;
        this._start = 0;

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
uniform vec4 color;
uniform vec3 pos;

void main()
{
    float t_x;
    if (pos.x > 0.0)
    {
        t_x = 1.- uv0.x; 
    }
    else
    {
        t_x =  uv0.x; 
    }

    float m_y = (uv0.y - 0.5) * (2. * abs(pos.x) * t_x + 1.) + 0.5 ;
    //float m_alpha = texture2D(texture, fract(vec2(uv0.x, m_y))).a ; 
    vec4 normalColor = texture2D(texture, fract(vec2(uv0.x, m_y)));
    if(m_y < 0. || m_y > 1.){                                                              
        normalColor = vec4(0.);
    }        
    gl_FragColor = color * vec4(normalColor);
}
`
        var lab = {
            vert: mVert,
            frag: mFrag,
            name: "Wenyu",
        }

        this.m_sp.getComponent(cc.Sprite).setState(0);
        let sprite = this.m_sp.getComponent(cc.Sprite);
        let material = util.useShader(sprite, lab);
        this._material = material;

        this.changePosX();

    },

    changePosX () {
        let x = this.node.x/1000;
        this.node.zIndex = Math.ceil(9999 - Math.abs(this.node.x));
        this.pos_desc.setLabel(""+this.node.index+"\n"+x.toFixed(2));

        this._material.setPos(x, 0.5, 0);
    },
});