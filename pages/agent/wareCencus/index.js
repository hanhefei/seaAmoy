//pages/agent/wareCencus/index
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // wareList：商品列表
        wareList: [],
        // current_page：当前页
        current_page: "",
        // last_page：最后页
        last_page: "",
        // searchText：搜索内容
        searchText: "",
        // showInputLabel：是否显示label
        showInputLabel: true,
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
        let openid = wx.getStorageSync('openid');
        let searchText = keyword || "";
        let paging = page || 1;
        let data = {
            openid: openid,
            keyword: searchText,
            page: paging
        };

        app.request('goods/samll_count', data, res => {
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
            allSales: result.sales
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

        if (searchText.length > 0) {
            // 获取商品统计列表数据
            that.getWareCencusList(searchText);
        } else {
            // 获取商品统计列表数据
            that.getWareCencusList();
        }
    }

})
