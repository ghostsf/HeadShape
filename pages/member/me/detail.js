const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    member: {}
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
      that.setData({
        member: memberJson
      });
    });


  }
})