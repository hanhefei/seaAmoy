//pages/sellerBasic/editStore/index
const app = getApp();
const util = app.globalData.util;
let that;

Page({

    data: {
        // stateType：身份值
        stateType: "",
        // manufactorEditInfo：大B编辑信息
        manufactorEditInfo: "",
        // storeImg：大B上传的图片信息
        storeImg: "",
        // storeName：大B店铺名称
        storeName: "",
        // storeClassify：大B店铺主营分类
        storeClassify: "",
        // storeCoutry：大B店铺主营国家
        storeCoutry: "",
        // storePhone：大B店铺电话
        storePhone: "",
        // agentEditInfo：小B编辑信息
        agentEditInfo: "",
        // agentStoreImg：小B上传的图片信息
        agentStoreImg: "",
        // agentStoreName：小B店铺名称
        agentStoreName: "",
        // agentStorePhone：小B店铺电话
        agentStorePhone: ""
    },

    onLoad () {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');

        // stateType == 2 (大B)
        // stateType == 1 (小B)
        if (stateType == 2) {
            // 获取大B首页展示信息
            that.getManufactorEditInfo();
        } else {
            // 获取小B编辑信息
            that.getAgentEditInfo();
        }

        that.setData({
            stateType: stateType
        });
    },

    // 获取大B编辑信息
    getManufactorEditInfo () {
        let memberId = wx.getStorageSync('memberId');
        let data = {
            member_id: memberId
        };
        
        app.request('shop/bigb_show', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    let record = result.data;

                    let manufactorStoreInfo = wx.getStorageSync('accountInfo');

                    manufactorStoreInfo.username = record.username;
                    manufactorStoreInfo.shop_name = record.shop_name;
                    manufactorStoreInfo.country = record.country;
                    manufactorStoreInfo.category = record.category;
                    manufactorStoreInfo.customer = record.customer;
                    manufactorStoreInfo.logo = record.logo;

                    wx.setStorageSync('accountInfo', manufactorStoreInfo);

                    that.setData({
                        manufactorEditInfo: record,
                        storeImg: record.logo,
                        storeName: record.shop_name,
                        storeClassify: record.category,
                        storeCoutry: record.country,
                        storePhone: record.customer
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

    // 获取小B编辑信息
    getAgentEditInfo () {
        let openid = wx.getStorageSync('openid');
        let data = {
            openid: openid
        };
        
        app.request('shop/smallb_shows', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    let record = result.data;

                    let agentStoreInfo = wx.getStorageSync('accountInfo');

                    agentStoreInfo.shop_name = record.shop_name;
                    agentStoreInfo.country = record.country;
                    agentStoreInfo.category = record.category;
                    agentStoreInfo.customer = record.customer;
                    agentStoreInfo.logo = record.logo;

                    wx.setStorageSync('accountInfo', agentStoreInfo);

                    that.setData({
                        agentEditInfo: record,
                        agentStoreImg: record.logo,
                        agentStoreName: record.shop_name,
                        agentStorePhone: record.customer
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

    // 修改店铺图片
    editStoreImg () {
        util.updateImg(1, (imgArr) => {
            that.setData({
                storeImg: imgArr[0]
            });

            app.hideLoading();
        });
    },

    // 修改店铺图片（小B）
    editAgentStoreImg () {
        util.updateImg(1, (imgArr) => {
            that.setData({
                agentStoreImg: imgArr[0]
            });

            app.hideLoading();
        });
    },

    // 保存输入的值
    saveInput (e) {
        let variable = e.currentTarget.dataset.variable;
        let inputText = (e.detail.value).trim();

        that.setData({
            [variable]: inputText
        });
    },

    // 改变大B店铺信息
    editManufactorStoreInfo () {
        let memberId = wx.getStorageSync('memberId');
        let manufactorEditInfo = that.data.manufactorEditInfo;
        let storeImg = that.data.storeImg;
        let storeName = that.data.storeName;
        let storeClassify = that.data.storeClassify;
        let storeCoutry = that.data.storeCoutry;
        let storePhone = that.data.storePhone;
        let data = {
            member_id: memberId,
            logo: storeImg,
            shop_name: storeName,
            category: storeClassify,
            country: storeCoutry,
            customer: storePhone
        };

        if (manufactorEditInfo.logo == storeImg && manufactorEditInfo.shop_name == storeName && manufactorEditInfo.category == storeClassify && manufactorEditInfo.country == storeCoutry && manufactorEditInfo.customer == storePhone) {
            app.showToast('请改变店铺信息后在进行确认操作', 'none');
        } else {
            app.request('shop/update', data, res => {
                console.log(res);

                if (res.code === 600) {
                    let result = res.data;

                    if (result.code === 200) {
                        app.showToast('修改成功!', 'success');

                        app.afterHandle(() => {
                            // 获取大B编辑信息
                            that.getManufactorEditInfo();
                        });
                    } else {
                        app.showToast(result.msg, 'none');
                    }
                } else {
                    app.showToast(res.msg, 'none');
                }

                app.hideLoading();
            });
        }
    },

    // 改变小B店铺信息
    editAgentStoreInfo () {
        let openid = wx.getStorageSync('openid');
        let agentEditInfo = that.data.agentEditInfo;
        let agentStoreImg = that.data.agentStoreImg;
        let agentStoreName = that.data.agentStoreName;
        let agentStoreClassify = agentEditInfo.category;
        let agentStoreCoutry = agentEditInfo.country;
        let agentStorePhone = that.data.agentStorePhone;
        let data = {
            openid: openid,
            logo: agentStoreImg,
            shop_name: agentStoreName,
            category: agentStoreClassify,
            country: agentStoreCoutry,
            customer: agentStorePhone
        };

        if (agentEditInfo.logo == agentStoreImg && agentEditInfo.shop_name == agentStoreName && agentEditInfo.customer == agentStorePhone) {
            app.showToast('请改变店铺信息后在进行确认操作', 'none');
        } else {
            app.request('shop/small_update', data, res => {
                console.log(res);

                if (res.code === 600) {
                    let result = res.data;

                    if (result.code === 200) {
                        app.showToast('修改成功!', 'success');

                        app.afterHandle(() => {
                            // 获取小B编辑信息
                            that.getAgentEditInfo();
                        });
                    } else {
                        app.showToast(result.msg, 'none');
                    }
                } else {
                    app.showToast(res.msg, 'none');
                }

                app.hideLoading();
            });
        }
    }

})