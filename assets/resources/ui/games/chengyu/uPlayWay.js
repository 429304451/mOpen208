
cc.Class({
    extends: baseNode,

    properties: {

    },
    start() {
        this.descTab = [
            "点击下方的字，将正确的字填入红框内\n点击已经填的字，可以将其撤回",
            "点击空白的字块，可以切换红框",
            "字块变绿，表示成语正确\n文字变红，表示该成语中有错字",
            "完成全部成语，即可过关",
        ]

        this.btn_close.quickBt(function () {
            self.closeSelf();
        });
    	
    	GM.uPlayWay = this;
        
        var self = this;
        this.nowIndex = 1;
        this.chooseWhich(this.nowIndex);
        this.btn_1.onClick(function () {
        	if (self.nowIndex > 1) {
        		self.chooseWhich(self.nowIndex - 1)
        	}
        });
        this.btn_2.onClick(function () {
        	if (self.nowIndex < 4) {
        		self.chooseWhich(self.nowIndex + 1)
        	}
        });
    },
    closeSelf () {
    	GM.uPlayWay = null;
    	this.touchClose();
    },
    chooseWhich (index) {
    	this.nowIndex = index;
    	if (index == 1) {
    		this.btn_1.getComponent(cc.Button).interactable = false;
    		this.btn_2.getComponent(cc.Button).interactable = true;
    	} else if (index == 4) {
    		this.btn_1.getComponent(cc.Button).interactable = true;
    		this.btn_2.getComponent(cc.Button).interactable = false;
    	} else {
    		this.btn_1.getComponent(cc.Button).interactable = true;
    		this.btn_2.getComponent(cc.Button).interactable = true;
    	}

    	for (let i = 1; i < 5; i++) {
    		if (i == index) {
    			this["page_"+i].active = true;
    		} else {
    			this["page_"+i].active = false;
    		}
    	}

    	this.circle_choose.x = index*30 - 75;
    	this.lb_desc.setLabel(this.descTab[index - 1]);
    }
});
