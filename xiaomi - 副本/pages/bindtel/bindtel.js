// // pages/bindtel/bindtel.js
// var P = require('../../lib/wxpage')
// const utils = require('../../utils/util.js');
// import userAuthHub from '../../utils/userAuthHub.js';
// import Login from '../../utils/login.js';
// import { Buyer } from '../../utils/API.js';
// let header = { 'Content-Type': 'application/x-www-form-urlencoded' };

// P('bindtel',{
//   /**
//    * 页面的初始数据
//    */
//   data: {
//     currentTel:'',
//     telnum:'',
//     code:'',
//     cantGetCode:true,
//     gotCode:false,
//     gettingCode:false,
//     timeNum:60,
//     timeClock:null,
//     isAgree:false,
//     submiting:false,
//     cantSubmit:true,
//     phoneTime:0,
//     phoneLastRequestTime:0,
//     errorTip:'',
//     bindTelRes: {
//       successed: false,
//       data: null
//     }
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     let isUpdeteTel = (options.isUpdeteTel == 'true') ? true : false; //是否是更换手机
//     this.$setData({
//       login: options.login?true:false,
//       isUpdeteTel: isUpdeteTel,
//       currentTel: isUpdeteTel ? (wx.getStorageSync('user').mobile ? wx.getStorageSync('user').mobile : '') : ''
//     });
//   },
//   /**
//    * 手机号数据绑定
//    */
//   bindInputTel:function(e){
//     var telnum = e.detail.value, cantGetCode=true;
//     if (telnum.length==11){
//       cantGetCode=false;
//     }
//     this.$setData({
//       telnum: telnum,
//       cantGetCode: cantGetCode
//     })
//   },
//   /**
//    * 验证码数据绑定
//    */
//   bindInputCode:function(e){
//     var code = e.detail.value, cantSubmit=true;
//     if (code.length==6){
//       cantSubmit=false;
//     }
//     this.$setData({
//       code: code,
//       cantSubmit: cantSubmit
//     })
//   },
//   /**
//    * 获取验证码
//    */
//   bindGetCode:function(e){
//     let _this=this;
//     let params = {
//       "phone": _this.data.telnum,
//       "phoneTime": _this.data.phoneTime,
//       "phoneLastRequestTime": _this.data.phoneLastRequestTime,
//       "type": 0
//     }
//     wx.showLoading({
//       title: '发送中',
//       icon:'none'
//     })
//     Login.requestWithLogin({ api: Buyer.getCode, params: params, method: 'POST', header }).then(function(result){
//       wx.hideLoading();
//       let code = result.result;
//       if (code != 1) {
//         let errorTip = "";
//         if (code == 2) {
//           errorTip = "请求太频繁";
//         } else if (code == 3) {
//           errorTip = "请求非法";
//         } else if (code == -1 || code == 0) {
//           errorTip = "发送失败";
//         } else if (code == 4) {
//           errorTip = "当日获取验证码信息条数已达上限";
//         }
//         wx.showModal({
//           title: '获取验证码失败',
//           content: errorTip,
//         });
//         _this.$setData({
//           phoneLastRequestTime: result.phoneLastRequestTime, //上次请求发送时间
//           phoneTime: 0
//         })
//         return;
//       }
//       _this.$setData({
//         gotCode: true,
//         gettingCode: true,
//         cantGetCode: true
//       })
//       _this.clockBegin();
//     }).catch(function(err){
//       console.log(err);
//     })
//   },
//   // 是否阅读并同意《用户服务协议》
//   bindAgreeChange:function(){
//     let isAgree = this.data.isAgree;
//     this.$setData({
//       isAgree: !isAgree
//     });
//   },
//   /**
//    * 提交
//    */
//   bindSubmit: function (e) {
//     let _this = this;
//     let isUpdeteTel = _this.data.isUpdeteTel
//     let errorTip = isUpdeteTel ? "更改失败" : "绑定失败";
//     let successTip = isUpdeteTel ? "更改成功" : "绑定成功";
//     if (!isUpdeteTel && _this.data.isAgree == false) {
//       wx.showModal({
//         title: '提示',
//         content: '请阅读并同意《用户服务协议》',
//       })
//       return;
//     }
//     wx.showLoading({
//       title: '提交中',
//       icon:'none'
//     })
//     let params = {
//       phoneCode: _this.data.code,
//       userName: _this.data.telnum
//     }
//     Login.requestWithLogin({ api: Buyer.updateTel, params: params, method: 'POST', header }).then(function (result){
//       wx.hideLoading();
//       if (result.result != 0) {
//         wx.showModal({
//           title: errorTip,
//           content: result.msg,
//           icon: 'none'
//         })
//         return;
//       }
//       let globalUser = wx.getStorageSync('user');
//       if (typeof globalUser=='object'){
//         globalUser.mobile = _this.data.telnum;
//         wx.setStorageSync('user', globalUser);
//       }
//       wx.showToast({
//         title: successTip,
//         success:()=>{
//           setTimeout(function () {
//             wx.hideToast();
//             if (_this.data.login) {
//               _this.data.bindTelRes = {
//                 successed: true,
//                 data: null
//               }
//             }
//             _this.$back();
//           }, 1500);
//         }
//       });
//       clearInterval(_this.data.timeClock);
//     }).catch(function (err) {
//       console.log(err);
//     })
//   },
//   // bindSubmit:function(e){
//   //   let _this=this;
//   //   if (_this.data.isAgree==false){
//   //     wx.showModal({
//   //       title: '提示',
//   //       content: '请阅读并同意《用户服务协议》',
//   //     })
//   //     return;
//   //   }
//   //   var sendCode=utils.PROMISE('/api',{"code":_this.data.code},'POST',{},true);
//   //   sendCode.then(function(result){
//   //     if (result.code!=0){
//   //       wx.showModal({
//   //         title: '绑定失败',
//   //         content: result.msg,
//   //         icon: 'none'
//   //       })
//   //       return;
//   //     }
//   //     wx.showToast({
//   //       title: '绑定成功'
//   //     })
//   //     setTimeout(function(){
//   //       wx.hideToast();
//   //       if(this.data.login){
//   //         this.bindTelRes={
//   //           successed: true,
//   //           data: null
//   //         }
//   //         this.$back();
//   //       }
//   //     },1500);
//   //   }).catch(function(err){
//   //     console.log(err);
//   //   })
//   // },
//   /**
//    * 获取验证码定时
//    */
//   clockBegin:function(){
//     let _this = this;
//     function timeClock(){
//       var lastTime = _this.data.timeNum;
//       if(lastTime==0){
//         _this.$setData({
//           timeNum:60,
//           gettingCode:false,
//           cantGetCode:false
//         })
//         clearInterval(_this.data.timeClock);
//       }else{
//         _this.$setData({
//           timeNum: lastTime-1,
//         })
//       }
//     }
//     _this.data.timeClock = setInterval(timeClock,1000);
//   },
//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
//     let isUpdeteTel = this.data.isUpdeteTel;
//     let barTitle = isUpdeteTel ? "更换手机" : "手机绑定";
//     wx.setNavigationBarTitle({
//       title: barTitle
//     });
//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {
//     clearInterval(this.data.timeClock);
//     if(this.data.login){
//       userAuthHub.notify(this.data.bindTelRes);
//     }
//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })