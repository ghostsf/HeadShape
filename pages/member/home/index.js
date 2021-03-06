const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js');

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    cardCur: 0,
    news: [],
    poster: []
  },
  attached() {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    const that = this;
    const query = new AV.Query('News');
    query.ascending('id');
    query.find().then((news) => {
      console.log(news);
      var newsDataJson = util.jsonify(news);
      newsDataJson.map(function (news) {
        news.createdAt = util.formatTime(new Date(news.createdAt));
        news.url = news.url.split(',')[0];
        return news;
      });
      const posterJson = newsDataJson.filter(function (news) {
        return news.type == 'poster';
      });
      const newsJson = newsDataJson.filter(function (news) {
        return news.type == 'news';
      });
      console.log(newsJson);
      that.setData({
        poster: posterJson,
        news: newsJson
      });
    });
  },
  ready(){
    wx.hideLoading()
  },
  methods: {
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },

  }

});