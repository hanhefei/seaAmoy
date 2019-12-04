// pages/sellerBasic/msgNotify/index
const app = getApp();
let WxParse = require('../../../wxParse/wxParse.js');
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // notifyList：通知列表
        notifyList: []
    },

    onLoad: function () {
        that = this;

        that.setData({
            isIphoneX: app.globalData.isIphoneX
        });

        // 获取通知列表
        that.getNotifyList();
    },

    // 获取通知列表
    getNotifyList () {
        app.request('shop/terrace', {}, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    let notifyList = result.data;

                    for (let i = 0; i < notifyList.length; i++) {
                        WxParse.wxParse('article' + i, 'html', notifyList[i].content, that);

                        if (i === notifyList.length - 1) {
                          WxParse.wxParseTemArray("articleList", 'article', notifyList.length, that);
                        }
                    }

                    that.setData({
                        notifyList: result.data
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
