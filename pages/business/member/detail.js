const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    member: {},
    records: [],
    rechargeNum: 0,
    rechargeRemark: '',
    rechargeMemberShow: ''
  },
  pageBack() {
    wx.reLaunch({
      url: 'pages/business/member/list'
    })
  },
  onLoad: function (options) {
    const that = this;
    var query = new AV.Query('Member');
    const no = Number(options.no);
    console.log(no);
    query.equalTo('no', no);
    query.first().then((member) => {
      let memberJson = util.jsonify(member);
      memberJson.createdAt = util.formatTime(new Date(memberJson.createdAt));
      memberJson.updatedAt = util.formatTime(new Date(memberJson.updatedAt));
      that.setData({
        member: memberJson
      });

      const orderNoQuery = new AV.Query('Order').equalTo('no', Number(member.get('no')));
      const orderPhoneQuery = new AV.Query('Order').equalTo('phone', member.get('phone'));
      const orderQuery = AV.Query.or(orderNoQuery, orderPhoneQuery);
      orderQuery.descending('createdAt');
      orderQuery.find()
        .then(records => {
          let recordsJson = util.jsonify({
            records
          })
          console.log(recordsJson);
          recordsJson.records.map(function (record) {
            record.createdAt = util.formatTime(new Date(record.createdAt));
            return record;
          });
          this.setData(recordsJson);
        })
        .catch(console.error);
    });
  },
  modelBlur(e) {
    let key = e.currentTarget.dataset.key;
    if (key == 'gender') {
      if (e.detail.value) {
        e.detail.value = 0;
      } else {
        e.detail.value = 1;
      }
    }
    this.data.member[key] = e.detail.value;
    this.setData({
      member: this.data.member
    });
  },
  updateMember() {
    console.log(this.data.member);
    const member = AV.Object.createWithoutData('Member', this.data.member.objectId);
    member.set('name', this.data.member.name);
    member.set('phone', this.data.member.phone);
    member.set('gender', this.data.member.gender);
    member.set('no', Number(this.data.member.no));
    member.set('leftnum', Number(this.data.member.leftnum));
    member.set('remark', this.data.member.remark);
    member.save().then((member) => {
      wx.showToast({
        title: '更新成功',
        icon: 'success',
        success: function () {
          wx.redirectTo({
            url: './list'
          })
        }
      })
    }, (error) => {
      console.log(error);
      wx.showToast({
        title: '更新失败：' + error.code
      })
    });
  },
  rechargeMember() {
    this.setData({
      rechargeMemberShow: 'show'
    });
  },
  rechargeMemberClose() {
    this.setData({
      rechargeMemberShow: '',
      rechargeRemark: '',
      rechargeNum: 0
    });
  },
  rechargeMemberDeal(event) {
    if (!this.data.rechargeNum || Number(this.data.rechargeNum) == 0) {
      wx.showToast({
        title: '填写充值次数',
        icon: 'none'
      })
      return;
    }

    var memberNo = Number(event.currentTarget.dataset.memberNo);
    new AV.Query('Member').equalTo('no', memberNo).first().then((member) => {

      const Order = AV.Object.extend('Order');
      const order = new Order();
      order.set('content', this.data.rechargeRemark);
      order.set('member', member);
      order.set('name', member.get('name'));
      order.set('phone', member.get('phone'));
      order.set('type', 2);
      order.set('rechargeNum', Number(this.data.rechargeNum));
      order.set('no', member.get('no'));
      // 将对象保存到云端
      order.save().then((order) => {
        // 成功保存之后，执行其他逻辑
        member.set('leftnum', member.get('leftnum') + Number(this.data.rechargeNum));
        member.save().then((member) => {
          console.log(member);
        }, (error) => {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          })
          return;
        });

        // 通知用户
        const data = {
          touser: member.get('openid'),
          template_id: 'gcm5blboAoAEBicRiojCPlLqnHCxOB1SD0ALKB9No1M',
          page: "pages/welcome/welcome",
          data: {
            "thing1": {
              "value": '会员卡编号'+member.get('no'),
            },
            "thing2": {
              "value": '充值'+this.data.rechargeNum+'次，剩余'+member.get('leftnum')+'次',
            },
            "date3": {
              "value": util.formatTime(new Date())
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

        wx.showToast({
          title: '保存成功',
          icon: 'success',
          success: function () {
            wx.redirectTo({
              url: './detail?no='+memberNo
            })
          }
        })

        this.rechargeMemberClose();

      }, (error) => {
        // 异常处理
        console.error(error);
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      });
    })
  }
})