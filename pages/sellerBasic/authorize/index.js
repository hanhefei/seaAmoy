// pages/sellerBasic/authorize/index
const app = getApp();
let that;

Page({

    data: {
        // memberId:大Bid
        memberId: "",
        // userInfo：用户信息
        userInfo: "",
        // userName：账号
        userName: "",
        // passWord：密码
        passWord: ""
    },

    onLoad: function (options) {
        that = this;
        
        let memberId = options.member_id;

        if (memberId) {
            that.setData({
                memberId: memberId
            });
        }
    },

    // 保存输入的账号密码
    saveInputText (e) {
        let variable = e.currentTarget.dataset.variable;
        let inputText = e.detail.value;

        that.setData({
            [variable]: inputText
        });
    },

    // 账号密码登录
    login () {
        let userName = that.data.userName;
        let passWord = that.data.passWord;

        let data ={
            username: userName,
            password: passWord
        };

        app.request('Member/login', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast(result.msg, 'success');

                    let accountInfo = Object.assign(result.member, result.user);

                    wx.setStorageSync('accountInfo', accountInfo);

                    wx.setStorageSync('memberId', result.member.id);

                    wx.setStorageSync('stateType', 2);
                    
                    wx.removeStorageSync('code');

                    app.afterHandle(() => {
                        app.reLaunch('/pages/sellerBasic/index/index');
                    });
                } else {
                    app.showToast(res.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 通过按钮形式获取用户授权
    getUserInfo (e) {
        if (e.detail.userInfo) {
            let userInfo = e.detail.userInfo;

            app.globalData.userInfo = userInfo;

            // 微信登录
            app.login(() => {
                that.wxAithorize(userInfo);
            });
        }
    },

    // 微信登录
    wxAithorize (userInfo) {
        let code = wx.getStorageSync('code');
        
        let data = {
            code:  code,
            username: userInfo.nickName,
            headimg: userInfo.avatarUrl
        };

        app.request('member/WxLogin', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast(result.msg, 'success');

                    // type（2为大B，3为小B）
                    if (result.type == 2) {
                        let manufactor = {
                            member_id: result.admin_id,
                            type: result.type,
                            user_id: result.user_id,
                            openid: result.openid,
                            username: result.username,
                            headimg: result.headimg
                        };

                        wx.setStorageSync('accountInfo', manufactor);

                        wx.setStorageSync('memberId', result.admin_id);
                    } else {
                        // admin_id（有的话则绑定了大B，没有则没有绑定过）
                        if (result.admin_id) {
                            let agentInfo = {
                                admin_id: result.admin_id,
                                type: result.type,
                                user_id: result.user_id,
                                openid: result.openid,
                                username: result.username,
                                headimg: result.headimg
                            };
    
                            wx.setStorageSync('accountInfo', agentInfo);
    
                            wx.setStorageSync('openid', agentInfo.openid);
                        } else {
                            // 没有绑定过大B
                            let memberId = that.data.memberId;

                            // memberId（如果为真，说明被人邀请；如果不为真则不能进入程序）
                            if (memberId) {
                                let requestData ={
                                    openid: result.openid,
                                    member_id: memberId
                                };
    
                                app.request('Login/small_distributor', requestData, response => {
                                    console.log(response);
    
                                    if (response.code === 600) {
                                        let responseResult = response.data;
    
                                        if (responseResult.code === 200) {
                                            app.showToast(responseResult.msg, 'success');
    
                                            let agentInfo = {
                                                admin_id: memberId,
                                                type: 3,
                                                user_id: result.user_id,
                                                openid: result.openid,
                                                username: result.username,
                                                headimg: result.headimg
                                            };
                    
                                            wx.setStorageSync('accountInfo', agentInfo);
                    
                                            wx.setStorageSync('openid', agentInfo.openid);
                                        }
                                    } else {
                                        app.showToast(response.msg, 'none');
                                    }

                                    app.hideLoading();
                                });
                            } else {
                                wx.showToast({
                                    title: "您暂无进入当前小程序的身份",
                                    icon: "none",
                                    duration: 5000,
                                    mask: true
                                });
                                
                                return false;
                            }
                        }
                    }

                    wx.setStorageSync('stateType', result.type ? result.type : 3);
                    
                    wx.removeStorageSync('code');
                    
                    app.afterHandle(() => {
                        app.reLaunch('/pages/sellerBasic/index/index');
                    });
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else if (res.code === 400) {
                app.login(() => {
                    that.wxAithorize(userInfo);
                });
            }  else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    }

})
