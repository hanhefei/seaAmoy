//pages/sellerBasic/myLower/index
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // beforeLower：之前的下级
        beforeLower: 0,
        // allLower：所有的下级
        allLower: 0,
        // lowerList：下级列表
        lowerList: []
    },

    onLoad () {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');

        // stateType == 2 (大B)
        // stateType == 3 (小B)
        if (stateType == 2) {
            that.setData({
                isIphoneX: app.globalData.isIphoneX,
                stateType: stateType
            });
            
            // 获取大B下所有代理商
            that.getManufactorLower();
        } else {
            that.setData({
                isIphoneX: app.globalData.isIphoneX,
                stateType: stateType
            });
            
            // 获取小B下所有粉丝
            that.getAgentLower();
        }
    },

    // 获取大B下所有代理商
    getManufactorLower () {
        let memberId = wx.getStorageSync('memberId');
        let data = {
            member_id: memberId
        };

        app.request('member/distributor', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        beforeLower: result.yest_count,
                        allLower: result.count,
                        lowerList: result.data
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

    // 获取小B下所有粉丝
    getAgentLower () {
        let openid = wx.getStorageSync('openid');
        let data = {
            openid: openid
        };

        app.request('login/distributor', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        beforeLower: result.yest_count,
                        allLower: result.count,
                        lowerList: result.data
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

    // 删除大B下的代理商
    delManufactorLower (e) {
        let memberId = wx.getStorageSync('memberId');
        let lowerId = e.currentTarget.dataset.lowerId;
        let data = {
            member_id: memberId,
            id: lowerId
        };
        
        app.request('member/proxy_del', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast('移除成功', 'success');

                    let lowerList = that.data.lowerList;
                    let lowerIndex;

                    lowerList.filter((element, eIndex) => {
                        if (element.id == lowerId) {
                            lowerIndex = eIndex;
                        }
                    });

                    lowerList.splice(lowerIndex, 1);

                    that.setData({
                        lowerList: lowerList
                    });

                    // 获取大B下所有代理商
                    that.getManufactorLower();
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 删除小B下的粉丝
    delAgentLower (e) {
        let openid = wx.getStorageSync('openid');
        let lowerId = e.currentTarget.dataset.lowerId;
        let data = {
            openid: openid,
            id: lowerId
        };

        app.request('login/proxy_del', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast('移除成功', 'success');

                    let lowerList = that.data.lowerList;
                    let lowerIndex;

                    lowerList.filter((element, eIndex) => {
                        if (element.id == lowerId) {
                            lowerIndex = eIndex;
                        }
                    });

                    lowerList.splice(lowerIndex, 1);

                    that.setData({
                        lowerList: lowerList
                    });

                    // 获取小B下所有粉丝
                    that.getAgentLower();
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    }

})
