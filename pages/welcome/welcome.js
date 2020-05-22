// pages/welcome/welcome.js
const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '欢迎光临',
    userInfo: {}
  },

  // login: async function () {
  //   // return AV.Promise.resolve(AV.User.current()).then(user =>
  //   //   user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
  //   // ).then(user => user ? user : AV.User.loginWithWeapp);
  //   return AV.Promise.resolve(AV.User.current()).then(user =>
  //     user ? user : AV.User.loginWithWeapp());
  // },

  go: function () {
    const that = this;
    const user = AV.User.current();

    if (!user) {
      AV.User.loginWithWeapp().then((user) => {
        that.autoJump();
      });
    }else{
      that.autoJump();
    }
  },

  /**
   * 判断用户自动跳转
   */
  autoJump: function () {
    // 请求消息订阅的权限
    util.wxMsgReq();

    const that = this;
    // todo 这边第一次登陆 没有获取到user的bug
    const user = AV.User.current();
    console.log(user);
    //判断该用户是否激活绑定账号);
    var openid = user.attributes.authData.lc_weapp.openid;
    const query = new AV.Query('Member').equalTo('openid', openid);
    query.find().then(function (results) {
      console.log(results);
      if (results.length == 0) {
        wx.redirectTo({
          url: '../member/index'
        })
      } else {
        var member = results[0].attributes;
        if (member.type == 1) {
          wx.redirectTo({
            url: '../business/index'
          })
        } else {
          wx.redirectTo({
            url: '../member/index'
          })
        }
      }
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onReady: function () {
    // this.login().then(this.autoJump());
  },


})