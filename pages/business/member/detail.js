const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    member: {},
    records: []
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
    member.save().then((member) => {
      wx.showToast({
        title: '更新成功',
        icon: 'success',
        success: function(){
          wx.redirectTo({
            url: './list'
          })
        }
      })
    }, (error) => {
      console.log(error);
      wx.showToast({
        title: '更新失败：'+error.code
      })
    });
  }
})