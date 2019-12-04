//pages/agent/couponManage/index
const app = getApp();
const util = app.globalData.util;
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // couponList：优惠券列表
        couponList: [],
        // couponPrice：优惠券金额
        couponPrice: "",
        // couponMoney：优惠券满足金额
        couponMoney: "",
        // nowDate：当天日期
        nowDate: "",
        // startDate：开始日期
        startDate: "",
        // endDate：结束日期
        endDate: ""
    },

    onLoad () {
        that = this;

        let date = new Date().getTime();
        let nowDate = util.formYearMonthDay(date);
        let startDate = util.formYearMonthDay(date + (1 * 24 * 60 * 60 * 1000));

        that.setData({
            isIphoneX: app.globalData.isIphoneX,
            nowDate: nowDate,
            startDate: startDate
        });

        // 获取优惠券列表
        that.getCouponList();
    },

    // 获取优惠券列表
    getCouponList () {
        let openid = wx.getStorageSync('openid');
        let data = {
            openid: openid
        };

        app.request('shop/coupon_list', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        couponList: result.data
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

    // 保存输入值
    saveInput (e) {
        let value = (e.detail.value).trim();
        let variable = e.currentTarget.dataset.variable;

        that.setData({
            [variable]: value
        });
    },

    // 改变结束时间
    changeEndDate (e) {
        let endDate = e.detail.value;

        that.setData({
            endDate: endDate
        });
    },

    // 发布优惠券
    publishCoupon () {
        let openid = wx.getStorageSync('openid');
        let couponPrice = that.data.couponPrice;
        let couponMoney = that.data.couponMoney;
        let nowDate = that.data.nowDate;
        let endDate = that.data.endDate;
        let data = {
            openid: openid,
            price: couponPrice,
            man_price: couponMoney,
            create_time: nowDate,
            end_time: endDate
        };

        if (!couponPrice) {
            app.showToast('请填写优惠金额', 'none');

            return false;
        } else if (!couponMoney) {
            app.showToast('请填写优惠卷使用条件', 'none');

            return false;
        } else if (!endDate) {
            app.showToast('请选择结束时间', 'none');

            return false;
        }

        app.request('shop/coupon_add', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast(result.msg, 'success');

                    that.setData({
                        couponPrice: "",
                        couponMoney: "",
                        endDate: ""
                    });

                    // 获取优惠券列表
                    that.getCouponList();
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 删除优惠券
    deleteCoupon (e) {
        let openid = wx.getStorageSync('openid');
        let couponId = e.currentTarget.dataset.couponId;
        let data = {
            openid: openid,
            id: couponId
        };
        
        app.request('shop/coupon_del', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast(result.msg, 'success');

                    // 获取优惠券列表
                    that.getCouponList();
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
