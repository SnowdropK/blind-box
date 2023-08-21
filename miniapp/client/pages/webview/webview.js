Page({
  data: {
    url:''
  },
  onLoad(query) {
    const { url } = query
    if (url) {
      this.setData({
        url: decodeURIComponent(url)
      })
    }
  },
  onShow() { }
})