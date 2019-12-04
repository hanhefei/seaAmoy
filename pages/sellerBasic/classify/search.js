//pages/sellerBasic/classify/search
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // stateType：身份值
        stateType: "",
        // searchText：搜索内容
        searchText: "",
        // searchList：类型列表
        searchList: []
    },

    onLoad () {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');

        // stateType == 2 (大B)
        // stateType == 1 (小B)
        that.setData({
            isIphoneX: app.globalData.isIphoneX,
            stateType: stateType
        });
    },

    // 保存输入值
    saveInput (e) {
        let inputText = (e.detail.value).trim();

        that.setData({
            searchText: inputText
        });
    },

    // 获取大B搜索列表
    getManufactorSearchList () {
        let memberId = wx.getStorageSync('memberId');
        let searchText = that.data.searchText;
        let data = {
            member_id: memberId,
            keyword: searchText
        };

        if (searchText.length <= 0) {
            app.showToast('请输入搜索内容', 'none');

            return false;
        }
        
        app.request('goods/goods_type', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        searchList: result.data
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

    // 获取小B搜索列表
    getAgentSearchList () {
        let openid = wx.getStorageSync('openid');
        let searchText = that.data.searchText;
        let data = {
            openid: openid,
            keyword: searchText
        };

        if (searchText.length <= 0) {
            app.showToast('请输入搜索内容', 'none');

            return false;
        }
        
        app.request('goods/samll_type', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
                        searchList: result.data
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

    // 选择当前分类
    selectThisType (e) {
        let index = e.currentTarget.dataset.index;
        let searchList = that.data.searchList;

        wx.setStorageSync('classify', searchList[index]);

        app.navigateBack(2);
    },

    // 获取其他高度
    getOtherHeight () {
        let screenHeight = that.data.screenHeight;
        let newScreenHeight = 0;

        const query = wx.createSelectorQuery();

        query.select('.countryElement').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec((res) => {
            let otherHeight = res[0].top + res[0].height;
            
            newScreenHeight = screenHeight - otherHeight;
            
            that.setData({
                screenHeight: newScreenHeight
            });
        });
    }

})
