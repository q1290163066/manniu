// pages/buyer/buyer.js
var P = require('../../lib/wxpage.js');
const utils = require('../../utils/util.js');
import Login from '../../utils/login.js';
import { Buyer,Host } from '../../utils/API.js';
import userAuthHub from '../../utils/userAuthHub.js';
const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
let handledata=false;
let showUserPhoto=true;
let app=getApp();
P('buyer', {
  /**
   * 页面的初始数据
   */
  data: {
    userRole: '',
    qrCodeImg: Host+'resources/style/system/front/wap/jgy/images/user-erweima.png',
    showQrcodeImg: '',
    isShowQrcode: false,
    userInfo: {
      avatarUrl: Host + app.globalData.defaultImg,
      nickName :'登录/注册'
    },
    memberLevel: [],
    buyerDetail: [{
      id: '1',
      maths: 100.99,
      title: '余额'
    },
    {
      id: '2',
      maths: 0,
      title: '优惠券'
    },
    {
      id: '3',
      maths: 0,
      title: '积分'
    },
    ],
    indentDetail: [{
      id: 'submit',
      url: Host +'resources/style/system/front/wap/jgy/images/goods-unpay.png',
      text: '待付款',
      count:0
    },
    {
      id: 'pay',
      url: Host +'resources/style/system/front/wap/jgy/images/goods-unsend.png',
      text: '待发货',
      count: 0
    },
    {
      id: 'shipping',
      url: Host +'resources/style/system/front/wap/jgy/images/goods-unget.png',
      text: '待收货',
      count: 0
    },
    {
      id: 'receive',
      url: Host +'resources/style/system/front/wap/jgy/images/goods-uncomment.png',
      text: '已完成',
      count: 0
    },
    ],
    navDetail: [
      {
        id: 'focusUs',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/attentionUs.png',
        text: '关注我们',
      },
      {
        id: 'salesCenter',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/user-searchCenter.png',
        text: '分享中心'
      },
      {
        id: 'wallet',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/user-wallet.png',
        text: '钱包'
      },
      {
        id: 'integralMall',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/illegerall.png',
        text: '积分商城'
      },
      {
        id: 'coupon',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/user-coupon.png',
        text: '优惠券'
      },
      {
        id: 'voucherExchange',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/user-cash.png',
        text: '现金券充值'
      },
      {
        id: 'accountSetting',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/user-account.png',
        text: '账号设置'
      },
      {
        id: 'addressList',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/user-address.png',
        text: '地址管理'
      },
      {
        id: 'memberList?memberType=0',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/VipIcon.png',
        text: '尊享会员'
      },
      {
        id: 'recommender',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/goods-uncomment.png',
        text: '推荐人'
      },
      {
        id: 'paymentDetails',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/order.png',
        text: '支付明细'
      },
      {
        id: 'memberList?memberType=1',
        iconUrl: Host +'resources/style/system/front/wap/jgy/images/group.png',
        text: '集团会员申请'
      }
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    handledata = true;
    this.getBuyerData();
    this.getThePhotoAndName();
    this.$on('infoChange', this.getThePhotoAndName);
  },
  getAddressArea() {//地区数据
    // Login.requestWithLogin({ api: Buyer.addressEdit, method: 'POST', header }).then(result => {
    //   wx.setStorageSync('areas', result.areas);
    // });
    // utils.PROMISE('upload/nationalStreet.json').then(res => {
    //   wx.setStorageSync('towns', res)
    // })
  },
  /*setShowData: function (options) {
    if (!options) return false;
    let globalUser = options.user;
    let globalMoney = options.money;
    //let globalUserInfo = wx.getStorageSync('userInfo');
    //let trueNme = globalUser.trueName;
    //let nickName = trueNme.indexOf("jgy") === 0 ? globalUserInfo.nickName : trueNme, //名字
      //imgUrl = globalUser.photo ? utils.mergePathName(globalUser.photo) : '',
      //avatarImgUrl = imgUrl || globalUserInfo.avatarUrl, //头像
      let integral = globalUser.integral || 0, //积分
      userRole = globalUser.grade.name, //会员等级
      coupons = globalMoney.coupons || 0,//券
      availableBalance = globalMoney.availableBalance || 0, //余额
      msgsNum = globalMoney.msn || 0; //消息总数
    this.$setData({
      userRole: globalUser.grade.name,
      buyerDetail: [{
        id: '1',
        maths: globalUser.integral || 0,
        title: '积分'
      },
      {
        id: '2',
        maths: globalMoney.availableBalance || 0,
        title: '余额'
      },
      {
        id: 'coupon',
        maths: globalMoney.coupons || 0,
        title: '优惠券'
      },
      {
        id: 'messageList',
        maths: globalMoney.msn || 0,
        title: '通知'
      },
      ]
    });
  },*/

  getBuyerData: function () {
    let _this = this;
    // Login.requestWithLogin({ api: Buyer.userBeseInfo, method: 'POST', header }).then(res => {
    //   //if (res==false)return;
    //   /*let coupons = res.coupons || 0,//券
    //     availableBalance = res.user.availableBalance || 0, //总资产
    //     msgsNum = res.mc || 0; //消息总数*/
    //   //_this.setShowData({ money: { coupons, availableBalance, mc: msgsNum }, user: res.user });
    //   if(!res||!res.user){
    //     wx.showToast({
    //       title: '数据加载失败',
    //       icon:'none'
    //     })
    //     return;
    //   }
    //   _this.handleData(res);
    //   wx.setStorageSync('user', res.user);
    //   handledata = false;
    //   if (showUserPhoto===false){
    //     _this.getThePhotoAndName(res.user);
    //   }
    //   /*if (Array.isArray(this.data.userInfo)) {
    //     this.getThePhotoAndName();
    //   }*/
    // })
  },
  handleData(res){
    //積分餘額等
    let user=res.user;
    let buyerDetail = this.data.buyerDetail;
    buyerDetail[0].maths = user.integral || 0;
    buyerDetail[1].maths = user.availableBalance || 0;
    buyerDetail[2].maths = res.coupons || 0;
    buyerDetail[3].maths = res.mc || 0;
    //訂單
    let indentDetail = this.data.indentDetail;
    for (let i = 0; i < indentDetail.length;i++){
      indentDetail[i].count=res.orderCounts['count'+(i+1)]
    }
    this.setData({
      buyerDetail,
      indentDetail,
      userRole: user.grade.name,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (handledata == false){
      this.getBuyerData();
    }
    this.getAddressArea();
  },
  getThePhotoAndName(userSto = wx.getStorageSync('user'), userInfoSto = wx.getStorageSync('userInfo')){
    showUserPhoto = userSto?true:false;
    if (userInfoSto){
      let photoUrl='';
      if (userSto &&userSto.photo){
        photoUrl = utils.mergePathName(userSto.photo);
      }
      let avatarUrl = photoUrl ? photoUrl : userInfoSto.avatarUrl;
      let nickName = userInfoSto.nickName;
      if (userSto && userSto.trueName && userSto.trueName.indexOf('jgy') !== 0 ){
        nickName = userSto.trueName;
      }
      let userInfo = {
        avatarUrl: avatarUrl+"?_d=" + (new Date()).getTime(),
        nickName 
      };
      this.setData({
        userInfo
      })
    }
  },
  bindToOrderList: function (e) {
    let status = e.currentTarget.id;
    this.$route('orderlist?status=' + status);
  },
  bindToPage: function (e) {
    // let status = e.currentTarget.id;
    // if (!isNaN(parseInt(status)))return;
    // this.$route(status);
    console.log(e.currentTarget.id)
    let id=e.currentTarget.id
    console.log(id)
    if(id==1){
      wx.navigateTo({
        url: '/pages/balance/balance',
      })
    }
  },
  errImg: function (ev) {
    // that = this;
    let _errImg = ev.target.dataset.errimg;
    let _errObj = {};
    let userInfo=wx.getStorageSync('userInfo');
    _errObj[_errImg] = userInfo.avatarUrl;
    this.setData(_errObj);
    //utils.errorImg(ev, that);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})