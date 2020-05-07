const app = getApp();
const AV = app.require('libs/av-weapp-min.js');
const util = app.require('utils/util.js');

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    showTopTips: '',
    errorMsg: '',
    // hidden: true,
    members: [],
    searchWord: '',
    addRecordShow: '',
    recordContent: '',
    recordMemberNo: null
  },
  BackPage() {
    console.log('BackPage');
    wx.reLaunch({
      url: '../index?PageCur=members'
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
  onLoad() {
    // let list = [];
    // for (let i = 0; i < 26; i++) {
    //   list[i] = String.fromCharCode(65 + i)
    // }
    // this.setData({
    //   list: list,
    //   listCur: list[0]
    // })
  },
  onReady() {
    this.fetchDatas();

    let that = this;
    // wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
    //   that.setData({
    //     boxTop: res.top
    //   })
    // }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
      that.setData({
        barTop: res.top
      })
    }).exec()
  },
  /**
   * 拉取数据
   */
  fetchDatas: function () {
    //console.log('uid', user.id);

    var query = new AV.Query('Member');
    if (this.data.searchWord) {
      const queryNo = new AV.Query('Member');
      queryNo.equalTo('no', Number(this.data.searchWord));

      const queryName = new AV.Query('Member');
      queryName.contains('name', this.data.searchWord);

      const queryPhone = new AV.Query('Member');
      queryPhone.contains('phone', this.data.searchWord);

      query = AV.Query.or(queryNo, queryName, queryPhone);
    }
    query.descending('no');
    query.equalTo('type', 0);
    query.find()
      .then(members => {
        this.setData(util.jsonify({
          members
        }));
      })
      .catch(console.error);
  },

  addRecordOpen: function (event) {
    this.data.recordMemberNo = Number(event.currentTarget.dataset.memberNo);
    this.setData({
      addRecordShow: 'show'
    });
  },

  addRecordClose: function () {
    this.data.recordMemberNo = null;
    this.setData({
      addRecordShow: '',
      content: ''
    });
  },

  addRecordDeal: function () {
    new AV.Query('Member').equalTo('no', this.data.recordMemberNo).first().then((member) => {
      let leftnum = Number(member.get('leftnum'));
      if (leftnum < 1) {
        wx.showToast({
          title: '会员没有剩余次数',
          icon: 'none',
        })
        return;
      }

      // 声明 class
      const Order = AV.Object.extend('Order');
      // 构建对象
      const order = new Order();
      // 为属性赋值
      order.set('content', this.data.recordContent);
      order.set('member', member);
      order.set('name', member.get('name'));
      order.set('phone', member.get('phone'));
      order.set('type', 1);
      order.set('no', member.get('no'));
      // 将对象保存到云端
      order.save().then((order) => {
        // 成功保存之后，执行其他逻辑
        console.log(member);
        console.log('order save.. ' + member.id);
        const memberUpdate = AV.Object.createWithoutData('Member', member.id);

        // 用户剩余次数减1
        memberUpdate.set('leftnum', leftnum - 1);
        memberUpdate.save().then((member) => {
          console.log(member.get('leftnum'));
        }, (error) => {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          })
          return;
        });

        // 通知用户被扣一次
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          success: function () {
            wx.redirectTo({
              url: './list'
            })
          }
        })

        this.addRecordClose();

      }, (error) => {
        // 异常处理
        console.error(error);
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      });
    })
  },
  delRecord(event) {
    const no = Number(event.currentTarget.dataset.memberNo);
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          const query = new AV.Query('Member');
          query.equalTo('no', no).first().then((member) => {
            member.destroy();

            wx.showToast({
              title: '删除成功',
              icon: 'success',
              success: function () {
                wx.redirectTo({
                  url: './list'
                })
              }
            })

          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }
  //获取文字信息
  // getCur(e) {
  //   this.setData({
  //     hidden: false,
  //     listCur: this.data.list[e.target.id],
  //   })
  // },

  // setCur(e) {
  //   this.setData({
  //     hidden: true,
  //     listCur: this.data.listCur
  //   })
  // },
  //滑动选择Item
  // tMove(e) {
  //   let y = e.touches[0].clientY,
  //     offsettop = this.data.boxTop,
  //     that = this;
  //   //判断选择区域,只有在选择区才会生效
  //   if (y > offsettop) {
  //     let num = parseInt((y - offsettop) / 20);
  //     this.setData({
  //       listCur: that.data.list[num]
  //     })
  //   };
  // },

  //触发全部开始选择
  // tStart() {
  //   this.setData({
  //     hidden: false
  //   })
  // },

  //触发结束选择
  // tEnd() {
  //   this.setData({
  //     hidden: true,
  //     listCurID: this.data.listCur
  //   })
  // },
  // indexSelect(e) {
  //   let that = this;
  //   let barHeight = this.data.barHeight;
  //   let list = this.data.list;
  //   let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
  //   for (let i = 0; i < list.length; i++) {
  //     if (scrollY < i + 1) {
  //       that.setData({
  //         listCur: list[i],
  //         movableY: i * 20
  //       })
  //       return false
  //     }
  //   }
  // }
});