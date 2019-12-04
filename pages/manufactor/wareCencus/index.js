//pages/manufactor/wareCencus/index
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // optionActive：选项选中值
        optionActive: 0,
        // searchText：搜索内容
        searchText: "",
        // showInputLabel：是否显示label
        showInputLabel: true,
        // wareList：商品列表
        wareList: [],
        // agentList：代理商列表
        agentList: [],
        // current_page：当前页
        current_page: "",
        // last_page：最后页
        last_page: "",
        // allSales：累计总销量
        allSales: "",
        // showNoMored：显示没有更多
        showNoMored: false
    },

    onLoad () {
        that = this;

        that.setData({
            isIphoneX: app.globalData.isIphoneX
        });

        // 获取商品统计列表数据
        that.getWareCencusList();
    },

    onShow () {
        if (wx.getStorageSync('wareInfo')) {
            wx.removeStorageSync('wareInfo');
        }

        if (wx.getStorageSync('agentInfo')) {
            wx.removeStorageSync('agentInfo');
        }
    },

    // 上拉触底
    onReachBottom () {
        let current_page = that.data.current_page;
        let last_page = that.data.last_page;
        let optionActive = that.data.optionActive;

        if (last_page > current_page) {
            let page = ++current_page;

            if (searchText.length > 0) {
                if (optionActive == 0) {
                    // 获取商品统计列表数据
                    that.getWareCencusList(searchText, page);
                } else {
                    // 获取代理商统计列表
                    that.getAgentCencusList(searchText, page);
                }
            } else {
                if (optionActive == 0) {
                    // 获取商品统计列表数据
                    that.getWareCencusList('', page);
                } else {
                    // 获取代理商统计列表
                    that.getAgentCencusList('', page);
                }
            }
        } else {
            that.setData({
                showNoMored: true
            });
        }
    },

    // 获取商品统计列表
    getWareCencusList (keyword, page) {
        let memberId = wx.getStorageSync('memberId');
        let state = 2;
        let searchText = keyword || "";
        let paging = page || 1;
        let data = {
            member_id: memberId,
            type: state,
            keyword: searchText,
            page: paging
        };
        
        app.request('goods/bigcount', data, res => {
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

    // 获取代理商统计列表
    getAgentCencusList (page) {
        let memberId = wx.getStorageSync('memberId');
        let state = 1;
        let paging = page || 1;
        let data = {
            member_id: memberId,
            type: state,
            page: paging
        };

        app.request('goods/bigcount', data, res => {
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
        let optionActive = that.data.optionActive;

        if (optionActive == 0) {
            let record = result.data.data;
            let current_page = result.data.current_page;
            let last_page = result.data.last_page;
    
            that.setData({
                wareList: record,
                current_page: current_page,
                last_page: last_page,
                allSales: result.sales
            });
        } else {
            let record = result.data.data;
            let current_page = result.data.current_page;
            let last_page = result.data.last_page;
    
            that.setData({
                agentList: record,
                current_page: current_page,
                last_page: last_page,
                allSales: result.sales
            });
        }
    },
    
    // 有分页
    hasPageHandle (result) {
        let optionActive = that.data.optionActive;

        if (optionActive == 0) {
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
        } else {
            let agentList = that.data.agentList;
            let record = result.data.data;
            let newRecord = agentList.concat(record);
            let current_page = result.data.current_page;
            let last_page = result.data.last_page;
            
            that.setData({
                agentList: newRecord,
                current_page: current_page,
                last_page: last_page
            });
        }
    },

    // 改变选项
    changeOptions (e) {
        let index = e.currentTarget.dataset.index;
        let optionActive = that.data.optionActive;

        if (index != optionActive) {
            that.setData({
                optionActive: index,
                showInputLabel: true,
                showNoMored: false,
                searchText: ""
            });

            if (index == 0) {
                // 获取商品统计列表数据
                that.getWareCencusList();
            } else {
                // 获取代理商统计列表
                that.getAgentCencusList();
            }
        }
    },

    // 获取焦点
    getFocus () {
        that.setData({
            showInputLabel: false
        });
    },

    // 失去焦点
    getBlur () {
        let searchText = that.data.searchText;

        that.setData({
            showInputLabel: searchText.length > 0 ? false : true
        });
    },

    // 保存输入值
    saveInput (e) {
        let inputText = (e.detail.value).trim();

        that.setData({
            searchText: inputText
        });
    },

    // 搜索
    search () {
        let searchText = that.data.searchText;
        let optionActive = that.data.optionActive;

        that.setData({
            showNoMored: false
        });

        if (searchText.length > 0) {
            if (optionActive == 0) {
                // 获取商品统计列表数据
                that.getWareCencusList(searchText);
            } else {
                // 获取代理商统计列表
                that.getAgentCencusList();
            }
        } else {
            if (optionActive == 0) {
                // 获取商品统计列表数据
                that.getWareCencusList();
            } else {
                // 获取代理商统计列表
                that.getAgentCencusList();
            }
        }
    },

    // 去代理商详情
    goOrderDetails (e) {
        let id = e.currentTarget.dataset.id;
        let where = e.currentTarget.dataset.where;

        if (where == 'wareDetails') {
            let wareList = that.data.wareList;
            let wareInfo;

            wareList.filter((element) => {
                if (element.id == id) {
                    wareInfo = element;
                }
            });

            wx.setStorageSync('wareInfo', wareInfo);
        } else {
            let agentList = that.data.agentList;
            let agentInfo;

            agentList.filter((element) => {
                if (element.user_id == id) {
                    agentInfo = element;
                }
            });

            wx.setStorageSync('agentInfo', agentInfo);
        }

        app.navigateTo('/pages/manufactor/wareCencus/details?where=' + where + '&id=' + id);
    }

})
