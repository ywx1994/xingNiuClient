/**
 * Created by litengfei on 2018/1/18.
 */
import global from "../script/commom/global";

var AutoReconnectWsRpcClient = require("./AutoReconnectWsRpcClient");
var EventEmitter = require("./EventEmitter");
class NetWorkManager{
    static connectAndAuthToHall(url) {//cb 2params baseinfo service
        if (NetWorkManager.g_HallService === null) {
            NetWorkManager.g_HallService = new AutoReconnectWsRpcClient();
            NetWorkManager.g_HallService.connect(url);
            NetWorkManager.g_HallService.onClose(function () {
                //连接中断
                NetWorkManager.g_HallServiceIsLogin = false;
                NetWorkManager.events.emit("closeFromHall");
                NetWorkManager.connectAndAuthToHall(url);
            })
        }
        NetWorkManager.g_HallService.onReady(function (service) {
            service.proxy.login(global.playerData.accountID,function (data) {
                if(data.ok){//大厅服务器里录入玩家成功
                    NetWorkManager.g_HallServiceIsLogin = true;
                    NetWorkManager.hallEvents.emit("loginToHall",service);
                }
            })
        })
    }

    static onConnectedToHall(cb){//cb 1param service
        if(NetWorkManager.g_HallServiceIsLogin){
            cb(NetWorkManager.g_HallService);
            return;
        }
        NetWorkManager.hallEvents.on("loginToHall",cb);
    }

    static offConnectedToHall(cb){
        NetWorkManager.hallEvents.off(cb);
    }

    static onClosedFromHall(cb){//cb 1param service
        NetWorkManager.hallEvents.on("closeFromHall",cb);
    }

    static  offClosedFromHall(cb){
        NetWorkManager.hallEvents.off(cb);
    }

    static clearHallService() {//清理当前大厅的连接
        NetWorkManager.hallEvents = new EventEmitter();
        NetWorkManager.g_HallServiceIsLogin = false;
        if (NetWorkManager.g_HallService){
            NetWorkManager.g_HallService.clear();
            NetWorkManager.g_HallService = null;
        }
    }


    //-------------------------------游戏服务网络-----------------------------


}
NetWorkManager.g_HallService = null;
NetWorkManager.g_HallServiceIsLogin = false;
NetWorkManager.hallEvents = new EventEmitter();


module.exports = NetWorkManager;