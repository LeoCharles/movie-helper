// pages/preview-movie/index.js
Page({
  onReachBottom: function () {
    this.selectComponent('#movie-page').getMoreData()
  },
  onPullDownRefresh: function (event) {
    this.selectComponent('#movie-page').refreshData()
  }
})