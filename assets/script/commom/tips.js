import global from "./global";

cc.Class({
    extends: cc.Component,

    properties: {
        tipsLabel:cc.Label
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.tipsLabel.string = global.tips;
        setTimeout(()=>{
            this.node.destroy();
        },1000);
    },

    start () {

    },

    // update (dt) {},
});
