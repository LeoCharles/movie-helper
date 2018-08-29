// components/search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showClose: false,
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onBindFocus: function(event) {
      this.setData({
        showClose: true
      })
    },
    onBindBlur: function (event) {
      this.setData({
        showClose: false
      })
    },
    onCancelTap: function (event) {
      this.setData({
        showClose: false,
        value: ''
      })
    },
    // 搜索
    onBindConfirm: function (event) {
      // let {
      //   value
      // } = event.detail
      // wx.showToast({
      //   title: value
      // })
      console.log(event.detail)
      this.triggerEvent('searchmovie', event.detail)

    },
  }
})
