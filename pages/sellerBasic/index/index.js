// pages/sellerBasic/index/index
const app = getApp();
const tabbar = require("../../../utils/tabbar.js");
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // stateType：身份值
        stateType: "",
        // manufactor：厂家操作列表
        manufactorList: [
            {
                navUrl: "/pages/manufactor/myWare/index",
                iconImg: "/resources/imgs/handle1.png",
                text: "我的宝贝"
            },
            {
                navUrl: "/pages/sellerBasic/orderManage/index",
                iconImg: "/resources/imgs/handle2.png",
                text: "订单管理"
            },
            {
                navUrl: "/pages/manufactor/wareCencus/index",
                iconImg: "/resources/imgs/handle3.png",
                text: "商品统计"
            },
            {
                navUrl: "/pages/sellerBasic/msgNotify/index",
                iconImg: "/resources/imgs/handle4.png",
                text: "平台消息"
            }
        ],
        // agentList：代理商操作列表
        agentList: [
            {
                navUrl: "/pages/agent/myWare/index",
                iconImg: "/resources/imgs/handle1.png",
                text: "我的宝贝"
            },
            {
                navUrl: "/pages/sellerBasic/orderManage/index",
                iconImg: "/resources/imgs/handle2.png",
                text: "订单管理"
            },
            {
                navUrl: "/pages/agent/wareCencus/index",
                iconImg: "/resources/imgs/handle3.png",
                text: "商品统计"
            },
            {
                navUrl: "/pages/agent/wareShop/index",
                iconImg: "/resources/imgs/handle5.png",
                text: "商品商城"
            },
            {
                navUrl: "/pages/sellerBasic/msgNotify/index",
                iconImg: "/resources/imgs/handle4.png",
                text: "平台消息"
            }
        ],
        // tabbarList：底部导航栏
        tabbarList: [],
        // tabbarIndex：当前底部导航栏索引
        tabbarIndex: "",
        // manufactorStoreInfo：大B首页店铺信息
        manufactorStoreInfo: "",
        // agentStoreInfo：小B首页店铺信息
        agentStoreInfo: "",
        // showVersion：显示版本提示
        showVersion: false
    },

    onLoad() {
        that = this;

        // 判断目前小程序版本是否支持所有功能
        let version = app.getSystem();

        if (app.compareVersion(version, '2.3.0') < 0) {
            that.setData({
                showVersion: true
            });
        }

        // 判断是否登录
        app.isLogin();

        // 设置底部导航栏索引
        wx.setStorageSync('tabbarIndex', 0);

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');
        let tabbarList;

        // stateType == 2 (大B)
        if (stateType == 2) {
            tabbarList = tabbar.manufactor();

            that.setData({
                stateType: stateType,
                tabbarList: tabbarList,
                isIphoneX: app.globalData.isIphoneX,
                tabbarIndex: 0
            });
        }

        // stateType == 3 (小B)
        if (stateType == 3) {
            tabbarList = tabbar.agent();

            that.setData({
                stateType: stateType,
                tabbarList: tabbarList,
                isIphoneX: app.globalData.isIphoneX,
                tabbarIndex: 0
            })
        }
    },

    onShow() {
        // 如果缓存中有分类则删除
        if (wx.getStorageSync('classify')) {
            wx.removeStorageSync('classify');
        }

        // 如果缓存中有下架商品详情则删除
        if (wx.getStorageSync('lowerWareInfo')) {
            wx.removeStorageSync('lowerWareInfo');
        }

        // 如果缓存中有商品详情则删除
        if (wx.getStorageSync('wareInfo')) {
            wx.removeStorageSync('wareInfo');
        }

        // 如果缓存中有代理商详情则删除
        if (wx.getStorageSync('agentInfo')) {
            wx.removeStorageSync('agentInfo');
        }

        let stateType = that.data.stateType;

        // stateType == 2 (大B)
        if (stateType == 2) {
            // 获取大B首页店铺展示信息
            that.getManufactorIndexInfo();

            // 获取大B首页店铺数据统计
            that.getManufactorStoreCencus();
        }

        // stateType == 3 (小B)
        if (stateType == 3) {
            // 获取小B首页店铺展示信息
            that.getAgentIndexInfo();
        }
    },

    // 获取大B首页店铺展示信息
    getManufactorIndexInfo() {
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
                        manufactorStoreInfo: result
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

    // 获取大B首页店铺数据统计
    getManufactorStoreCencus() {
        let memberId = wx.getStorageSync('memberId');
        let data = {
            member_id: memberId
        };

        app.request('member/distributor', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                // if (result.code === 200) {
                //     that.setData({
                //         manufactorStoreInfo: result
                //     });
                // } else {
                //     app.showToast(result.msg, 'none');
                // }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 获取小B首页店铺展示信息
    getAgentIndexInfo() {
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
                        agentStoreInfo: newAccountInfo
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

    // 去店铺编辑
    goEditStore() {
        app.navigateTo('/pages/sellerBasic/editStore/index');
    }

})
