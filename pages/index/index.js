//index.js

//获取应用实例
const app = getApp()


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    text: "Page location"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
     
    }

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  GetLoginInfo:function(e){
    //登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log("code:" + app.globalData.header);
          //发起网络请求
          wx.request({
            url: app.globalData.api + 'Login/OnLogin',
            data: {
              code: res.code
            },
            method: 'GET',
            header: {
              'Authorization': app.globalData.header,
              'content-type': 'application/json',
            }, // 设置请求的 header
            success: function (resInfo) {
              console.log(resInfo.data);
              if (resInfo.code=="ok") {
                wx.showToast({
                  title: resInfo.message,
                  icon: 'success'
                });
              } else {
                wx.showToast({
                  title: '失败：' + resInfo.message,
                  icon: 'loading'
                });
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
},
getClientInfo:function(e){
  wx.login({
    success: res => {
     
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        console.log("code:" + app.globalData.header);
         wx.request({
             url: app.globalData.api + 'Login/Test',
             method: "GET",
             header: { 
            // 'Authorization': app.globalData.header,
             'content-type': 'application/json',
            }, // 设置请求的 header
            success: function (res) {
            //如果是对象的话，写法为
              console.log(res.data.Message);
             // console.log(res.data);
            },
            fail:function(res){
             console.log("fail:" + res)
           }
      });
      }
    }
  });
},
   /**
   * 监听定位到当前位置
   */
  getLocation: function (e) {
     wx.getLocation({
       //定位类型 wgs84, gcj02
       type: 'gcj02',
       success: function (res) {
        console.log("获取地理位置："+res)
         wx.openLocation({
           //当前经纬度
           latitude: res.latitude,
           longitude: res.longitude,
           //缩放级别默认28
           scale: 28,
           //位置名
           name: "当前位置",
           //详细地址
           address: "address",
           //成功打印信息
           success: function (res) {
             console.log(res)
           },
           //失败打印信息
           fail: function (err) {
             console.log(err)
           },
           //完成打印信息
           complete: function (info) {
             console.log(info)
           },
         })

       },
       fail: function (err) {
         console.log(err)
       },
       complete: function (info) {
         console.log(info)
       },
     })
   },
})
