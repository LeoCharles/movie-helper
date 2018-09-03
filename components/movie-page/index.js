// 电影页面
let app = getApp()
let baseUrl = app.globalData.doubanBase

Component({
  properties: {
    category: {
      type: String
    }
  },
  data: {
    showClose: false,
    showSearchPannel: false,
    start: 0,
    count: 15,
    total: 0,
    searchResult: [],
    movieList: [],
    value: ''
  },
  attached: function () {
    this.getMovieListData()
  },
  methods: {
    // 请求豆瓣电影数据
    getMovieListData: function (requestRul, type) {
      let category = type ? type : this.properties.category
      let start = this.data.start
      let count = this.data.count
      let url = requestRul ? requestRul : `${baseUrl}/v2/movie/${category}?start=${start}&count=${count}`
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      wx.request({
        url,
        method: 'GET',
        header: {
          'content-type': 'json'
        },
        success: (res) => {
          this.fixDoubanData(res.data, category)
        },
        fail: (err) => {
          console.log('fail')
        }
      })
    },
    // 处理豆瓣数据
    fixDoubanData: function (moviesDouban, category) {
      let {subjects, total, start, count} = moviesDouban
      let newstart = start + count
      let movieList = []
      for (let item of subjects) {
        let movie = {
          title: item.title,
          coverageUrl: item.images.large,
          average: item.rating.average,
          movieId: item.id
        };
        movieList.push(movie)
      }
      // 判断是否为搜索结果
      if (category !== 'search') {
        if (this.data.movieList) {
          movieList = this.data.movieList.concat(movieList)
        }
        this.setData({
          movieList,
          total,
          start: newstart
        })
      } else {
        this.setData({
          searchResult: movieList
        })
      }
      wx.hideLoading()
    },
    // 上拉加载更多
    getMoreData() {
      let movieCount = this.data.movieList.length
      if (movieCount < this.data.total) {
        this.getMovieListData()
      } else {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'success',
          duration: 1000
        })
      }
    },
    // 下拉刷新
    refreshData: function () {
      let movieCount = this.data.movieList.length
      if (!movieCount) {
        this.getMovieListData()
      }
    },
    // 搜索电影
    onBindConfirm: function (event) {
      let { value } = event.detail
      let seachUrl = `${baseUrl}/v2/movie/search?q=${value}`
      this.getMovieListData(seachUrl, 'search')
    },
    // 聚焦输入框
    onBindFocus: function (event) {
      this.setData({
        showClose: true,
        showSearchPannel: true
      })
    },
    // 取消
    onCancelTap: function (event) {
      this.setData({
        showClose: false,
        showSearchPannel: false,
        searchResult: [],
        value: ''
      })
    }
  }
})