// pages/fillIn/fillIn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: "选填",
    textareaFocus:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindToAddressList:function(e){
    wx.navigateTo({
      url: '/pages/addressList/addressList',
    })
  },
  inputMessage(e){
    this.setData({
      message: e.detail.value
    })
  },
  blurMessage(e){
    let message = this.data.message == '' ? '选填' : this.data.message
    this.setData({
      textareaFocus: false,
      message
    })
  },
  focusMessage(e){
    let message = this.data.message == '选填' ? '' : this.data.message
    this.setData({
      textareaFocus:true,
      message
    })
  },
})