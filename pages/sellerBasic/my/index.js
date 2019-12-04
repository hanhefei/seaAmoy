//pages/sellerBasic/my/index
const app = getApp();
const tabbar = require("../../../utils/tabbar.js");
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // stateType：身份值
        stateType: "",
        // tabbarList：底部导航栏
        tabbarList: [],
        // tabbarIndex：当前底部导航栏索引
        tabbarIndex: "",
        // storeInfo：店铺信息
        storeInfo: "",
        // openid：大B是否登录
        openid: false
    },

    onLoad () {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');

        // stateType == 2 (大B)
        // stateType == 3 (小B)
        if (stateType == 2) {
            // 设置底部导航栏索引
            wx.setStorageSync('tabbarIndex', 3);
            
            let openid = wx.getStorageSync('accountInfo').openid;
    
            // 大B
            let tabbarList = tabbar.manufactor();

            that.setData({
                stateType: stateType,
                tabbarList: tabbarList,
                isIphoneX: app.globalData.isIphoneX,
                tabbarIndex: 3,
                openid: openid ? true : false
            })
        } else {
            // 设置底部导航栏索引
            wx.setStorageSync('tabbarIndex', 2);

            // 小B
            let tabbarList = tabbar.agent();

            that.setData({
                stateType: stateType,
                tabbarList: tabbarList,
                isIphoneX: app.globalData.isIphoneX,
                tabbarIndex: 2
            })
        }
    },

    onShow () {
        let stateType = that.data.stateType;

        // stateType == 2 (大B)
        // stateType == 1 (小B)
        if (stateType == 2) {
            // 获取大B我的店铺展示信息
            that.getManufactorStoreInfo();
        } else {
            // 获取小B我的店铺展示信息
            that.getAgentStoreInfo();
        }
    },

    // 获取大B我的店铺展示信息
    getManufactorStoreInfo () {
        let memberId = wx.getStorageSync('memberId');
        let data = {
            member_id: memberId
        };

        app.request('member/big_my', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        storeInfo: result
                    });
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 获取小B我的店铺展示信息
    getAgentStoreInfo () {
        let openid = wx.getStorageSync('openid');
        let data = {
            openid: openid
        };

        app.request('login/samll_my', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    let accountInfo = wx.getStorageSync('accountInfo');

                    let newAccountInfo = Object.assign(accountInfo, {
                        id: result.shop.id,
                        logo: result.shop.logo,
                        shop_name: result.shop.shop_name,
                        goods_count: result.goods_count,
                        user_count: result.user_count
                    });

                    wx.setStorageSync('accountInfo', newAccountInfo);

                    that.setData({
                        storeInfo: newAccountInfo
                    });
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 去我的销售额
    goMySales () {
        app.navigateTo('/pages/sellerBasic/mySales/index');
    },

    // 去我的商品
    goMyWare () {
        app.navigateTo('/pages/sellerBasic/myWare/index');
    },

    // 去我的代理商
    goMyLower () {
        app.navigateTo('/pages/sellerBasic/myLower/index');
    },

    // 去优惠券管理
    goCouponManage () {
        app.navigateTo('/pages/agent/couponManage/index');
    },

    // 去我的二维码
    goMyCode () {
        app.navigateTo('/pages/sellerBasic/myCode/index');
    },

    // 绑定微信
    bindWechat (e) {
        if (e.detail.userInfo) {
            let userInfo = e.detail.userInfo;

            app.globalData.userInfo = userInfo;

            app.login(() => {
                let memberId = wx.getStorageSync('memberId');

                let code = wx.getStorageSync('code');

                const data = {
                    code:  code,
                    member_id: memberId,
                    username: userInfo.nickName,
                    headimg: userInfo.avatarUrl
                };

                app.request('member/WxLogin', data, res => {
                    console.log(res);
    
                    if (res.code === 600) {
                        let result = res.data;
    
                        if (result.code === 200) {
                            app.showToast('绑定成功', 'success');

                            let accountInfo = wx.getStorageSync('accountInfo');
    
                            accountInfo.headimg = result.headimg;
                            accountInfo.openid = result.openid;
                            accountInfo.type = result.type;
                            accountInfo.user_id = result.user_id;
                            accountInfo.username = result.username;

                            wx.setStorageSync('accountInfo', accountInfo);

                            wx.removeStorageSync('code');
    
                            that.setData({
                                openid: true
                            });
                        } else {
                            app.showToast(result.msg, 'none');
                        }
                    } else {
                        app.showToast(res.msg, 'none');
                    }

                    app.hideLoading();
                });
            });
        }
    }

})
