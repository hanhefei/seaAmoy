//pages/sellerBasic/myCode/index
const app = getApp();
let that;

Page({

    data: {
        // stateType：身份值
        stateType: "",
        // codePath：邀请码路径
        codePath: "",
        // storeInfo：店铺信息
        storeInfo: ""
    },

    onLoad () {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');

        // stateType == 2 (大B)
        // stateType == 3 (小B)
        if (stateType == 2) {
            let accountInfo = wx.getStorageSync('accountInfo');
            
            that.setData({
                stateType: stateType,
                storeInfo: accountInfo
            });
            
            // 获取大B邀请码
            that.getManufactorCode();
        } else {
            let accountInfo = wx.getStorageSync('accountInfo');
            
            that.setData({
                stateType: stateType,
                storeInfo: accountInfo
            });
            
            // 获取小B邀请码
            that.getAgentCode();
        }
    },

    // 获取大B邀请码
    getManufactorCode () {
        let memberId = wx.getStorageSync('memberId');
        let data = {
            member_id: memberId,
            path: "/pages/sellerBasic/authorize/index"
        };

        app.request('shop/bigb_getwxaqrcode', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        codePath: result.path
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

    // 获取小B邀请码
    getAgentCode () {
        let openid = wx.getStorageSync('openid');
        let data = {
            openid: openid,
            path: "/pages/sellerBasic/authorize/index"
        };

        app.request('shop/smallb_getwxaqrcode', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        codePath: result.path
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

    // 保存图片
    saveImg () {
        app.saveImg(() => {
            let codePath = that.data.codePath;

            wx.downloadFile({
                url: codePath,
                success (res) {
                    if (res.statusCode === 200) {
                        let tempFilePath = res.tempFilePath;
    
                        wx.saveImageToPhotosAlbum({
                            filePath: tempFilePath,
                            success (res) {
                                if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
                                    wx.showToast({
                                        title: '保存到相册成功',
                                        icon: 'success',
                                        duration: 5000,
                                        mask: true
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });
    }

})
