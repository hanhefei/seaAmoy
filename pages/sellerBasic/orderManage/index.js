//pages/sellerBasic/orderManage/index
const app = getApp();
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // optionList：选项列表
        optionList: ["全部", "待付款", "待发货", "待收货", "待评价", "退款", "交易完成"],
        // optionActive：选项选中值
        optionActive: 0,
        // orderList：订单列表
            // imgUrl：图片路径
            // text：商品描述
            // price：现价
            // num：数量
            // state：状态
        orderList: [
            {
                imgUrl: "/resources/imgs/storeImg.png",
                text: "旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375",
                price: 560,
                num: 1,
                state: 0
            },
            {
                imgUrl: "/resources/imgs/storeImg.png",
                text: "旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375",
                price: 560,
                num: 1,
                state: 1
            },
            {
                imgUrl: "/resources/imgs/storeImg.png",
                text: "旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375",
                price: 560,
                num: 1,
                state: 2
            },
            {
                imgUrl: "/resources/imgs/storeImg.png",
                text: "旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375",
                price: 560,
                num: 1,
                state: 3
            },
            {
                imgUrl: "/resources/imgs/storeImg.png",
                text: "旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375",
                price: 560,
                num: 1,
                state: 4
            },
            {
                imgUrl: "/resources/imgs/storeImg.png",
                text: "旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375旗舰店 卡西欧（CASIO）手表商务防水男士石英表MTP-1375",
                price: 560,
                num: 1,
                state: 5
            }
        ]
    },

    onLoad () {
        that = this;

        that.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },

    // 去发货
    goSendGood () {
        app.navigateTo('/pages/sellerBasic/orderManage/sendGood')
    },

    // 去退款
    goEditGood () {
        app.navigateTo('/pages/sellerBasic/orderManage/editGood')
    },

    // 去订单详情
    goOrderDetails () {
        app.navigateTo('/pages/sellerBasic/orderManage/orderDetails')
    },

    // 去订单评论
    goOrderComment () {
        app.navigateTo('/pages/sellerBasic/orderManage/orderComment')
    },

    // 去订单信息
    goOrderInfo () {
        app.navigateTo('/pages/sellerBasic/orderManage/orderInfo')
    }

})
