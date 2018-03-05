// pages/movies/movies.js
var util = require('../../utils/util.js');
var app = getApp();

Page({

  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPannelShow: false
  },

  // 页面初始化
  onLoad: function (options) {
    // 请求豆瓣数据 注意：'content-type'不要设置为application/json或空
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';
    
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', 'TOP250');
  },

  // 请求豆瓣电影数据
  getMovieListData: function (url, settedKey, categoryTitle) {
    var _this = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        _this.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (err) {
        console.log('fail')
      }
    })
  },

  // 处理豆瓣数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for(var idx in moviesDouban.subjects) {
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
    // 动态赋值
    var readyData = {};
    readyData[settedKey] = {
      movies: movies,
      categoryTitle: categoryTitle
    };
    this.setData(readyData);
  },
  
  // 加载更多
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  // 聚焦搜索框
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },

  // 点击关闭
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPannelShow: false
    })
  },

  // 搜索
  onBindConfirm: function (event) {
    var text = event.detail.value;
    var seachUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(seachUrl, 'searchResult', '');
  },

  // 点击查看电影详情
  onMovieTap: function (event) {
    // 注意movieId会被转成小写movieid
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },

  
})