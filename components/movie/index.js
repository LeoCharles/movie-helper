Component({
  properties: {
    movie: {
      type: Object
    }
  },
  methods: {
    // 点击查看电影详情
    onMovieTap: function (event) {
      let movieId = event.currentTarget.dataset.movieid;
      wx.navigateTo({
        url: `../movie-detail/index?id=${movieId}`,
      })
    }
  }
})
