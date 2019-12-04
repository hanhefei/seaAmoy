//pages/sellerBasic/mySales/index
const app = getApp();
let that;

Page({

    data: {},

    onLoad () {
        that = this;
    },

    // 去提现
    goCarrySales () {
        app.navigateTo('/pages/sellerBasic/mySales/carrySales')
    }

})
