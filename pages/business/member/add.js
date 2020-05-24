const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js')
const regeneratorRuntime = app.require('utils/runtime')

Page({
  data: {
    showTopTips: '',
    errorMsg: '',
    name: null,
    phone: null,
    genderSwitch: true,
    leftnum: 0,
    no: null,
    remark: ''
  },
  pageBack() {
    wx.reLaunch({
      url: 'pages/business/member/index'
    })
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

  sexSwitchChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      genderSwitch: e.detail.value
    });
  },

  addMember: async function () {
    var name = this.data.name && this.data.name.trim();
    var phone = this.data.phone && this.data.phone.trim();
    var no = this.data.no && this.data.no.trim();

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

    // 判断重复
    let query;
    if (no) {
      query = new AV.Query('Member');
      query.equalTo('no', Number(no));
      var noCount = await query.count();
      if (noCount > 0) {
        wx.showToast({
          title: '该编号已存在',
          icon: 'none'
        })
        return;
      }
    } else {
      query = new AV.Query('Member');
      query.descending('no');
      var memberNo = await query.first();
      if (!memberNo) {
        no = 1;
      } else {
        no = memberNo.get('no') + 1;
      }
    }

    // 手机号去重
    query = new AV.Query('Member');
    query.equalTo('phone', phone);
    var phoneCount = await query.count();
    if (phoneCount > 0) {
      wx.showToast({
        title: '该手机号已存在',
        icon: 'none'
      })
      return;
    }


    // 声明 class
    const Member = AV.Object.extend('Member');
    // 构建对象
    const member = new Member();
    // 为属性赋值
    member.set('name', name);
    member.set('phone', phone);
    member.set('no', Number(no));
    member.set('remark',this.data.remark);
    if (this.data.genderSwitch) {
      member.set('gender', 0);
    } else {
      member.set('gender', 1);
    }
    member.set('leftnum', Number(this.data.leftnum));
    // 将对象保存到云端
    member.save().then((member) => {
      // 成功保存之后，执行其他逻辑
      this.showTopTips('保存成功');
    }, (error) => {
      // 异常处理
      console.error(error);
      this.showTopTips('保存失败');
    });
  },


});