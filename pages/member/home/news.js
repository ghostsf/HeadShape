const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js');

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    news: {}
  },
  onLoad: function (options) {
    const that = this;
    var query = new AV.Query('News');
    const id = Number(options.id);
    query.equalTo('id', id);
    query.first().then((news) => {
      console.log(news);
      let newsJson = util.jsonify(news);
      newsJson.createdAt = util.formatTime(new Date(newsJson.createdAt));
      newsJson.content = newsJson.content.split(/[(\r\n)\r\n]+/);
      newsJson.url  = newsJson.url.split(',');
      console.log(newsJson);
      that.setData({
        news: newsJson
      });

      news.set('viewCount',news.get('viewCount')+1);
      news.save();
    });
  },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  onShareAppMessage() {
    return {
      title: '首领造型',
      imageUrl: 'https://cdn.ghostsf.com/headshape-logo.png',
      path: '/pages/member/index'
    }
  },
});
