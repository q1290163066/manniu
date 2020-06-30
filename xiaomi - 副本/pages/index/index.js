//index.js
//获取应用实例
var P=require('../../lib/wxpage.js');
import userAuthHub from '../../utils/userAuthHub.js';

P('index',{
  data: {
    appLogoImg: 'https://jiagy.zerosky.top/upload/error.png',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfoRes:{
      successed:false,
      data:null
    }
  },
  //第一次授权
  getUserInfo: function (e) {
    this.userInfoRes={
      successed: e.detail.errMsg.includes('ok'),
      data: e.detail,
    }
    wx.setStorageSync('userInfo', e.detail.userInfo);
    this.$emit('infoChange');
    this.$back();
  },
  onUnload:function(){
    userAuthHub.notify(this.userInfoRes);
  },
})
