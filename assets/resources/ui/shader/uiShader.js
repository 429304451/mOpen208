
cc.Class({
    extends: baseNode,

    properties: {

    },
    start() {
        GM.uiShader = this;
        this.initUi();
        this.anaLogic();
        this.addEvents();
    },
    // ui初始化拓展
    initUi () {
        // 两个滑块
        this.sld_1 = this.slider_1.getComponent(cc.Slider);
        this.sld_2 = this.slider_2.getComponent(cc.Slider);
        this.needUpdate = false;
        this.nowIndex = 0;
        if (initMsg.inTest == false) {
            initMsg.nowShader = initMsg.shaderAllTab[0];
        }
    },
    // 逻辑解析
    anaLogic () {
        var aDic = require(initMsg.nowShader);
        aDic.init(this);

        this.lb_path.setLabel(aDic.path);
        this.lb_desc.setLabel(aDic.desc);
    },
    addEvents () {
        var self = this;
        this.btn_next.quickBt(function () {
            if (self.next_func) {
                self.next_func();
            }
        });
        this.btn_before.quickBt(function () {
            if (self.before_func) {
                self.before_func();
            }
        });

        this.btn_home.quickBt(function () {
            self.touchClose(true);
            initMsg.backHall();
        });

        if (initMsg.inTest == false) {
            this.btn_a_next.quickBt(function () {
                self.nowIndex += 1;
                if (self.nowIndex > initMsg.shaderAllTab.length - 1) {
                    self.nowIndex = 0;
                }
                initMsg.nowShader = initMsg.shaderAllTab[self.nowIndex];
                self.anaLogic();
            });

            this.btn_a_before.quickBt(function () {
                self.nowIndex -= 1;
                if (self.nowIndex < 0) {
                    self.nowIndex = initMsg.shaderAllTab.length - 1;
                }
                initMsg.nowShader = initMsg.shaderAllTab[self.nowIndex];
                self.anaLogic();
            });
        }
        
    },
    // ### 滑动条
    slideOne(slider) {
        this.changeSld1(slider.progress);
    },
    slideTwo(slider) {
        this.changeSld2(slider.progress);
    },
    changeSld1 (progress) {
        this.sld_1.progress = progress;
        progress = progress.toFixed(2);
        this.lb_num1_val.setLabel(progress);
        this.progress_1 = progress;
        if (this.sld1Func) {
            this.sld1Func(this.progress_1);
        }
    },
    changeSld2 (progress) {
        this.sld_2.progress = progress;
        progress = progress.toFixed(2);
        this.lb_num2_val.setLabel(progress);
        this.progress_2 = progress;
        if (this.sld2Func) {
            this.sld2Func(this.progress_2);
        }
    },

    update (dt) {
        if (this.needUpdate) {
            dt = dt/3 + initMsg.dt4;
            if (this.update_ext) {
                this.update_ext(dt);
            }
        }
    },

});
