//pages/agent/myWare/lowerWare
const app = getApp();
let that;

Page({

    data: {
        // lowerWareId：下架商品id
        lowerWareId: "",
        // lowerWareId：下架商品id
        lowerWareInfo: "",
        // lowerContent：下架原因
        lowerContent: ""
    },

    onLoad (options) {
        that = this;

        let lowerWareInfo = wx.getStorageSync('lowerWareInfo');
        
        that.setData({
            lowerWareId: options.lowerWareId,
            lowerWareInfo: lowerWareInfo
        })

        // 获取下架原因
        that.getLowerContent();
    },

    // 获取下架原因
    getLowerContent () {
        let openid = wx.getStorageSync('openid');
        let lowerWareId = that.data.lowerWareId;
        let data = {
            openid: openid,
            id: lowerWareId
        };
        
        app.request('goods/smallb_review', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        lowerContent: result.notice
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

})
