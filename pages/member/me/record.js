const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    records: []
  },
  onLoad: function (options) {
    const no = Number(options.no);
    const orderQuery = new AV.Query('Order').equalTo('no', no);
    orderQuery.descending('createdAt');
    orderQuery.find()
      .then(records => {
        let recordsJson = util.jsonify({
          records
        })
        console.log(recordsJson);
        recordsJson.records.map(function(record){
          record.createdAt = util.formatTime(new Date(record.createdAt));
          return record;
        });
        this.setData(recordsJson);
      })
      .catch(console.error);


  }
})