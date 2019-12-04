//pages/manufactor/wareCencus/details
const app = getApp();
let that;

Page({

    data: {
        // screenHeight：屏幕可视高度
        screenHeight: 0,
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // wareList：商品列表
        wareList: [],
        // agentList：代理商列表
        agentList: [],
        // current_page：当前页
        current_page: "",
        // last_page：最后页
        last_page: "",
        // where：从哪个选项进来的
        where: "",
        // wareInfo：商品详情
        wareInfo: "",
        // agentInfo：代理商详情
        agentInfo: "",
        // searchText：搜索内容
        searchText: "",
        // showInputLabel：是否显示label
        showInputLabel: true,
        // showNoMored：显示没有更多
        showNoMored: false
    },

    onLoad (options) {
        that = this;

        if (options.where == 'wareDetails') {
            let wareInfo = wx.getStorageSync('wareInfo');
              
            that.setData({
                isIphoneX: app.globalData.isIphoneX,
                screenHeight: app.globalData.system.windowHeight,
                where: options.where,
                id: options.id,
                wareInfo: wareInfo
            });
        } else {
            let agentInfo = wx.getStorageSync('agentInfo');

            that.setData({
                isIphoneX: app.globalData.isIphoneX,
                screenHeight: app.globalData.system.windowHeight,
                where: options.where,
                id: options.id,
                agentInfo: agentInfo
            });
        }

    },

    onShow () {
        let where = that.data.where;

        if (where == 'wareDetails') {
            // 获取商品详情
            that.getWareDetails();
        } else {
            // 获取代理商详情
            that.getAgentDetails();
        }

        // 获取其他高度
        that.getOtherHeight();
    },

    // 上拉触底
    onReachBottom () {
        let current_page = that.data.current_page;
        let last_page = that.data.last_page;

        if (last_page > current_page) {
            let page = ++current_page;

            if (searchText.length > 0) {
                if (where == 'wareDetails') {
                    // 获取商品详情
                    that.getWareDetails(searchText, page);
                } else {
                    // 获取代理商详情
                    that.getAgentDetails(searchText, page);
                }
            } else {
                if (where == 'wareDetails') {
                    // 获取商品详情
                    that.getWareDetails('', page);
                } else {
                    // 获取代理商详情
                    that.getAgentDetails('', page);
                }
            }
        } else {
            that.setData({
                showNoMored: true
            });
        }
    },

    // 获取商品详情
    getWareDetails (keyword, page) {
        let memberId = wx.getStorageSync('memberId');
        let type = 2;
        let id = that.data.id;
        let searchText = keyword || "";
        let paging = page || 1;
        let data = {
            member_id: memberId,
            type: type,
            id: id,
            keyword: searchText,
            page: paging
        };
        
        app.request('goods/bigdetail', data, res => {
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

    // 获取代理商详情
    getAgentDetails (keyword, page) {
        let memberId = wx.getStorageSync('memberId');
        let type = 1;
        let id = that.data.id;
        let searchText = keyword || "";
        let paging = page || 1;
        let data = {
            member_id: memberId,
            type: type,
            id: id,
            keyword: searchText,
            page: paging
        };

        app.request('goods/bigdetail', data, res => {
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
        let where = that.data.where;

        if (where == 'wareDetails') {
            let record = result.data.data;
            let current_page = result.data.current_page;
            let last_page = result.data.last_page;
    
            that.setData({
                agentList: record,
                current_page: current_page,
                last_page: last_page
            });
        } else {
            let record = result.data.data;
            let current_page = result.data.current_page;
            let last_page = result.data.last_page;
    
            that.setData({
                wareList: record,
                current_page: current_page,
                last_page: last_page
            });
        }
    },
    
    // 有分页
    hasPageHandle (result) {
        let where = that.data.where;

        if (where == 'wareDetails') {
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
        } else {
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
        let where = that.data.where;

        if (searchText.length > 0) {
            if (where == 'wareDetails') {
                // 获取商品详情
                that.getWareDetails(searchText);
            } else {
                // 获取代理商详情
                that.getAgentDetails(searchText);
            }
        } else {
            if (where == 'wareDetails') {
                // 获取商品详情
                that.getWareDetails();
            } else {
                // 获取代理商详情
                that.getAgentDetails();
            }
        }
    },
    
    // 获取其他高度
    getOtherHeight () {
        let screenHeight = that.data.screenHeight;
        let newScreenHeight = 0;

        const query = wx.createSelectorQuery();

        that.time = setTimeout (() => {
            query.select('.agentListElement').boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec((res) => {
                let otherHeight = res[0].top;
                
                newScreenHeight = screenHeight - otherHeight;
                
                that.setData({
                    screenHeight: newScreenHeight
                });

                clearTimeout(that.time);
            });
        }, 1500);
    }

})
