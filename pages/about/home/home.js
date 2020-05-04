Component({
  options: {
    addGlobalClass: true,
  },
  data: {
  },
  attached() {
  },
  methods: {
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
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