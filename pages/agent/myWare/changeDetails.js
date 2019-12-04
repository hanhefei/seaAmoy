//pages/agent/myWare/changeDetails
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // wareId：商品id
        wareId: "",
        // wareInfo：商品信息
        wareInfo: "",
        // wareSku：商品规格
        wareSku: ""
    },

    onLoad (options) {
        that = this;

        that.setData({
            isIphoneX: app.globalData.isIphoneX,
            wareId: options.wareId
        });

        // 获取商品信息
        that.getWareInfo();
    },

    // 获取商品信息
    getWareInfo () {
        let openid = wx.getStorageSync('openid');
        let wareId = that.data.wareId;
        let data = {
            openid: openid,
            id: wareId
        };
        
        app.request('goods/samll_open', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        wareInfo: result.data,
                        wareSku: result.sku 
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

    // 改变这个规格的价格
    changeThisSkuPrice (e) {
        let inputText = e.detail.value;
        let index = e.currentTarget.dataset.index;
        let wareSku = that.data.wareSku;

        wareSku[index].newPrice = inputText;

        that.setData({
            wareSku: wareSku
        });
    },

    // 确认修改
    editSku () {
        let openid = wx.getStorageSync('openid');;
        let wareId = that.data.wareId;
        let wareSku = that.data.wareSku;
        let editSku = wareSku.some(element => {
            return element.newPrice;
        });

        if (!editSku) {
            app.showToast('请修改后再进行操作', 'none');

            return false;
        } else {
            let data = {
                openid: openid,
                id: wareId,
                sku: JSON.stringify(wareSku)
            };
            
            app.request('goods/small_update', data, res => {
                console.log(res);

                if (res.code === 600) {
                    let result = res.data;

                    if (result.code === 200) {
                        app.showToast('修改成功', 'success');

                        app.navigateBack(1);
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
