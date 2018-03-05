// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');

Page({

  data: {
    movies: {},
    isEmpty: true,
    navigateTitle: '',
    requestUrl: '',
    totalCount: 0,
    total: 0
  },

  // 页面初始化
  onLoad: function (options) {
    // 获取跳转地址传过来的参数并保存
    var category = options.category;
    this.setData({
      navigateTitle: category
    })
    // 动态设置请求地址
    var dataUrl = '';
    switch (category) {
      case '正在热映': 
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case 'TOP250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    };
    this.setData({
      requestUrl: dataUrl
    })
    // 初始化获取数据
    util.http(this.data.requestUrl, this.processDoubanData);
    // 显示导航栏加载动画
    wx.showNavigationBarLoading();
  },

  // 页面加载完成
  onReady: function (event) {
    // 动态设置导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },

  // 上拉加载更多
  onReachBottom: function (event) {
    // 通过更新数据起始位置start的值实现加载更多
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    // 判断是否达到数据总数
    if (this.data.totalCount <= this.data.total) {
      util.http(nextUrl, this.processDoubanData);
      // 显示导航栏加载动画
      wx.showNavigationBarLoading();
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'success',
        duration: 1000
      })
    }
  },

  // 下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + '?start=0&count=20';
    this.setData({
      movies: {},
      isEmpty: true,
      totalCount: 0,
      total: 0
    })
    util.http(refreshUrl, this.processDoubanData);
    // 显示导航栏加载动画
    wx.showNavigationBarLoading();
  },

  // 处理豆瓣数据
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var temp = {
        title: subject.title,
        coverageUrl: subject.images.large,
        average: subject.rating.average,
        stars: util.convertToStarsArray(subject.rating.stars),
        movieId: subject.id
      };
      movies.push(temp);
    }
    var totalMovies = {};
    // 判断数据是否为空
    if (!this.data.isEmpty) {
      // 非空，将新数据和原有数据合并在一起
      totalMovies = this.data.movies.concat(movies);
      this.setData({
        movies: totalMovies,
      });
    } else {
      // 首次加载
      this.setData({
        movies: movies,
        isEmpty: false,
        total: moviesDouban.total
      });
    }
    // 每次加载20条数据
    this.data.totalCount += 20;
    // 隐藏导航栏加载动画
    wx.hideNavigationBarLoading();
    // 停止下拉刷新动画
    wx.stopPullDownRefresh();
  },

  // 点击查看电影详情
  onMovieTap: function (event) {
    // 注意movieId会被转成小写movieid
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },

})