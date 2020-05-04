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
    member: null
  },
  attached() {
    console.log('onReady');
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    this.init();
  },
  ready(){
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
          console.log(member);
          let memberJson = util.jsonify(member);
          console.log(memberJson);
          memberJson.createdAt = util.formatTime(new Date(memberJson.createdAt));
          that.setData({
            member: memberJson
          });

          const query = new AV.Query('Order');
          query.equalTo('no', member.get('no'));
          query.count().then((count) => {
            console.log(count);
            that.setData({
              useCount: count
            });
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