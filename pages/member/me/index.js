const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js');

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    useCount: 0,
    leftCount: 0,
    member: null,
    currentUseCount: 0
  },
  attached() {
    console.log('onReady');
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    this.init();
  },
  ready() {
    wx.hideLoading()
  },
  methods: {
    // CopyLink(e) {
    //   wx.setClipboardData({
    //     data: e.currentTarget.dataset.link,
    //     success: res => {
    //       wx.showToast({
    //         title: '已复制',
    //         duration: 1000,
    //       })
    //     }
    //   })
    // },
    init() {
      let that = this;

      const user = AV.User.current();
      console.log(user);
      var openid = user.attributes.authData.lc_weapp.openid;

      const query = new AV.Query('Member').equalTo('openid', openid);
      query.first().then((member) => {
        console.log(member);
        if (member) {
          let memberJson = util.jsonify(member);
          memberJson.createdAt = util.formatTime(new Date(memberJson.createdAt));
          that.setData({
            member: memberJson
          });

          // 累计使用次数
          let query = new AV.Query('Order');
          query.equalTo('no', member.get('no'));
          query.equalTo('type', 1);
          query.count().then((count) => {
            that.data.useCount = count;
            that.setData({
              useCount: count
            });
          });

          // 查询最近充值记录 查询本地使用次数
          query = new AV.Query('Order');
          query.equalTo('type', 2);
          query.descending('createdAt');
          query.first().then((order) => {
            if (!order) {
              that.setData({
                currentUseCount: that.data.useCount
              });
            } else {
              query = new AV.Query('Order');
              query.equalTo('no', member.get('no'));
              query.equalTo('type', 1);
              query.greaterThan('createdAt', order.createdAt);
              query.count().then((count) => {
                that.setData({
                  currentUseCount: count
                });
              });
            }
          });
        }
      });
    },
    // login: function () {
    //   return AV.Promise.resolve(AV.User.current()).then(user =>
    //     user ? user : AV.User.loginWithWeapp());
    // },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    // showQrcode() {
    //   wx.previewImage({
    //     urls: ['https://image.weilanwl.com/color2.0/zanCode.jpg'],
    //     current: 'https://image.weilanwl.com/color2.0/zanCode.jpg' // 当前显示图片的http链接      
    //   })
    // },
    // bindGetUserInfo(res){
    //   console.log(res);
    //   const wxInfo = res.detail.userInfo;
    // }
    bindShow() {
      wx.navigateTo({
        url: './me/bind'
      })
    },
    showQrcode() {
      wx.previewImage({
        urls: ['https://cdn.ghostsf.com/me-wx.jpeg'],
        current: 'https://cdn.ghostsf.com/me-wx.jpeg' // 当前显示图片的http链接      
      })
    },
  }

})