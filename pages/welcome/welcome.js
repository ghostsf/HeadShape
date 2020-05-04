// pages/welcome/welcome.js
const app = getApp();
const AV = app.require('libs/av-weapp-min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '欢迎光临',
    userInfo: {}
  },

  login: function () {
    // return AV.Promise.resolve(AV.User.current()).then(user =>
    //   user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    // ).then(user => user ? user : AV.User.loginWithWeapp);
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? user : AV.User.loginWithWeapp());
  },

  go: function () {
    this.login().then(this.autoJump());
  },

  /**
   * 判断用户自动跳转
   */
  autoJump:function(){
    const that = this;
    const user = AV.User.current();
    //判断该用户是否激活绑定账号);
    var openid = user.attributes.authData.lc_weapp.openid;
    const query = new AV.Query('Member').equalTo('openid', openid);
    query.find().then(function (results){
      console.log(results);
      if (results.length == 0 ){
        wx.navigateTo({
          url: '../member/index'
        })
      }else{
        var member = results[0].attributes;
        if(member.type == 1){
          wx.navigateTo({
            url: '../business/index'
          })
        }else{
          wx.navigateTo({
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