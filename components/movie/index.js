// components/movie/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    movie: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击查看电影详情
    onMovieTap: function (event) {
      // 注意movieId会被转成小写movieid
      var movieId = event.currentTarget.dataset.movieid;
      wx.navigateTo({
        url: 'movie-detail/movie-detail?id=' + movieId,
      })
    }
  }
})
