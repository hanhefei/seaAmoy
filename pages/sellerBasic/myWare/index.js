//pages/sellerBasic/myWare/index
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // classify：分类
        classify: "",
        // wareList：商品列表
        wareList: [],
        // current_page：当前页
        current_page: "",
        // last_page：最后页
        last_page: "",
        // showNoMored：显示没有更多
        showNoMored: false
    },

    onLoad () {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');

        that.setData({
            isIphoneX: app.globalData.isIphoneX,
            stateType: stateType
        });
    },

    onShow () {
        if (wx.getStorageSync('editWare')) {
            wx.removeStorageSync('editWare');
        }
        
        // 获取身份值
        let stateType = that.data.stateType;
        let classify = wx.getStorageSync('classify');

        if (classify) {
            that.setData({
                classify: classify
            });

            if (stateType == 2) {
                // 获取大B的商品（有分类）
                that.getManufactorClassifyWareList();
            } else {
                // 获取小B的商品（有分类）
                that.getAgentClassifyWareList();
            }
        } else {
            that.setData({
                classify: ""
            });

            if (stateType == 2) {
                // 获取大B的商品（无分类）
                that.getManufactorWareList();
            } else {
                // 获取小B的商品（无分类）
                that.getAgentWareList();
            }
        }
    },

    // 上拉触底
    onReachBottom () {
        let stateType = that.data.stateType;
        let current_page = that.data.current_page;
        let last_page = that.data.last_page;
        let classify = that.data.classify;

        if (last_page > current_page) {
            let page = ++current_page;

            // stateType == 2 (大B)
            // stateType == 1 (小B)
            if (stateType == 2) {
                // 获取大B的商品（有分类）
                // 获取大B的商品（无分类）
                classify ? that.getManufactorClassifyWareList(page) : that.getManufactorWareList(page);
            } else {
                // 获取小B的商品（有分类）
                // 获取小B的商品（无分类）
                classify ? that.getAgentClassifyWareList(page) : that.getAgentWareList(page);
            }
        } else {
            that.setData({
                showNoMored: true
            });
        }
    },

    // 获取大B的商品（无分类）
    getManufactorWareList (page) {
        let memberId = wx.getStorageSync('memberId');
        let paging = page || 1;

        let data = {
            member_id: memberId,
            page: paging
        };

        app.request('Goods/big_list', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    if (paging == 1) {
                        // 没有分页
                        that.noPageHandle(result);
                    } else {
                        // 有分页
                        that.hasPageHandle(result);
                    }
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 获取大B的商品（有分类）
    getManufactorClassifyWareList (page) {
        let memberId = wx.getStorageSync('memberId');
        let classify = that.data.classify;
        let paging = page || 1;

        let data = {
            member_id: memberId,
            cid: classify.id,
            page: paging
        };

        app.request('Goods/big_list', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    if (paging == 1) {
                        // 没有分页
                        that.noPageHandle(result);
                    } else {
                        // 有分页
                        that.hasPageHandle(result);
                    }
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 获取小B的商品（无分类）
    getAgentWareList (page) {
        let openid = wx.getStorageSync('openid');
        let paging = page || 1;

        let data = {
            openid: openid,
            page: paging
        };

        app.request('goods/small_baby', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    if (paging == 1) {
                        // 没有分页
                        that.noPageHandle(result);
                    } else {
                        // 有分页
                        that.hasPageHandle(result);
                    }
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 获取小B的商品（有分类）
    getAgentClassifyWareList (page) {
        let openid = wx.getStorageSync('openid');
        let classify = that.data.classify;
        let paging = page || 1;

        let data = {
            openid: openid,
            cid: classify.id,
            page: paging
        };
        
        app.request('goods/small_baby', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    if (paging == 1) {
                        // 没有分页
                        that.noPageHandle(result);
                    } else {
                        // 有分页
                        that.hasPageHandle(result);
                    }
                } else {
                    app.showToast(result.msg, 'none');
                }
            } else {
                app.showToast(res.msg, 'none');
            }

            app.hideLoading();
        });
    },

    // 没有分页
    noPageHandle (result) {
        let record = result.data.data;
        let current_page = result.data.current_page;
        let last_page = result.data.last_page;

        that.setData({
            wareList: record,
            current_page: current_page,
            last_page: last_page
        });
    },
    
    // 有分页
    hasPageHandle (result) {
        let wareList = that.data.wareList;
        let record = result.data.data;
        let newRecord = wareList.concat(record);
        let current_page = result.data.current_page;
        let last_page = result.data.last_page;
        
        that.setData({
            wareList: newRecord,
            current_page: current_page,
            last_page: last_page
        });
    },

    // 去分类
    goClassify () {
        app.navigateTo('/pages/sellerBasic/classify/index');
    },

    // 去商品详情
    goDetails (e) {
        let wareId = e.currentTarget.dataset.wareId;

        app.navigateTo('/pages/sellerBasic/myWare/details?wareId=' + wareId);
    },

    // 去发布页面编辑
    goPublish (e) {
        let wareId = e.currentTarget.dataset.wareId;

        app.navigateTo('/pages/manufactor/publish/index?where=myWare&wareId=' + wareId);
    },

    // 去修改页面改价
    goChangeDetails (e) {
        let wareId = e.currentTarget.dataset.wareId;

        app.navigateTo('/pages/agent/myWare/changeDetails?wareId=' + wareId);
    }

})
