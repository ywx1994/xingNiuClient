import global from "../commom/global";
var NetWorkManager = require("./../../tools/NetWorkManager");
var ScreenShot = require("../../tools/ScreenShot");
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
            this.headImage.spriteFrame =new cc.SpriteFrame(tex);
        });
    },

    start () {

    },

    update (dt) {
        this.diamond.string = global.playerData.diamond;
    },
    onButtonClick(event,customData){
      switch (customData) {
          case "jietu":
              var shot = new ScreenShot();
              ScreenShot.clearImage("shot.png");
              shot.shot();
              shot.saveToFile("shot.png",cc.ImageFormat.PNG,()=>{
                  if (cc.sharePlugin === undefined) {
                      var agent = anysdk.agentManager;
                      cc.sharePlugin = agent.getSharePlugin();
                  }
                  var info = {
                      shareTo: 0,
                      mediaType: 1,
                      imagePath: jsb.fileUtils.getWritablePath()+"shot.png",
                      thumbImage: jsb.fileUtils.getWritablePath()+"shot.png"
                  };
                  cc.sharePlugin.share(info);
              });


              break;
      }
    },
});
