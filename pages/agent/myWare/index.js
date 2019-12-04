//pages/agent/myWare/index
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // optionList：选项列表
        optionList: ["已上架", "已下架"],
        // optionActive：选项选中值
        optionActive: 0,
        // classify：分类
        classify: "",
        // wareList：商品列表
        wareList: [],
        // current_page：当前页
        current_page: "",
        // last_page：最后页
        last_page: "",
        // showDeleteModel：显示删除弹框
        showDeleteModel: false,
        // deleteWareId：删除商品的id
        deleteWareId: "",
        // showLowerModel：显示下架弹框
        showLowerModel: false,
        // lowerWareId：下架商品的id
        lowerWareId: "",
        // showNoMored：显示没有更多
        showNoMored: false
    },

    onLoad () {
        that = this;

        that.setData({
            isIphoneX: app.globalData.isIphoneX
        });
    },

    onShow () {
        if (wx.getStorageSync('lowerWareInfo')) {
            wx.removeStorageSync('lowerWareInfo');
        }

        let classify = wx.getStorageSync('classify');

        if (classify) {
            that.setData({
                classify: classify
            });

            // 获取小B的宝贝（有分类）
            that.getAgentClassifyWareList();
        } else {
            that.setData({
                classify: ""
            });

            // 获取小B的宝贝（无分类）
            that.getAgentWareList();
        }
    },

    // 上拉触底
    onReachBottom () {
        let current_page = that.data.current_page;
        let last_page = that.data.last_page;
        let classify = that.data.classify;

        if (last_page > current_page) {
            let page = ++current_page;

            // 如果有分类，获取小B的宝贝（有分类）
            // 如果没有分类，获取小B的宝贝（无分类）
            classify ? that.getAgentClassifyWareList(page) : that.getAgentWareList(page);
        } else {
            that.setData({
                showNoMored: true
            });
        }
    },

    // 获取小B的宝贝（无分类）
    getAgentWareList (page) {
        let openid = wx.getStorageSync('openid');
        let optionActive = that.data.optionActive;
        let paging = page || 1;
        let status;

        if (optionActive == 0) {
            status = 2;
        } else {
            status = 1;
        }

        let data = {
            openid: openid,
            status: status,
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

    // 获取小B的宝贝（有分类）
    getAgentClassifyWareList (page) {
        let openid = wx.getStorageSync('openid');
        let optionActive = that.data.optionActive;
        let classify = that.data.classify;
        let paging = page || 1;
        let status;

        if (optionActive == 0) {
            status = 2;
        } else {
            status = 1;
        }

        let data = {
            openid: openid,
            status: status,
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

    // 改变选中
    changeOptions (e) {
        let index = e.currentTarget.dataset.index;
        let optionActive = that.data.optionActive;
        let classify = that.data.classify;
    
        if (index != optionActive) {
            that.setData({
                optionActive: index,
                showNoMored: false
            });

            if (classify) {
                // 获取小B的宝贝（有分类）
                that.getAgentClassifyWareList();
            } else {
                // 获取小B的宝贝（无分类）
                that.getAgentWareList();
            }
        }
    },

    // 显示删除弹框
    showDeleteModel (e) {
        let wareId = e.currentTarget.dataset.wareId;

        that.setData({
            showDeleteModel: true,
            deleteWareId: wareId
        });
    },

    // 隐藏删除弹框
    hideDeleteModel () {
        that.setData({
            showDeleteModel: false,
            deleteWareId: ""
        });
    },

    // 删除操作
    deleteHandle () {
        let openid = wx.getStorageSync('openid');
        let deleteWareId = that.data.deleteWareId;
        let data = {
            openid: openid,
            id: deleteWareId
        };

        app.request('goods/small_del', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast(result.msg, 'success');

                    let wareList = that.data.wareList;
                    let deleteWareIndex = "";

                    wareList.filter((element, eIndex) => {
                        if (element.id == deleteWareId) {
                            deleteWareIndex = eIndex;
                        }
                    });

                    wareList.splice(deleteWareIndex, 1);

                    that.setData({
                        wareList: wareList,
                        showDeleteModel: false,
                        deleteWareId: ""
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

    // 显示下架弹框
    showLowerModel (e) {
        let wareId = e.currentTarget.dataset.wareId;

        that.setData({
            showLowerModel: true,
            lowerWareId: wareId
        });
    },

    // 隐藏下架弹框
    hideLowerModel () {
        that.setData({
            showLowerModel: false,
            lowerWareId: ""
        });
    },

    // 下架操作
    lowerHandle () {
        let openid = wx.getStorageSync('openid');
        let lowerWareId = that.data.lowerWareId;
        let data = {
            openid: openid,
            id: lowerWareId,
            is_top: 2
        };

        app.request('goods/samll_status', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast('下架成功', 'success');
                    
                    let wareList = that.data.wareList;
                    let lowerWareIndex = "";

                    wareList.filter((element, eIndex) => {
                        if (element.id == lowerWareId) {
                            lowerWareIndex = eIndex;
                        }
                    });

                    wareList.splice(lowerWareIndex, 1);

                    that.setData({
                        wareList: wareList,
                        showLowerModel: false,
                        lowerWareId: ""
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

    // 上架操作
    updateHandle (e) {
        let openid = wx.getStorageSync('openid');
        let updateWareId = e.currentTarget.dataset.wareId;
        let data = {
            openid: openid,
            id: updateWareId,
            is_top: 1
        };

        app.request('goods/samll_status', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast('上架成功', 'success');

                    let wareList = that.data.wareList;
                    let updateWareIndex = "";

                    wareList.filter((element, eIndex) => {
                        if (element.id == updateWareId) {
                            updateWareIndex = eIndex;
                        }
                    });

                    wareList.splice(updateWareIndex, 1);

                    that.setData({
                        wareList: wareList
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

    // 去分类
    goClassify () {
        app.navigateTo('/pages/sellerBasic/classify/index');
    },
    
    // 去修改详情
    goChangeDetails (e) {
        let wareId = e.currentTarget.dataset.wareId;

        app.navigateTo('/pages/agent/myWare/changeDetails?wareId=' + wareId);
    },

    // 去下架详情
    goLowerDetails (e) {
        let lowerWareId = e.currentTarget.dataset.wareId;
        let wareList = that.data.wareList;

        wareList.filter((element) => {
            if (element.id == lowerWareId) {
                wx.setStorageSync('lowerWareInfo', element);
            }
        });

        app.navigateTo('/pages/agent/myWare/lowerDetails?lowerWareId=' + lowerWareId);
    }

})
