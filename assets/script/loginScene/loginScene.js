import global from "../commom/global";
var UnitTools = require("./../../tools/UnitTools.js");
cc.Class({
    extends: cc.Component,

    properties: {
        agreementView:cc.Node,
        agreementToggle:cc.Toggle,
        tipsPrefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //cc.sys.localStorage.setItem('uid', "zzz");
        var localUID = cc.sys.localStorage.getItem('uid');
        if (localUID) {
            UnitTools.request("http://192.168.2.226:3001/weixinlogin",{
                uid:localUID,
                platform:"android",
                ip:"192.168.1.1"
            },(err, data)=> {
                if (err) {
                    global.tips = "登陆失败";
                    let tips = cc.instantiate(this.tipsPrefab);
                    tips.parent = this.node;
                } else {
                    let playerData = JSON.parse(data);
                    global.playerData.nickName = playerData.nickName;
                    global.playerData.avatarUrl = playerData.avatarUrl;
                    global.playerData.sex = playerData.sex;
                    global.playerData.city = playerData.city;
                    global.playerData.diamond = playerData.diamond;
                    global.playerData.accountID = playerData.accountID;
                    cc.director.loadScene('hallScene');
                }
            },5000);
        }


        if (cc.sys.isMobile && cc.userPlugin === undefined) {
            let agent = anysdk.agentManager;
            cc.userPlugin = agent.getUserPlugin();
            cc.userPlugin.setListener((code, msg) => {
                switch (code) {
                    case anysdk.UserActionResultCode.kLoginSuccess:
                        let userInfo = cc.userPlugin.getUserInfo();
                        let userInfoJson = JSON.parse(userInfo);
                        localUID = userInfoJson.uid;
                        cc.sys.localStorage.setItem('uid', localUID);//存uid到本地
                        global.playerData.nickName = userInfoJson.nickName;
                        global.playerData.avatarUrl = userInfoJson.avatarUrl;
                        global.playerData.sex = userInfoJson.sex;
                        global.playerData.city = userInfoJson.city;
                        UnitTools.request("http://192.168.2.226:3001/weixinRegister",{
                            uid:localUID,
                            nickName:global.playerData.nickName,
                            avatarUrl:global.playerData.avatarUrl,
                            sex:global.playerData.sex,
                            city:global.playerData.city,
                            platform:"android",
                            ip:"127.0.0.1"
                        },(err, data)=> {
                            if (err) {
                                global.tips = "登陆失败";
                                let tips = cc.instantiate(this.tipsPrefab);
                                tips.parent = this.node;
                            } else {
                                let playerData = JSON.parse(data);
                                global.playerData.diamond = playerData.diamond;
                                global.playerData.accountID = playerData.accountID;
                                cc.director.loadScene('hallScene');
                            }
                        },5000);
                        break;
                    case
                    anysdk.UserActionResultCode.kLoginFail:
                        global.tips = "登陆失败";
                        let tips2 = cc.instantiate(this.tipsPrefab);
                        tips2.parent = this.node;
                        break;
                    case
                    anysdk.UserActionResultCode.kLoginCancel:
                        global.tips = "登陆取消";
                        let tips3 = cc.instantiate(this.tipsPrefab);
                        tips3.parent = this.node;
                        break;
                    case
                    anysdk.UserActionResultCode.kLoginNetworkError:
                        global.tips = "网络连接失败";
                        let tips4 = cc.instantiate(this.tipsPrefab);
                        tips4.parent = this.node;
                        break;
                    default:
                        break;
                }
            }, this);
        }

    },

    start () {

    },

    onButtonClick(event,customData){
      switch (customData) {
          case 'login':
              if (this.agreementToggle.isChecked) {
                  cc.userPlugin.login();
              }else {
                  global.tips = '请先同意用户协议';
                  let tips = cc.instantiate(this.tipsPrefab);
                  tips.parent = this.node;
              }
              break;
          case 'showAgreement':
              this.agreementView.active = true;
              break;
          case 'closeAgreement':
              this.agreementView.active = false;
              break;

      }
    },
    // update (dt) {},
});
