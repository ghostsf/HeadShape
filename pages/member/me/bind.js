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

      const data = {
        touser: member.get('openid'),
        template_id: 'vU7W37FrSe--yEFd7XjYhuREW2Oi--VXOg_4XqCfybg',
        page: "pages/welcome/welcome",
        data: {
          "name1": {
            "value": member.get('name'),
          },
          "phone_number2": {
            "value": member.get('phone'),
          },
          "time3": {
            "value": util.formatTime(new Date())
          },
          "thing4": {
            "value": '会员卡编号'+member.get('no')
          }
        }
      };
      AV.Cloud.run('sendNotice',data).then((data) => {
        data.success = (result) => {
          // 成功
          console.log('sendNotice success');
          console.log(result);
        };
        data.fail = ({ errMsg }) => {
          // 错误
          console.error(errMsg);
        };
        wx.requestPayment(data);
      }).catch(error => {
        // 错误处理
        console.error(error);
      })
      
    }).catch(
      console.error
    );
  },


});