// 大B
function manufactor () {
    return [
        {
            "pagePath": "/pages/sellerBasic/index/index",
            "text": "首页",
            "iconPath": "/resources/imgs/index.png",
            "selectedIconPath": "/resources/imgs/indexActive.png"
        },
        {
            "pagePath": "/pages/manufactor/publish/index",
            "text": "发布",
            "iconPath": "/resources/imgs/publish.png",
            "selectedIconPath": "/resources/imgs/publishActive.png"
        },
        {
            "pagePath": "/pages/sellerBasic/msg/index",
            "text": "客服",
            "iconPath": "/resources/imgs/msg.png",
            "selectedIconPath": "/resources/imgs/msgActive.png"
        },
        {
            "pagePath": "/pages/sellerBasic/my/index",
            "text": "我的",
            "iconPath": "/resources/imgs/my.png",
            "selectedIconPath": "/resources/imgs/myActive.png"
        }
    ];
}

// 小B
function agent () {
    return [
        {
            "pagePath": "/pages/sellerBasic/index/index",
            "text": "首页",
            "iconPath": "/resources/imgs/index.png",
            "selectedIconPath": "/resources/imgs/indexActive.png"
        },
        {
            "pagePath": "/pages/sellerBasic/msg/index",
            "text": "客服",
            "iconPath": "/resources/imgs/msg.png",
            "selectedIconPath": "/resources/imgs/msgActive.png"
        },
        {
            "pagePath": "/pages/sellerBasic/my/index",
            "text": "我的",
            "iconPath": "/resources/imgs/my.png",
            "selectedIconPath": "/resources/imgs/myActive.png"
        }
    ];
}

// "tabBar": {
//     "color": "#A6A1A1",
//     "selectedColor": "#EA2243",
//     "backgroundColor": "#FAFAFA",
//     "borderStyle": "black",
//     "list": [
//         {
//             "pagePath": "pages/sellerBasic/index/index",
//             "text": "首页",
//             "iconPath": "/resources/imgs/index.png",
//             "selectedIconPath": "/resources/imgs/indexActive.png"
//         },
//         {
//             "pagePath": "pages/manufactor/publish/index",
//             "text": "发布",
//             "iconPath": "/resources/imgs/publish.png",
//             "selectedIconPath": "/resources/imgs/publishActive.png"
//         },
//         {
//             "pagePath": "pages/sellerBasic/msg/index",
//             "text": "客服",
//             "iconPath": "/resources/imgs/msg.png",
//             "selectedIconPath": "/resources/imgs/msgActive.png"
//         },
//         {
//             "pagePath": "pages/sellerBasic/my/index",
//             "text": "我的",
//             "iconPath": "/resources/imgs/my.png",
//             "selectedIconPath": "/resources/imgs/myActive.png"
//         }
//     ]
// },

module.exports = {
    manufactor: manufactor,
    agent: agent
}