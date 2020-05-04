const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js');
const regeneratorRuntime = app.require('utils/runtime')

Page({

  data: {
    showTopTips: '',
    errorMsg: '',
    name: '',
    phone: '',
    no: ''
  },

  showTopTips: function (errorMsg) {
    const that = this;
    this.setData({
      errorMsg: errorMsg,
      showTopTips: 'show'
    });
    setTimeout(function () {
      that.setData({
        errorMsg: '',
        showTopTips: ''
      });
    }, 3000);
  },

  hideModal: function () {
    this.setData({
      errorMsg: '',
      showTopTips: ''
    });
  },

  async bind() {
    //debugger;
    var name = this.data.name && this.data.name.trim();
    var phone = this.data.phone && this.data.phone.trim();

    if (!name) {
      this.showTopTips('请填写姓名');
      return;
    }
    if (!phone) {
      this.showTopTips('请填写手机号码');
      return;
    }
    if (!util.isPhoneAvailable(phone)) {
      this.showTopTips('手机号码格式不正确');
      return;
    }

    const user = AV.User.current();
    var openid = user.attributes.authData.lc_weapp.openid;

    // 判断手机号码是否存在 存在的话就更新下已有数据 绑定openid
    let query = new AV.Query('Member');
    query.equalTo('phone', phone);
    var memberPhone = await query.first();
    if (memberPhone) {
      memberPhone.set('openid', openid);
      memberPhone.set('user', user);
      memberPhone.save();
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000,
        success: function () {
          wx.redirectTo({
            url: '../index?PageCur=me'
          })
        }
      })
      return;
    }

    var no = 1;
    query = new AV.Query('Member');
    query.descending('no');
    var memberNo = await query.first();
    if (memberNo) {
      no = memberNo.get('no') + 1;
    }

    const Member = AV.Object.extend('Member');
    const member = new Member();
    member.set('no', Number(no));
    member.set('name', name);
    member.set('phone', phone);
    member.set('openid', openid);
    member.set('user', user);

    member.save().then((member) => {
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000,
        success: function () {
          wx.redirectTo({
            url: '../index?PageCur=me'
          })
        }
      })
    }).catch(
      console.error
    );
  },


});