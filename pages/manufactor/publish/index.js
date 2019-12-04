//pages/manufactor/publish/index
const app = getApp();
const util = app.globalData.util;
const tabbar = require("../../../utils/tabbar.js");
let that;

Page({

    data: {
        // isIphoneX：是否是苹果x
        isIphoneX: false,
        // tabbarList：底部导航栏
        tabbarList: [],
        // tabbarIndex：当前底部导航栏索引
        tabbarIndex: "",
        // where：从哪来到当前页面
        where: "",
        // wareId：编辑的商品id
        wareId: "",
        // editWareInfo：编辑的商品信息
        editWareInfo: "",
        // wareTitle：商品标题
        wareTitle: "",
        // wareDescribe：商品描述
        wareDescribe: "",
        // classify：分类
        classify: "",
        // warePrice：商品价格
        warePrice: "",
        // wareFreight：商品运费
        wareFreight: "",
        // wareTaxation：商品税费
        wareTaxation: "",
        // wareStock：商品库存
        wareStock: "",
        // wareSku：商品属性
        wareSku: [],
        // warePoster：商品封面图
        warePoster: "",
        // wareCarousel：商品轮播图
        wareCarousel: [],
        // wareDescImg：商品详情图
        wareDescImg: []
    },

    onLoad(options) {
        that = this;

        let classify = wx.getStorageSync('classify');

        if (classify) {
            wx.removeStorageSync('classify');
        }

        // 如果从别的地方跳转过来，则不显示tabbarList
        if (options.where) {
            wx.setNavigationBarTitle({
                title: '修改'
            });

            that.setData({
                where: options.where,
                isIphoneX: app.globalData.isIphoneX,
                wareId: options.wareId
            });

            // 获取修改商品信息
            that.getEditWareInfo();
        } else {
            // 设置底部导航栏索引
            wx.setStorageSync('tabbarIndex', 1);

            var tabbarList = tabbar.manufactor();

            that.setData({
                tabbarList: tabbarList,
                isIphoneX: app.globalData.isIphoneX,
                tabbarIndex: 1
            });
        }
    },

    onShow() {
        let classify = wx.getStorageSync('classify');

        if (classify) {
            that.setData({
                classify: classify
            });
        }
    },

    // 获取修改商品信息
    getEditWareInfo() {
        let memberId = wx.getStorageSync('memberId');
        let wareId = that.data.wareId;
        let data = {
            member_id: memberId,
            id: wareId
        };

        app.request('goods/goods_detail', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    let wareObj = result.data;
                    let classify = {
                        id: wareObj.cid,
                        name: wareObj.type_name
                    };

                    that.setData({
                        editWareInfo: wareObj,
                        wareTitle: wareObj.title,
                        wareDescribe: wareObj.introduction,
                        classify: classify,
                        warePrice: wareObj.supplier,
                        wareFreight: wareObj.freight,
                        wareTaxation: wareObj.taxes,
                        wareStock: wareObj.inventory,
                        wareSku: wareObj.sku,
                        warePoster: wareObj.thumb,
                        wareCarousel: wareObj.images,
                        wareDescImg: wareObj.photo
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

    // 保存输入值
    saveInput(e) {
        let variable = e.currentTarget.dataset.variable;
        let inputText = (e.detail.value).trim();

        that.setData({
            [variable]: inputText
        });
    },

    // 去分类
    goClassify() {
        app.navigateTo('/pages/sellerBasic/classify/index');
    },

    // 添加商品规格
    addWareSku() {
        let wareSku = that.data.wareSku;
        let sku = {
            name: "",
            price: ""
        };

        wareSku.push(sku);

        that.setData({
            wareSku: wareSku
        });
    },

    // 保存规格输入信息
    saveSkuInput(e) {
        let index = e.currentTarget.dataset.index;
        let variable = e.currentTarget.dataset.variable;
        let inputText = (e.detail.value).trim();
        let wareSku = that.data.wareSku;

        if (variable == 'name') {
            wareSku[index].name = inputText;
        } else {
            wareSku[index].price = inputText;
        }

        that.setData({
            wareSku: wareSku
        });
    },

    // 删除当前规格
    delThisSku(e) {
        let index = e.currentTarget.dataset.index;
        let wareSku = that.data.wareSku;

        wareSku.splice(index, 1);

        that.setData({
            wareSku: wareSku
        });
    },

    // 上传图片
    updateImg(e) {
        let variable = e.currentTarget.dataset.variable;

        if (variable == 'warePoster') {
            util.updateImg(1, (imgArr) => {
                that.setData({
                    [variable]: imgArr[0]
                });

                app.hideLoading();
            });
        } else if (variable == 'wareCarousel') {
            let wareCarousel = that.data.wareCarousel;
            let num = 3 - wareCarousel.length;
            util.updateImg(num, (imgArr) => {
                imgArr.filter((element) => {
                    wareCarousel.push(element);
                });

                that.setData({
                    [variable]: wareCarousel
                });

                app.hideLoading();
            });
        } else {
            let wareDescImg = that.data.wareDescImg;
            let num = 3 - wareDescImg.length;
            util.updateImg(num, (imgArr) => {
                imgArr.filter((element) => {
                    wareDescImg.push(element);
                });

                that.setData({
                    [variable]: wareDescImg
                });

                app.hideLoading();
            });
        }
    },

    // 删除图片
    deleteThisImg(e) {
        let variable = e.currentTarget.dataset.variable;

        if (variable == 'warePoster') {
            that.setData({
                warePoster: ""
            });
        } else if (variable == 'wareCarousel') {
            let index = e.currentTarget.dataset.index;
            let wareCarousel = that.data.wareCarousel;

            wareCarousel.splice(index, 1);

            that.setData({
                wareCarousel: wareCarousel
            });
        } else {
            let index = e.currentTarget.dataset.index;
            let wareDescImg = that.data.wareDescImg;

            wareDescImg.splice(index, 1);

            that.setData({
                wareDescImg: wareDescImg
            });
        }
    },

    // 发布商品
    publishWare(e) {
        let memberId = wx.getStorageSync('memberId');
        let state = e.currentTarget.dataset.state;
        let wareTitle = that.data.wareTitle;
        let wareDescribe = that.data.wareDescribe;
        let classify = that.data.classify;
        let warePrice = that.data.warePrice;
        let wareFreight = that.data.wareFreight;
        let wareTaxation = that.data.wareTaxation;
        let wareStock = that.data.wareStock;
        let wareSku = that.data.wareSku;
        let warePoster = that.data.warePoster;
        let wareCarousel = that.data.wareCarousel;
        let wareDescImg = that.data.wareDescImg;

        if (!wareTitle) {
            app.showToast('请填写商品标题', 'none');

            return false;
        } else if (!wareDescribe) {
            app.showToast('请填写商品描述', 'none');

            return false;
        } else if (!classify) {
            app.showToast('请选择商品分类', 'none');

            return false;
        } else if (!warePrice) {
            app.showToast('请填写商品价格', 'none');

            return false;
        } else if (!wareFreight) {
            app.showToast('请填写商品运费', 'none');

            return false;
        } else if (!wareTaxation) {
            app.showToast('请填写商品税费', 'none');

            return false;
        } else if (!wareStock) {
            app.showToast('请填写商品商品库存', 'none');

            return false;
        } else if (wareSku.length <= 0) {
            app.showToast('请填加商品规格', 'none');

            return false;
        } else if (!warePoster) {
            app.showToast('请填加商品封面图', 'none');

            return false;
        } else if (wareCarousel.length <= 0) {
            app.showToast('请填加商品详情轮播图', 'none');

            return false;
        } else if (wareDescImg.length <= 0) {
            app.showToast('请填加商品详情图', 'none');

            return false;
        }

        let data = {
            member_id: memberId,
            cid: classify.id,
            title: wareTitle,
            introduction: wareDescribe,
            supplier: warePrice,
            freight: wareFreight,
            inventory: wareStock,
            taxes: wareTaxation,
            thumb: warePoster,
            images: JSON.stringify(wareCarousel),
            photo: JSON.stringify(wareDescImg),
            is_top: state,
            sku: JSON.stringify(wareSku)
        };

        app.request('goods/goods_add', data, res => {
            console.log(res);

            if (res.code === 600) {
                let result = res.data;

                if (result.code === 200) {
                    app.showToast("发布成功", 'success');

                    that.setData({
                        wareTitle: "",
                        wareDescribe: "",
                        classify: "",
                        warePrice: "",
                        wareFreight: "",
                        wareTaxation: "",
                        wareStock: "",
                        wareSku: [],
                        warePoster: "",
                        wareCarousel: [],
                        wareDescImg: []
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

    // 修改商品
    editWare() {
        let memberId = wx.getStorageSync('memberId');
        let editWareInfo = that.data.editWareInfo;
        let wareId = that.data.wareId;
        let wareTitle = that.data.wareTitle;
        let wareDescribe = that.data.wareDescribe;
        let classify = that.data.classify;
        let warePrice = that.data.warePrice;
        let wareFreight = that.data.wareFreight;
        let wareTaxation = that.data.wareTaxation;
        let wareStock = that.data.wareStock;
        let wareSku = that.data.wareSku;
        let warePoster = that.data.warePoster;
        let wareCarousel = that.data.wareCarousel;
        let wareDescImg = that.data.wareDescImg;
        let noWaitClassify;
        let noWaitSku;
        let noWaitCarousel;
        let noWaitDescImg;

        if (classify) {
            noWaitClassify = editWareInfo.cid != classify.id && editWareInfo.type_name != classify.name ? true : false;
        }

        if (editWareInfo.sku.length == wareSku.length) {
            for (let i in editWareInfo.sku) {
                if (editWareInfo.sku[i].name != wareSku[i].name && editWareInfo.sku[i].price != wareSku[i].price) {
                    noWaitSku = true;

                    break;
                }
            }
        } else {
            noWaitSku = true;
        }

        if (editWareInfo.images.length == wareCarousel.length) {
            for (let i in editWareInfo.images) {
                if (editWareInfo.images[i] != wareCarousel[i]) {
                    noWaitCarousel = true;

                    break;
                }
            }
        } else {
            noWaitCarousel = true;
        }

        if (editWareInfo.photo.length == wareDescImg.length) {
            for (let i in editWareInfo.photo) {
                if (editWareInfo.photo[i] != wareDescImg[i]) {
                    noWaitDescImg = true;

                    break;
                }
            }
        } else {
            noWaitDescImg = true;
        }

        if (editWareInfo.title == wareTitle && editWareInfo.introduction == wareDescribe && !noWaitClassify && editWareInfo.supplier == warePrice && editWareInfo.freight == wareFreight && editWareInfo.taxes == wareTaxation && editWareInfo.inventory == wareStock && !noWaitSku && editWareInfo.thumb == warePoster && !noWaitCarousel && !noWaitDescImg) {
            app.showToast('请修改之后再进行操作', 'none');

            return false;
        } else {
            if (!wareTitle) {
                app.showToast('请填写商品标题', 'none');

                return false;
            } else if (!wareDescribe) {
                app.showToast('请填写商品描述', 'none');

                return false;
            } else if (!classify) {
                app.showToast('请选择商品分类', 'none');

                return false;
            } else if (!warePrice) {
                app.showToast('请填写商品价格', 'none');

                return false;
            } else if (!wareFreight) {
                app.showToast('请填写商品运费', 'none');

                return false;
            } else if (!wareTaxation) {
                app.showToast('请填写商品税费', 'none');

                return false;
            } else if (!wareStock) {
                app.showToast('请填写商品商品库存', 'none');

                return false;
            } else if (wareSku.length <= 0) {
                app.showToast('请填加商品规格', 'none');

                return false;
            } else if (!warePoster) {
                app.showToast('请填加商品封面图', 'none');

                return false;
            } else if (wareCarousel.length <= 0) {
                app.showToast('请填加商品详情轮播图', 'none');

                return false;
            } else if (wareDescImg.length <= 0) {
                app.showToast('请填加商品详情图', 'none');

                return false;
            }

            let oldWareSku = [];
            let newWareSku = [];

            wareSku.filter(element => {
                if (element.sku_id) {
                    oldWareSku.push(element);
                } else {
                    newWareSku.push(element);
                }
            });

            let data = {
                member_id: memberId,
                id: wareId,
                cid: classify.id,
                title: wareTitle,
                introduction: wareDescribe,
                supplier: warePrice,
                freight: wareFreight,
                inventory: wareStock,
                taxes: wareTaxation,
                thumb: warePoster,
                images: JSON.stringify(wareCarousel),
                photo: JSON.stringify(wareDescImg),
                sku: JSON.stringify(newWareSku),
                oldsku: JSON.stringify(oldWareSku)
            };

            app.request('goods/goods_update', data, res => {
                console.log(res);

                if (res.code === 600) {
                    let result = res.data;

                    if (result.code === 200) {
                        app.showToast(result.msg, 'success');

                        app.navigateBack(1);
                    } else {
                        app.showToast(result.msg, 'none');
                    }
                } else {
                    app.showToast(res.msg, 'none');
                }

                app.hideLoading();
            });
        }


    }

})
