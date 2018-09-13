import global from "../commom/global";

cc.Class({
    extends: cc.Component,

    properties: {
        nickName:cc.Label,
        accountID:cc.Label,
        headImage:cc.Sprite,
        sexNode:cc.Node,
        diamond:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sexList = this.sexNode.children;
        this.nickName.string = global.playerData.nickName;
        this.accountID.string = global.playerData.accountID;
        for (let i = 0; i < this.sexList.length; i++) {
            this.sexList[i].active = (i === global.playerData.sex-1);
        }
        cc.loader.load({url:global.playerData.avatarUrl,type:'png'}, (err, tex)=> {
            cc.log('sss'+(tex instanceof cc.Texture2D));
            this.headImage.spriteFrame =new cc.SpriteFrame(tex);
        });
    },

    start () {

    },

    update (dt) {
        this.diamond.string = global.playerData.diamond;
    },
});
