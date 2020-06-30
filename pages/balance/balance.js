// pages/balance/balance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'500.00'
  },
  toDetail(){
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})