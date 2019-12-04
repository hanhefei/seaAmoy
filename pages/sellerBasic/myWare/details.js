//pages/sellerBasic/myWare/details
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // wareId：商品id
        wareId: "",
        // wareInfo：商品详情
        wareInfo: "",
        // carousel：轮播图
        carousel: [],
        // commentStarsNum：评分数
        commentStarsNum: 4,
        // skuIndex：规格索引
        skuIndex: "",
        // skuPrice：规格价格
        skuPrice: "",
        // skuModel：规格模块
        skuModel: false,
        // commentList：评价列表
        commentList: []
    },

    onLoad (options) {
        that = this;

        that.setData({
            isIphoneX: app.globalData.isIphoneX,
            wareId: options.wareId
        });

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');

        if (stateType == 2) {
            // 获取大B商品详情
            that.getManufactorWareDetails();
        } else {
            // 获取小B商品详情
            that.getAgentWareDetails();
        }
        
    },

    // 获取大B商品详情
    getManufactorWareDetails () {
        let memberId = wx.getStorageSync('memberId');
        let wareId = that.data.wareId;
        let data = {
            member_id: memberId,
            id: wareId
        };

        app.request('goods/goods_detail', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        wareInfo: result.data,
                        carousel: result.data.images,
                        commentList: result.data.review
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

    // 获取小B商品详情
    getAgentWareDetails () {
        let openid = wx.getStorageSync('openid');
        let wareId = that.data.wareId;
        let data = {
            openid: openid,
            id: wareId
        };
        
        app.request('goods/samll_detail', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        wareInfo: result.data,
                        carousel: result.data.images,
                        commentList: result.data.review
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
    
    // 显示规格模块
    showSkuModel () {
        that.setData({
            skuModel: true
        });
    },
    
    // 隐藏规格模块
    hideSkuModel () {
        that.setData({
            skuModel: false
        });
    },

    // 阻止隐藏
    noHide () {
        return false;
    },

    // 选择规格
    chagneSkuIndex (e) {
        let index = e.currentTarget.dataset.index;
        let skuIndex = that.data.skuIndex;
        let skuList = that.data.wareInfo.sku;

        if (index === skuIndex) {
            that.setData({
                skuIndex: "",
                skuPrice: ""
            })
        } else {
            that.setData({
                skuIndex: index,
                skuPrice: skuList[index].price
            })
        }
    },

    // 去评价
    goAllComment () {
        let wareId = that.data.wareId;

        app.navigateTo('/pages/sellerBasic/myWare/allComment?wareId=' + wareId);
    }

})
