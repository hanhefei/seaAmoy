//pages/sellerBasic/classify/index
const app = getApp();
let that;

Page({

    data: {
        // screenHeight：屏幕可视高度
        screenHeight: 0,
        // stateType：身份值
        stateType: "",
        // countryList：国家列表
        countryList: [],
        // countryActive：国家选中索引
        countryActive: 0,
        // floorList：楼层列表
        floorList: [],
        // floorActive：楼层选中索引
        floorActive: 0,
        // typeList：类型列表
        typeList: []
    },

    onLoad () {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');

        // stateType == 2 (大B)
        // stateType == 1 (小B)
        if (stateType == 2) {
            // 获取大B国家列表之后，获取大B分类列表
            that.getManufactorCoutry();
        } else {
            // 获取小B国家列表之后，获取小B分类列表
            that.getAgentCoutry();
        }

        that.setData({
            stateType: stateType,
            screenHeight: app.globalData.system.windowHeight
        });
    },

    onShow () {
        let classify = wx.getStorageSync('classify');

        if (classify) {
            wx.removeStorageSync('classify');
        }

        // 获取其他高度
        that.getOtherHeight();
    },

    // 获取大B国家列表
    getManufactorCoutry () {
        let memberId = wx.getStorageSync('memberId');
        let data = {
            member_id: memberId
        };
        
        app.request('Goods/country', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        countryList: result.data
                    });

                    // 获取大B分类列表
                    that.getManufactorClassifyLsit();
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 获取大B分类列表
    getManufactorClassifyLsit () {
        let memberId = wx.getStorageSync('memberId');
        let countryList = that.data.countryList;
        let countryActive = that.data.countryActive;
        let data = {
            member_id: memberId,
            country_id: countryList[countryActive].id
        };
        
        app.request('goods/goods_type', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    let floorActive = that.data.floorActive;

                    that.setData({
                        floorList: result.data, 
                        typeList: result.data[floorActive].children ? result.data[floorActive].children : []
                    });
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else if (res.code === 400 && res.msg == "暂无分类") {
                
                that.setData({
                    floorList: [],
                    typeList: []
                });

                app.showToast(res.msg, 'none');
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 获取小B国家列表
    getAgentCoutry () {
        let accountInfo = wx.getStorageSync('accountInfo');
        let data = {
            member_id: accountInfo.admin_id
        };
        
        app.request('Goods/country', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        countryList: result.data
                    });

                    // 获取小B分类列表
                    that.getAgentClassifyLsit();
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 获取小B分类列表
    getAgentClassifyLsit () {
        let openid = wx.getStorageSync('openid');
        let countryList = that.data.countryList;
        let countryActive = that.data.countryActive;
        let data = {
            openid: openid,
            country_id: countryList[countryActive].id
        };
        
        app.request('goods/samll_type', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    let floorActive = that.data.floorActive;

                    that.setData({
                        floorList: result.data, 
                        typeList: result.data[floorActive].children ? result.data[floorActive].children : []
                    });
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else if (res.code === 400 && res.msg == "暂无分类") {
                
                that.setData({
                    floorList: [],
                    typeList: []
                });

                app.showToast(res.msg, 'none');
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 切换国家
    changeCountry (e) {
        let stateType = that.data.stateType;
        let index = e.currentTarget.dataset.index;
        let countryActive = that.data.countryActive;

        if (stateType === 2) {
            if (index != countryActive) {
                that.setData({
                    countryActive: index,
                    floorActive: 0
                });
        
                // 获取大B分类列表
                that.getManufactorClassifyLsit();
            }
        } else {
            if (index != countryActive) {
                that.setData({
                    countryActive: index,
                    floorActive: 0
                });
        
                // 获取小B分类列表
                that.getAgentClassifyLsit();
            }
        }
    },

    // 切换分类
    changeFloor (e) {
        let index = e.currentTarget.dataset.index;
        let floorList = that.data.floorList;
        let floorActive = that.data.floorActive;

        if (index != floorActive) {
            that.setData({
                floorActive: index,
                typeList: floorList[index].children ? floorList[index].children : []
            });
        }
    },

    // 选择当前分类
    selectThisType (e) {
        let index = e.currentTarget.dataset.index;
        let typeList = that.data.typeList;

        wx.setStorageSync('classify', typeList[index]);

        app.navigateBack(1);
    },

    // 获取其他高度
    getOtherHeight () {
        let screenHeight = that.data.screenHeight;
        let newScreenHeight = 0;

        const query = wx.createSelectorQuery();

        query.select('.countryElement').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec((res) => {
            let otherHeight = res[0].top + res[0].height;
            
            newScreenHeight = screenHeight - otherHeight;
            
            that.setData({
                screenHeight: newScreenHeight
            });
        });
    },

    // 去搜索
    goThisSearch () {
        app.navigateTo('/pages/sellerBasic/classify/search');
    }

})
