
const renderEngine = cc.renderer.renderEngine;
const Material = renderEngine.Material;

var material = cc.Class({
    extends: Material,

    callfunc (name, vert, frag, defines) {
    	let renderer = cc.renderer;
        let lib = renderer._forward._programLib;
        !lib._templates[name] && lib.define(name, vert, frag, defines);
        this.init(name);
    },

    init(name) {
        let renderer = renderEngine.renderer;
        let gfx = renderEngine.gfx;

        let pass = new renderer.Pass(name);
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
        );
        
        let mainTech = new renderer.Technique(
            ['transparent'],
            [
                { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
                { name: 'texture1', type: renderer.PARAM_TEXTURE_2D },
                { name: 'texture2', type: renderer.PARAM_TEXTURE_2D },
                { name: 'color', type: renderer.PARAM_COLOR4 },
                { name: 'pos', type: renderer.PARAM_FLOAT3 },
                { name: 'size', type: renderer.PARAM_FLOAT2 },
                { name: 'time', type: renderer.PARAM_FLOAT },
                { name: 'num1', type: renderer.PARAM_FLOAT },
                { name: 'num2', type: renderer.PARAM_FLOAT },
                { name: 'color1', type: renderer.PARAM_FLOAT3 },
                { name: 'color2', type: renderer.PARAM_FLOAT3 },
                { name: 'choose', type: renderer.PARAM_INT },
            ],
            [pass]
        );

        this._texture = null;
        this._texture1 = null;
        this._texture2 = null;
        this._color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
        this._pos = { x: 0.0, y: 0.0, z: 0.0 };
        this._size = { x: 0.0, y: 0.0 };
        this._time = 0.0;
        this._num1 = 0.0;
        this._num2 = 0.0;
        this._color1 = { x: 248.0, y: 206.0, z: 0.0 };
        this._color2 = { x: 248.0, y: 0.0, z: 2.0 };
        this._choose = 0;
        this._effect = this.effect = new renderer.Effect([mainTech], { 
            'color': this._color,
            'pos': this._pos,
            'size': this._size,
            'time': this._time,
            'num1': this._num1,
            'num2': this._num2,
            'color1': this._color1,
            'color2': this._color2,
            'choose': this._choose,
        }, []);
        this._mainTech = mainTech;
    },

    setTexture(texture) {
        this._texture = texture;
        this._texture.update({ flipY: false, mipmap: false });
        this._effect.setProperty('texture', texture.getImpl());
        this._texIds['texture'] = texture.getId();
    },

    setTexture1(texture1) {
        this._texture1 = texture1;
        this._texture1.update({ flipY: false, mipmap: false });
        this._effect.setProperty('texture1', texture1.getImpl());
        this._texIds['texture1'] = texture1.getId();
    },

    setTexture2(texture2) {
        this._texture2 = texture2;
        this._texture2.update({ flipY: false, mipmap: false });
        this._effect.setProperty('texture2', texture2.getImpl());
        this._texIds['texture2'] = texture2.getId();
    },

    setColor(r, g, b, a) {
        this._color.r = r;
        this._color.g = g;
        this._color.b = b;
        this._color.a = a;
        this._effect.setProperty('color', this._color);
    },

    setPos(x, y, z) {
        this._pos.x = x;
        this._pos.y = y;
        this._pos.z = z;
        this._effect.setProperty('pos', this._pos);
    },

    setSize(x, y) {
        this._size.x = x;
        this._size.y = y;
        this._effect.setProperty('size', this._size);
    },

    setTime(time) {
        this._time = time;
        this._effect.setProperty('time', this._time);
    },

    setNum1(num) {
        this._num1 = num;
        this._effect.setProperty('num1', this._num1);
    },

    setNum2(num) {
        this._num2 = num;
        this._effect.setProperty('num2', this._num2);
    },

    setColor1(color) {
        this._color1.x = color.r;
        this._color1.y = color.g;
        this._color1.z = color.b;
        this._effect.setProperty('color1', this._color1);
    },

    setColor2(color) {
        this._color2.x = color.r;
        this._color2.y = color.g;
        this._color2.z = color.b;
        this._effect.setProperty('color2', this._color2);
    },

    setChoose(choose) {
        this._choose = choose;
        this._effect.setProperty('choose', this._choose);
    },

});

module.exports = material;