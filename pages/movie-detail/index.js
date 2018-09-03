// pages/movies/movies-detail/index.js
let util = require('../../utils/util.js')
let app = getApp()

Page({
  data: {
    movie: {}
  },

  // 监听页面加载
  onLoad: function (options) {
    let movieId = options.id;
    let detailUrl = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    util.http(detailUrl, this.processDoubanData);
  },

  // 处理豆瓣电影数据
  processDoubanData: function (data) {
    if(!data){
      return;
    }
    let director = {
      avatar: '',
      name: '',
      id: ''
    }
    if(data.directors[0] != null) {
      if(data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    let movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join('、'),
      average: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfo(data.casts),
      summary: data.summary
    }
    this.setData({
      movie:movie
    })
    wx.hideLoading()
  },

  // 点击查看图片
  viewMoviePostImg: function (event) {
    let src = event.currentTarget.dataset.src
    wx.previewImage({
      urls: [src], // 需要预览图片链接列表
      current: src // 当前需要显示的链接
    })
  },

})