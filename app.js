//app.js
const md5 = require('utils/md5.js')
const util = require('utils/util.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  
    //检查会话密钥session_key有效性
    wx.checkSession({
      success: function (res) {
        //session_key 未过期，并且在本生命周期一直有效
        console.log("session有效");
        wx.showToast({
          title: "登录成功",
          icon: 'success'
        });
        //调用业务逻辑主页
      },
      fail: function () {
        console.log("session失效");
        // session_key 已经失效，需要重新执行登录流程
        //wx.login(); //无效跳转页面重新登录
        wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
          url: '/pages/index/index?hasUserInfo=false',
          success:function(successs){
            console.log("redirect success");
          },
          fail:function(error){
            console.log("redirect fail");
          }
        });
    }
  });
  
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
   
    userInfo: null,
    imgUrl: 'http://localhost:8038/img/',
    api: 'http://localhost:8038/',
    header: 'BasicAuth ' + util.formatDateTime(new Date()) + '|' + md5.hexMD5('123456'+ util.formatDateTime(new Date()))//BasicAuth后务必要保留空格,token规则时间戳+加密字符串
   
  }
})