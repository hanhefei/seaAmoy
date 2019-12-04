//pages/sellerBasic/msg/chat
const app = getApp();
const socket_url = "wss://tp.kangzihang.top/websocket";
let that;

Page({

    data: {
        // system：设备信息
        system: app.globalData.system,
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // stateType：身份值
        stateType: "",
        // chatList：消息列表
        chatList: [],
        // inputText：输入内容
        inputText: "",
        // toid：接收者id
        toid : "",
        // fromid：发送者id
        fromid: "",
        // userName：发送者用户名
        userName: "",
        // headimg：发送者头像
        headimg: "",
        // online：是否在线
        online: "",
        // to_head：接受者头像
        to_head: "",
        // from_head：发送者头像
        from_head: "",
        // toIndex：到底部
        toIndex: ""
    },

    onLoad (options) {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');
        let accountInfo = wx.getStorageSync('accountInfo');

        // manufactor || stateType == 2 (大B)
        // agent || stateType == 1 (小B)
        that.setData({
            stateType: stateType,
            isIphoneX: app.globalData.isIphoneX,
            toid: options.toid,
            fromid: accountInfo.user_id,
            userName: accountInfo.username,
            headimg: accountInfo.headimg
        });

        // 连接socket
        that.connectSocket();

        // 监听接收数据
        that.onSocketMessage();

        // 设置窗口高度
        that.setScreenHeight();
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

    // 设置窗口高度
    setScreenHeight () {
        let system = that.data.system;
        let isIphoneX = that.data.isIphoneX;
        let sendHeight;

        const query = wx.createSelectorQuery();
        query.select('.controller').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(function(res){
            sendHeight = res[0].height;

            that.setData({
                sHeight: isIphoneX ? system.windowHeight - 34 - sendHeight : system.windowHeight - sendHeight
            });
        })
    },

    // 保存输入值
    saveInput (e) {
        that.setData({
            inputText: e.detail.value
        });
    },
    
    //发送消息
    send () {
        if (that.data.inputText) {
            // 发送消息
            that.sendSocketMessage("say");

            let chatList = that.data.chatList;

            let userName = that.data.userName;

            let inputText = (that.data.inputText).trim();

            let accountInfo = wx.getStorageSync('accountInfo');
            
            // type（1为文字）
            let sayData = {
                type: "1",
                content: inputText,
                pos: "flex-end",
                headimg: accountInfo.headimg,
                fromname: userName
            };

            chatList.push(sayData);

            let len = chatList.length - 1;

            that.setData({
                chatList: chatList,
                inputText: '',
                toIndex: `chat${len}`
            });
        } else {
            app.showToast('信息不能为空', 'none');
        }
    },

    // 连接socket
    connectSocket(){
        wx.connectSocket({
            url: socket_url
        });

        wx.onSocketOpen(() => {});
    },
    
    // socket发送消息
    sendSocketMessage(type){
        let data;

        switch (type) {
            //发送消息
            case "say":
                data = JSON.stringify({
                    "type": "say",
                    "data": that.data.inputText,
                    "fromid": that.data.fromid,
                    "toid": that.data.toid
                });

                console.log("聊天", data);
                
                //推送消息
                wx.sendSocketMessage({
                    data: data
                });
            break;

            case "voice":
                // data = JSON.stringify({
                //     "type": "voice",
                //     "name": that.data.name,
                //     "headimg": that.data.headimg,
                //     "content": that.data.path,
                //     duration: that.data.duration
                // });
            break;

            case "pong":
                data = JSON.stringify({
                    "type": "pong"
                });
            break;
        }
    },

    // 监听接受数据
    onSocketMessage(){
        let chatList = that.data.chatList;

        wx.onSocketMessage(function (res) {
            let data = JSON.parse(res.data);
            
            console.log("转换",data);

            let data2;

            switch (data.type) {
                case "init":
                    let initData = JSON.stringify({
                        "type": "bind",
                        "fromid": that.data.fromid
                    });

                    console.log("推送消息", initData);
                    
                    //推送消息
                    wx.sendSocketMessage({
                        data: initData
                    });

                    //查找双方用户的头像
                    app.request('Chat/get_head', {
                        fromid: that.data.fromid,
                        toid: that.data.toid
                    }, res => {
                        //赋值头像
                        that.setData({
                            from_head: res.data.from_head,
                            to_head: res.data.to_head
                        });

                        app.hideLoading();
                    });

                    //查找toid聊天人的名称
                    app.request('Chat/get_name', {
                        toid: that.data.toid
                    }, res => {
                        // app.showToast('获取成功', 'none');

                        app.hideLoading();
                    });

                    //查找聊天列表数据
                    app.request('Chat/load', {
                        fromid: that.data.fromid,
                        toid: that.data.toid
                    }, res => {
                        console.log(res);

                        let newChatList = [];

                        let dataList = res.data.data;

                        console.log("列表消息", dataList);

                        if (dataList) {
                            dataList.filter(element => {
                                newChatList.push(element);
                            })
                            
                            let len = newChatList.length - 1

                            that.setData({
                                chatList: newChatList,
                                toIndex: `chat${len}`
                            })
                        }

                        app.hideLoading();
                    });

                    //更新信息为已读
                    app.request('Chat/changeNoRead', {
                        toid: that.data.toid,
                        fromid: that.data.fromid
                    }, res => {
                        // app.showToast('获取成功', 'none');

                        app.hideLoading();
                    });
                    
                    var initData2 =  JSON.stringify({
                        "type": "online",
                        "fromid": that.data.fromid,
                        "toid": that.data.toid
                    });

                    //推送消息
                    wx.sendSocketMessage({
                        data: initData2
                    });
                break;

                case "text":
                    let newChatList = that.data.chatList;

                    var accountInfo = wx.getStorageSync('accountInfo');

                    var textData = {
                        type: "1",
                        content: data.data,
                        pos: "flex-start",
                        headimg: accountInfo.headimg
                    };

                    newChatList.push(textData);

                    let newLen = newChatList.length - 1;

                    that.setData({
                        chatList: newChatList,
                        toIndex: `chat${newLen}`
                    });
                break;
                
                case "save":
                    //保存发布信息
                    app.request('Chat/save_message', data, res => {
                        // app.showToast('获取成功', 'none');

                        app.hideLoading();
                    });

                    if(data.isread == 1){
                        that.data.online = 1;

                        console.log('在线');

                        wx.setNavigationBarTitle({
                            title: '在线'
                        });
                    }else{
                        that.data.online = 0;

                        console.log('离线');

                        wx.setNavigationBarTitle({
                            title: '离线'
                        });
                    }
                break;

                case "online":
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
            }

            if (data2) {
                chatList.push(data2)

                that.setData({
                    chatList: chatList,
                    toIndex: 'sss'
                });
            }
        })
    },

})
