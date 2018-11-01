import global from "../commom/global";
var UnitTools = require("./../../tools/UnitTools.js");
var NetWorkManager = require("./../../tools/NetWorkManager.js");
cc.Class({
    extends: cc.Component,

    properties: {
        agreementView:cc.Node,
        agreementToggle:cc.Toggle,
        tipsPrefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (cc.sys.isMobile) {
            let agent = anysdk.agentManager;
            if (cc.userPlugin === undefined) {
                cc.userPlugin = agent.getUserPlugin();
            }
            if (cc.userPlugin === undefined) {
                cc.sharePlugin = agent.getSharePlugin();
            }
            cc.userPlugin.setListener((code, msg) => {
                switch (code) {
                    case anysdk.UserActionResultCode.kLoginSuccess:
                        let userInfo = cc.userPlugin.getUserInfo();
                        let userInfoJson = JSON.parse(userInfo);
                        cc.sys.localStorage.setItem('uid', userInfoJson.uid);//存uid到本地
                        UnitTools.request("http://192.168.2.226:3001/weixinRegister",{
                            uid:localUID,
                            nickName:userInfoJson.nickName,
                            avatarUrl:userInfoJson.avatarUrl,
                            sex:userInfoJson.sex,
                            city:userInfoJson.city,
                            platform:cc.sys.os
                        },(err, data)=> {
                            if (err) {
                                global.tips = "登陆失败";
                                let tips = cc.instantiate(this.tipsPrefab);
                                tips.parent = this.node;
                            } else {
                                let playerData = JSON.parse(data);
                                global.playerData.accountID = playerData.accountID;
                                NetWorkManager.connectAndAuthToHall(playerData.hallIP);
                                NetWorkManager.onConnectedToHall(()=>{
                                    cc.director.loadScene('hallScene');
                                })
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
        //cc.sys.localStorage.setItem('uid', "zzz");
        var localUID = cc.sys.localStorage.getItem('uid');
        if (localUID) {
            UnitTools.request("http://192.168.2.226:3001/weixinlogin",{
                uid:localUID,
                platform:cc.sys.os
            },(err, data)=> {
                if (err) {
                    global.tips = "登陆失败";
                    let tips = cc.instantiate(this.tipsPrefab);
                    tips.parent = this.node;
                } else {
                    let playerData = JSON.parse(data);
                    global.playerData.accountID = playerData.accountID;
                    NetWorkManager.connectAndAuthToHall(playerData.hallIP);
                    NetWorkManager.onConnectedToHall(()=>{
                        cc.director.loadScene('hallScene');
                    })
                }
            },5000);
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
