Page({
  data: {
    PageCur: 'members'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onLoad: function (options) {
    if(options.PageCur){
      this.setData({
        PageCur: options.PageCur
      })
    }
  }
  // onShareAppMessage() {
  //   return {
  //     title: 'ColorUI-高颜值的小程序UI组件库',
  //     imageUrl: '/images/share.jpg',
  //     path: '/pages/index/index'
  //   }
  // },
})