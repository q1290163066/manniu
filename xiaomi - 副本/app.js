//app.js
var wxpage = require('./lib/wxpage');
const util = require('utils/util.js');
import Login from 'utils/login.js'
import {Home,Buyer} from 'utils/API.js'
wxpage.A({
  config: {
    route: ['/pages/$page'],
    resolvePath: function (name) {
      return '/pages/' + name+'/'+name
    }
  },
  onLaunch: function (opts) {
    this.getPhoneStyle();
    if(wx.getStorageSync('sessionId')){
      Login.requestWithLogin({ api: Buyer.addIntegral}).then(res=>{
        console.log(res);
      })
    }
    //this.getFullCut();
    
    /*var that = this;
    //console.log('APP is Running', opts)
    //检查授权
    var session = wx.getStorageSync("sessionId");
    if (!session) {
      that.userLogin();
    } else {
      wx.checkSession({
        success: function () {
          //传送登录态
          var success = res => {
            if (res.data.code == 0) {
              that.$switch({
                url: '../home/home'
              })
            } else {
              that.userLogin();
            }
          }
          util.POST('', { 'sessionId': sessionId }, success);
        },
        fail: function () {
          that.userLogin();
        }
      })
    }*/
  },
  onAwake: function (time) {
    //this.getFullCut();
  },
  getPhoneStyle(){
    let config = this.globalData.phone;
    let res=wx.getSystemInfoSync();
    if (res.statusBarHeight >= 44) {
      config.isHighHead = true;
    }
    if (res.model.indexOf('iPhone')!==-1&&res.screenHeight > 750) config.isHasKey = true;
    if(res.screenWidth<380)config.widthLess=true;
    config.systemHeight = res.windowHeight;
    this.globalData.phone=config;
  },
  getFullCut(price,state,than){
    let params={
      price:price||null,
      state:state||'all',
      than:than||null
    }
    util.PROMISE(Home.fullCut,params).then(res=>{
      if(res.states==0)return;
      let data=res.data.map(item=>({
        id:item.id,
        full:item.full,
        cut:item.cut
      }))
      this.globalData.fullCut={
        status: 1,
        data
      }
    })
  },
  onShow: function () {
    // Do something
  },
  /*userLogin: function () {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res.code);
          that.globalData.userCode = res.code;
          //获取用户信息
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                //登录失败回调
                var failEvent = function (res) {
                  wx.showModal({
                    title: '登录失败',
                    content: '即将退出' + res.data.msg,
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 0
                        })
                      }
                    }
                  })
                }
                //获取自定义登录态
                var success = res => {
                  if (res.data.code == -1) {
                    failEvent(res);
                    return;
                  }
                  var data = res.data.data;
                  that.$cache.set('sessionId', data.sessionId);
                };
                var fail = res => {
                  failEvent(res);
                }
                util.POST('', { code: that.globalData.userCode }, success, fail);

                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    that.globalData.userInfo = res.userInfo;
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (that.userInfoReadyCallback) {
                      that.userInfoReadyCallback(res)
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },*/
  globalData: {
    userInfo: null,
    defaultImg: 'upload/error.png',
    userImg:'resources/head_pic.png',
    fullCut:{
      status:0
    },
    phone:{
      isHighHead: false,//是否是刘海屏手机
      isHasKey: false,//是否带下巴手机
      systemHeight: 0,//手机屏幕高度
      widthLess:false,//宽度是否小于等于375
    }
  }
})
