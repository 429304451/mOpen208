

cc.Class({
    extends: baseNode,

    properties: {
        tilePre:{
            default:null,
            type:cc.Prefab
        },
    },

    start () {
        GM.plusOne = this;
        gameData.bindLable("pluasOneMaxScore", this.lb_max_score)
        this.addEvents();
    },
    onEnter () {
        this.canTouch = true;
        this.restart();
    },
    addEvents () {
        this.btn_back.quickBt(function () {
            this.touchBack();
        }.bind(this));
    },
    showRelive () {
        // FLUIManager.open("common/uRelive");
        util.showTip({desc:"复活来一次！", showPlay: true, confirmFunc: function () {
            GM.plusOne.onRelive();
        }, cancelFunc: function () {
            GM.plusOne.showBalance();
        }})
    },
    showBalance () {
        FLUIManager.open("games/plusOne/uPlusOver");
    },
    // 重新开始
    restart () {
        this.sp_main.removeAllChildren();

        this._curScore = 0;
        this.lb_score.setLabel(this._curScore);
        // 初始化方块数组
        this.tiles = [
            [null,null,null,null,null],
            [null,null,null,null,null],
            [null,null,null,null,null],
            [null,null,null,null,null],
            [null,null,null,null,null]
        ];
        // 计算生成方块数字的概率
        var gailv = new Array();
        this.maxNum = 8;
        for(var num = 0;num < this.maxNum-3;num++){
            gailv[num] = this.maxNum-3-num;
        }
        var sum = 0;
        for(var num = 0;num < gailv.length;num++){
            sum += gailv[num];
        }
        // 生成初始方块
        for(var row=0;row<5;row++){
            for(var col = 0;col<5;col++){
                var tile = cc.instantiate(this.tilePre);
                tile.getComponent("Tile").game = this;
                tile.width = (this.sp_main.width-30)/5;
                tile.height = (this.sp_main.height-30)/5;
                var count = 0;
                var randomNum = 0;

                while(true){
                    count++;
                    var arr = new Array();
                    var scanArr = new Array();

                    randomNum = Math.random()*sum;
                    var newNum = 0;
                    var min = 0;
                    for(var num = 0;num < gailv.length; num++){
                        if(randomNum >= min && randomNum <= min+gailv[num]){
                            newNum = num+1;
                            break;
                        }else{
                            min = min + gailv[num];
                        }
                    }
                    tile.getComponent("Tile").setNum(newNum, false, false);
                    tile.setPosition(5+(5+tile.width)*col+tile.width/2,5+(5+tile.height)*row+tile.height/2);
                    this.tiles[row][col] = tile;
                    this.scanAround(row, col, -1, -1, newNum, arr, scanArr);
                    if(arr.length<3){
                        break;
                    }
                }
                tile.getComponent("Tile").setArrPosition(row, col);
                this.sp_main.addChild(tile);
            }
        }
        util.showAlert("游戏开始！", 1)

        this.reliveTime = -1;
        this.onRelive();
    },
    onRelive (isShow) {
        this.reliveTime += 1;
        this.canTouch = true;
        // 能量条补满
        for(var i=5; i > 0; i--){
            var mStr = "power_"+i;
            this[mStr].active = true;
            this[mStr].runAction(cc.scaleTo(0.1,1));
        };
        if (isShow) {
            util.showAlert("复活成功");
        }
    },
    storageMaxScore () {
        if (this._curScore > gameData.pluasOneMaxScore) {
            gameData.set("pluasOneMaxScore", this._curScore);
            // wxUtil.postMessage('score1', gameData.pluasOneMaxScore);
        }
    },
    /*
     * 核心扫描逻辑
     * @param row 指定行
     * @param col 指定列
     * @param lastRow 上次扫描的行
     * @param lastCol 上次扫描的列
     * @param num 扫描要比对的数字
     * @param arr 记录数字相同且彼此相邻的数组
     * @param scanArr 记录扫描过的点的数组
     */
    scanAround (row, col, lastRow, lastCol, num, arr, scanArr){
        // cc.log("row:",row,",col:",col,",lastRow:",lastRow,",lastCol:",lastCol,",num:",num,",arr:",arr,",scanArr:",scanArr);
        if(this.tiles[row][col]==null){
            return;
        }
        var isClear = false;
        if(scanArr == undefined){
            scanArr = new Array();
        }
        // 扫描过的节点不再扫描
        if(scanArr.indexOf(row+"#"+col)==-1){
            scanArr.push(row+"#"+col);
        }else{
            return;
        }
        // 扫描上
        if(row<4&&(lastRow!=(row+1)||lastCol!=col)&&this.tiles[row+1][col]!=null){
            var nextNum = parseInt(this.tiles[row+1][col].getComponent("Tile").numLabel.string);
            if(nextNum == num){
                if(arr.indexOf(row+"#"+col)==-1){
                    arr.push(row+"#"+col);
                }
                this.scanAround(row+1, col, row, col, num, arr, scanArr);
                isClear = true;
            }
        }
        // 扫描下
        if(row>0&&(lastRow!=(row-1)||lastCol!=col)&&this.tiles[row-1][col]!=null){
            var nextNum = parseInt(this.tiles[row-1][col].getComponent("Tile").numLabel.string);
            if(nextNum==num){
                if(arr.indexOf(row+"#"+col)==-1){
                    arr.push(row+"#"+col);
                }
                this.scanAround(row-1, col, row, col, num, arr, scanArr);
                isClear = true;
            }
        }
        // 扫描左
        if(col>0&&(lastRow!=row||lastCol!=(col-1))&&this.tiles[row][col-1]!=null){
            var nextNum = parseInt(this.tiles[row][col-1].getComponent("Tile").numLabel.string);
            if(nextNum==num){
                if(arr.indexOf(row+"#"+col)==-1){
                    arr.push(row+"#"+col);
                }
                this.scanAround(row, col-1, row, col, num, arr, scanArr);
                isClear = true;
            }
        }
        // 扫描右
        if(col<4&&(lastRow!=row||lastCol!=(col+1))&&this.tiles[row][col+1]!=null){
            var nextNum = parseInt(this.tiles[row][col+1].getComponent("Tile").numLabel.string);
            if(nextNum==num){
                if(arr.indexOf(row+"#"+col)==-1){
                    arr.push(row+"#"+col);
                }
                this.scanAround(row, col+1, row, col, num, arr, scanArr);
                isClear = true;
            }
        }
        // 四周都不通，但不是出发遍历点，并且数字相同，也加入到数组
        if(!isClear&&(lastRow!=-1&&lastCol!=-1)){
            var curNum = parseInt(this.tiles[row][col].getComponent("Tile").numLabel.string)
            if(curNum==num){
                if(arr.indexOf(row+"#"+col)==-1){
                    arr.push(row+"#"+col);
                }
            }
        }
    },

    // 主要操作逻辑
    operateLogic (touchRow, touchCol, curNum, isFirstCall){
        var arr = new Array();
        var scanArr = new Array();
        this.scanAround(touchRow, touchCol, -1, -1, curNum, arr, scanArr);
        if(arr.length>=3){
            var addScore = 0;
            for(var index in arr){
                var row = arr[index].split("#")[0];
                var col = arr[index].split("#")[1];
                addScore += parseInt(this.tiles[row][col].getComponent("Tile").numLabel.string*10);
                if(row!=touchRow||col!=touchCol){
                    // 执行销毁动作                    
                    this.tiles[row][col].getComponent("Tile").destoryTile();
                    this.tiles[row][col] = null;
                }else{
                    this.tiles[row][col].getComponent("Tile").setNum(curNum+1, false, true);
                    this.maxNum = curNum+1>this.maxNum?curNum+1:this.maxNum;
                }
            }
            // 更新分数
            // this.scoreNum.string = parseInt(this.scoreNum.string)+addScore;
            this._curScore += addScore;
            this.lb_score.setLabel(this._curScore);
            this.storageMaxScore();

            this.scheduleOnce(function() {
                // 0.1s后所有方块向下移动
                this.moveAllTileDown();
            }, 0.1);
            if(!isFirstCall){
                // 能量条补充一格
                for(var i=5; i > 0; i--){
                    var mStr = "power_"+i;
                    if (this[mStr].active == false) {
                        this[mStr].active = true;
                        this[mStr].setScale(0);
                        this[mStr].runAction(cc.scaleTo(0.1,1));
                        break;
                    }
                };
            }
            // 连击次数+1
            initMsg.plusOneDF.combo++;
            if (initMsg.plusOneDF.combo < 9) {
                // util.playSound("star/star"+initMsg.plusOneDF.combo);
                console.log("playSound", "star/star"+initMsg.plusOneDF.combo);
            } else {
                console.log("playSound", "star/star8");
                // util.playSound("star/star8");
            }
            // console.log("连击次数："+initMsg.plusOneDF.combo);
            
            return true;
        }else{
            this.isCal = false;
        }
        return false;
    },
    // 所有方块向下移动
    moveAllTileDown:function(){
        for (var col = 0; col < 5; col++) {
            for (var row = 0; row < 5; row++) {
                if (this.tiles[row][col] != null) {// 有方块
                    for (var row1 = row; row1 > 0; row1--) {
                        if (this.tiles[row1 - 1][col] == null){
                            //如果没有向下移动
                            this.tiles[row1 - 1][col] = this.tiles[row1][col];
                            this.tiles[row1][col] = null;
                            this.tiles[row1 - 1][col].getComponent("Tile").moveTo(row1 - 1, col);
                        }
                    }
                }
            }
        }
        this.scheduleOnce(function() {
            // 计算生成方块数字的概率
            var gailv = new Array();
            for(var num = 0;num<this.maxNum-3;num++){
                gailv[num] = this.maxNum-3-num;
            }
            var sum = 0;
            for(var num = 0;num<gailv.length;num++){
                sum += gailv[num];
            }
            // 0.3s后生成新方块
            for (var col = 0; col < 5; col++) {
                for (var row = 0; row < 5; row++) {
                    if(this.tiles[row][col]==null){
                        var tile = cc.instantiate(this.tilePre);
                        tile.getComponent("Tile").game = this;
                        tile.width = (this.sp_main.width-30)/5;
                        tile.height = (this.sp_main.height-30)/5;
                        var randomNum = Math.random()*sum;
                        var newNum = 0;
                        var min = 0;
                        for(var num = 0;num<gailv.length;num++){
                            if(randomNum>=min&&randomNum<=min+gailv[num]){
                                newNum = num+1;
                                break;
                            }else{
                                min = min + gailv[num];
                            }
                        }
                        tile.getComponent("Tile").setNum(newNum, false, false);
                        tile.getComponent("Tile").newTile(row, col);
                        this.tiles[row][col] = tile;
                        this.sp_main.addChild(tile);
                    }
                }
            }
            // 0.5s后遍历执行逻辑
            this.scheduleOnce(function() {
                var isSearch = false;
                for (var col = 0; col < 5; col++) {
                    for (var row = 0; row < 5; row++) {
                        if(!isSearch){
                            isSearch = this.tiles[row][col]!=null&&this.operateLogic(row,col,parseInt(this.tiles[row][col].getComponent("Tile").numLabel.string),false);
                        }
                    }
                }
            }, 0.5);        
         }, 0.3);
    },
    touchBack () {
        this.touchClose();
        initMsg.backHall();
    }
});