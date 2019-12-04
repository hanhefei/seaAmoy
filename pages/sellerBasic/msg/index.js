//pages/sellerBasic/msg/index
const app = getApp();
const util = app.globalData.util;
const tabbar = require("../../../utils/tabbar.js");
const socket_url = "wss://tp.kangzihang.top/websocket";
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // stateType：身份值
        stateType: "",
        // msgList：商品列表
        msgList: [],
        // tabbarList：底部导航栏
        tabbarList: [],
        // tabbarIndex：当前底部导航栏索引
        tabbarIndex: ""
    },

    onLoad () {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');
        let tabbarList;

        // manufactor || stateType == 2 (大B)
        // agent || stateType == 1 (小B)
        if (stateType == 2) {
            // 设置底部导航栏索引
            wx.setStorageSync('tabbarIndex', 2);
            
            tabbarList = tabbar.manufactor();

            that.setData({
                stateType: stateType,
                tabbarList: tabbarList,
                isIphoneX: app.globalData.isIphoneX,
                tabbarIndex: 2
            });
        } else {
            // 设置底部导航栏索引
            wx.setStorageSync('tabbarIndex', 1);

            tabbarList = tabbar.agent();

            that.setData({
                stateType: stateType,
                tabbarList: tabbarList,
                isIphoneX: app.globalData.isIphoneX,
                tabbarIndex: 1
            });
        }

        // 连接socket
        that.connectSocket();

        // 监听接收数据
        that.onSocketMessage();
    },

    onShow () {
        if (wx.getStorageSync('chat')) {
            // 连接socket
            that.connectSocket();
    
            // 监听接收数据
            that.onSocketMessage();

            wx.removeStorageSync('chat');
        }
    },

    onHide: function () {
        wx.closeSocket({
            success() {
                console.log("关闭socket")
            }
        });
    },

    onUnload: function () {
        wx.closeSocket({
            success() {
                console.log("关闭socket")
            }
        });
    },

    // 去聊天页面
    goChat (e) {
        let toid = e.currentTarget.dataset.toid;

        wx.setStorageSync('chat', true);

        app.navigateTo('/pages/sellerBasic/msg/chat?toid=' + toid);
    },
  
    // 连接socket
    connectSocket () {
        wx.connectSocket({
            url: socket_url
        });

        wx.onSocketOpen(() => {});
    },

    // 监听接受数据
    onSocketMessage () {
        let user_id = wx.getStorageSync('accountInfo').user_id;

        let msgList = that.data.msgList;

        wx.onSocketMessage(function (res) {

            let data = JSON.parse(res.data);

            console.log(data);

            switch (data.type) {
                case "init":
                    let initData = JSON.stringify({
                        "type": "bind",
                        "fromid": user_id
                    });

                    // console.log("初始化", initData);

                    //推送消息
                    wx.sendSocketMessage({
                        data: initData
                    })
                    
                    //查找聊天列表
                    app.request('Chat/get_list', {
                        id: user_id
                    }, res => {
                        console.log(res);

                        let user_list = res.data.data;

                        // console.log("用户列表", user_list);

                        //查询到的数据
                        user_list.filter(element => {
                            element.last_message.chatTime = util.formYearMonthDay(element.last_message.time * 1000);
                        });

                        msgList = user_list;

                        that.setData({
                            msgList: msgList
                        });

                        app.hideLoading();
                    });
                break;

                case "online":
                    console.log("online", data);

                    if(data.status == 0){
                        wx.setNavigationBarTitle({
                            title: '离线'
                        });
                    }else{
                        wx.setNavigationBarTitle({
                            title: '在线'
                        });
                    }
                break;

                case "text":
                    msgList.filter(element => {
                        if (element.toid == data.fromid) {
                            element.last_message.content = data.data;
                            element.last_message.isread = data.isread;
                            element.last_message.time = data.time;
                            element.last_message.chatTime = util.formYearMonthDay(data.time * 1000);
                        }
                    });

                    that.setData({
                        msgList: msgList
                    });
                break;
            }
        })
    }

})
