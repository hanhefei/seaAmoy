//pages/sellerBasic/myWare/allComment
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // stateType：身份值
        stateType: "",
        // wareId：商品id
        wareId: "",
        // commentList：评价列表
        commentList: [
            {
                imgUrl: "/resources/imgs/storeImg.png",
                name: "阿茶与阿谷(卡西欧代理商)",
                content: "手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单"
            },
            {
                imgUrl: "/resources/imgs/storeImg.png",
                name: "阿茶与阿谷(卡西欧代理商)",
                content: "手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单"
            },
            {
                imgUrl: "/resources/imgs/storeImg.png",
                name: "阿茶与阿谷(卡西欧代理商)",
                content: "手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单"
            },
            {
                imgUrl: "/resources/imgs/storeImg.png",
                name: "阿茶与阿谷(卡西欧代理商)",
                content: "手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单"
            },
            {
                imgUrl: "/resources/imgs/storeImg.png",
                name: "阿茶与阿谷(卡西欧代理商)",
                content: "手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单手表很好看，有正规的缴税单，已经打包好准备送给男朋友了，好评！！手表很好看，有正规的缴税单"
            }
        ]
    },

    onLoad (options) {
        that = this;

        // 获取身份值
        let stateType = wx.getStorageSync('stateType');

        that.setData({
            isIphoneX: app.globalData.isIphoneX,
            stateType: stateType,
            wareId: options.wareId
        });

        // 获取所有评论列表
        that.getCommentList();
    },

    // 获取所有评论列表
    getCommentList () {
        let stateType = that.data.stateType;
        let wareId = that.data.wareId;
        let data = {
            id: wareId,
            type: stateType
        };

        app.request('goods/review', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    that.setData({
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
    }

})
