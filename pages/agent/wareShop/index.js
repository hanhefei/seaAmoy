//pages/agent/wareShop/index
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // storeInfo：店铺信息
        storeInfo: "",
        // classify：分类
        classify: "",
        // screenList：筛选列表
        screenList: [
            {
                text: '综合',
                type: 'sum',
                state: 0
            },
            {
                text: '价格',
                type: 'price',
                state: 0
            },
            {
                text: '销量',
                type: 'sales',
                state: 0
            },
            {
                text: '新品',
                type: 'news',
                state: 0
            },
            {
                text: '好评',
                type: 'comment',
                state: 0
            }
        ],
        // wareList：商品列表
        wareList: [],
        // current_page：当前页
        current_page: "",
        // last_page：最后页
        last_page: "",
        // allWareNum：全部商品数量
        allWareNum: "",
        // allSelect：全选
        allSelect: false,
        // showSuccessModel：显示发售成功
        showSuccessModel: false
    },

    onLoad () {
        that = this;

        let storeInfo = wx.getStorageSync('accountInfo');

        that.setData({
            isIphoneX: app.globalData.isIphoneX,
            storeInfo: storeInfo
        });
    },

    onShow () {
        let classify = wx.getStorageSync('classify');

        if (classify) {
            that.setData({
                classify: classify,
                allSelect: false
            });

            // 获取商品列表（有分类）
            that.getClassWareList();
        } else {
            that.setData({
                classify: "",
                allSelect: false
            });

            // 获取商品列表（无分类）
            that.getWareList();
        }
    },

    // 上拉触底
    onReachBottom () {
        let current_page = that.data.current_page;
        let last_page = that.data.last_page;
        let classify = that.data.classify;

        if (last_page > current_page) {
            let page = ++current_page;

            // 如果有分类，获取商品列表（无分类）
            // 如果没有分类，获取商品列表（有分类）
            classify ? that.getClassWareList(page) : that.getWareList(page);
        } else {
            that.setData({
                showNoMored: true
            });
        }
    },

    // 获取商品列表（无分类）
    getWareList (page, type) {
        let openid = wx.getStorageSync('openid');
        let screenList = that.data.screenList;
        let paging = page || 1;
        let screenType = type;
        let data;

        if (screenType) {
            let screenState;
            
            screenList.filter(element => {
                if (element.type == screenType) {
                    screenState = element.state;
                }
            });

            data = {
                openid: openid,
                page: paging,
                [screenType]: screenState
            };
        } else {
            data = {
                openid: openid,
                page: paging
            };
        }
        
        app.request('goods/bigb_goods', data, res => {
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

    // 获取商品列表（有分类）
    getClassWareList (page, type) {
        let openid = wx.getStorageSync('openid');
        let screenList = that.data.screenList;
        let classify = that.data.classify;
        let paging = page || 1;
        let screenType = type;
        let data;

        if (screenType) {
            let screenState;
            
            screenList.filter(element => {
                if (element.type == screenType) {
                    screenState = element.state;
                }
            });

            data = {
                openid: openid,
                cid: classify.id,
                page: paging,
                [screenType]: screenState
            };
        } else {
            data = {
                openid: openid,
                cid: classify.id,
                page: paging
            };
        }
        
        app.request('goods/bigb_goods', data, res => {
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
            last_page: last_page,
            allWareNum: result.data.total
        });
    },
    
    // 有分页
    hasPageHandle (result) {
        let allSelect = that.data.allSelect;
        let wareList = that.data.wareList;
        let record = result.data.data;
        let newRecord = wareList.concat(record);
        let current_page = result.data.current_page;
        let last_page = result.data.last_page;

        if (allSelect) {
            newRecord.filter(element => {
                element.checked = true;
            });
        }
        
        that.setData({
            wareList: newRecord,
            current_page: current_page,
            last_page: last_page
        });
    },

    // 改变筛选
    changeScreen (e) {
        let index = e.currentTarget.dataset.index;
        let classify = that.data.classify;
        let type = e.currentTarget.dataset.type;
        let screenList = that.data.screenList;
        let state = screenList[index].state;

        screenList.filter((element, eIndex) => {
            if (index != eIndex) {
                element.state = 0;
            }
        })

        if (state < 2) {
            screenList[index].state = ++state;

            if (classify) {
                // 获取商品列表（有分类）
                that.getClassWareList('', type);
            } else {
                // 获取商品列表（无分类）
                that.getWareList('', type);
            }
        } else {
            screenList[index].state = 0;

            if (classify) {
                // 获取商品列表（有分类）
                that.getClassWareList();
            } else {
                // 获取商品列表（无分类）
                that.getWareList();
            }
        }

        that.setData({
            screenList: screenList
        });
    },

    // 选择当前商品
    selectThis (e) {
        let index = e.currentTarget.dataset.index;
        let wareList = that.data.wareList;

        wareList.filter((element, eIndex) => {
            if (index == eIndex) {
                element.checked = !element.checked;
            }
        });

        let allSelect = wareList.some(element => {
            if (!element.checked) {
                return true;
            }
        });

        that.setData({
            wareList: wareList,
            allSelect: allSelect ? false : true
        });
    },

    // 改变全选状态
    changeAllSelect () {
        let allSelect = that.data.allSelect;
        let wareList = that.data.wareList;

        if (wareList.length > 0) {
            if (!allSelect) {
                wareList.filter(element => {
                    element.checked = true;
                });
            } else {
                wareList.filter(element => {
                    element.checked = false;
                });
            }
    
            that.setData({
                wareList: wareList,
                allSelect: !allSelect
            });
        }
    },

    // 去分类
    goClassify () {
        app.navigateTo('/pages/sellerBasic/classify/index');
    },

    // 发布选中的商品
    publishWare () {
        let openid = wx.getStorageSync('openid');;
        let wareList = that.data.wareList;
        let publishList = [];
        
        wareList. filter(element => {
            if (element.checked) {
                publishList.push(element.id);
            }
        });

        let data = {
            openid: openid,
            ids: publishList.join()
        };

        app.request('goods/small_goods', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    let newWareList = [];

                    for (let i in publishList) {
                        for (let j in wareList) {
                            if (publishList[i] === wareList[j].id) {
                                delete wareList[j];
                            }
                        }
                    }

                    wareList.filter(element => {
                        if (element != undefined) {
                            newWareList.push(element);
                        }
                    });

                    that.setData({
                        wareList: newWareList,
                        allSelect: false,
                        showSuccessModel: true
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

    // 去我的宝贝
    goMyWare () {
        app.redirectTo('/pages/agent/myWare/index');
    },

    // 隐藏提示
    hideSuccessMode () {
        that.setData({
            showSuccessModel: false
        });
    }

})
