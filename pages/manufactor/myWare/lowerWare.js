//pages/manufactor/myWare/lowerWare
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
        });

        // 获取下架原因
        that.getLowerContent();
    },

    // 获取下架原因
    getLowerContent () {
        let memberId = wx.getStorageSync('memberId');
        let lowerWareId = that.data.lowerWareId;
        let data = {
            member_id: memberId,
            id: lowerWareId
        };
        
        app.request('goods/bigb_review', data, res => {
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
