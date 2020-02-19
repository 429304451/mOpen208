cc.Class({
	extends: baseNode,

	properties: {

	},
	init(str, time) {
		this.lbl_desc.setLabel(str);
		if (str.split("\n").length == 1) {
			var length = util.getStrLength(str);
			this.img_bg.width = length*29+40;
			this.img_bg.height = 62;
		} else {
			var tab = str.split("\n");
			var maxLength = 0;
			for (let i in tab) {
				let len = util.getStrLength(tab[i]);
				if (len > maxLength) {
					maxLength = len
				}
			}
			this.img_bg.width = maxLength*28+40;
			this.img_bg.height = tab.length*32+30;
		}

		let self = this;
		this.unscheduleAllCallbacks();
		this.scheduleOnce(function () {
            FLUIManager.close(self);
        }, time)
	},
	
});
