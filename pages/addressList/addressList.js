// pages/addressList/addressList.js
var P = require('../../lib/wxpage');
import { Buyer } from '../../utils/API.js'
const utils = require('../../utils/util.js');
import Login from '../../utils/login.js';
const header = { "Content-Type": "application/x-www-form-urlencoded" };

P('addressList', {

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    orderCheck:false,
    haveData:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressData();
    if(options.ordercheck=='true'){
      this.setData({
        orderCheck:true
      })
      this.data.checkedid = options.addrid;
    }
    this.$on('updateAddr', this.getAddressData);
  },
  getAddressData: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    Login.requestWithLogin({ api: Buyer.fetchAddress, method: 'POST', header }).then(res => {
      wx.hideLoading();
      if (res.rows.length == 0){
        _this.$setData({
          addressList:[],
          haveData:false
        });
        return;
      }
      let addressItem = [
        { key: 'id' }, { key: 'trueName' }, { key: 'mobile' }, { key: 'area' }, { key: 'area_info' }, { key: 'defaultAddr' }, { key: 'zip' },{key:'street'}
      ],
        addressData = utils.arrangeDataArray(res.rows, addressItem),
        addressList = [];
      addressData.map(function (val) {
        let addressDetail = [];
        let areaObj = val.area;
        if (areaObj && val.street) {
          addressDetail = [areaObj.parent, areaObj.areaName, val.street, val.area_info].join(" ");
        } else if (areaObj){
          addressDetail = [areaObj.parent, areaObj.areaName, val.area_info].join(" ");
        }
        let addressObj = {
          id: val.id,
          name: val.trueName,
          tel: val.mobile,
          address: addressDetail,
          defaultAddress: val.defaultAddr ? val.defaultAddr : false,
          area: val.area,
          area_info: val.area_info,
          zip: val.zip,
          town: val.street
        }
        addressList.push(addressObj);
      });
      if (_this.data.orderCheck){
        for (let i = 0; i < addressList.length;i++){
          addressList[i].checked = addressList[i].id == this.data.checkedid?true:false
        }
      }
      _this.$setData({
        addressList: addressList
      });
    }).catch(res=>{
      wx.hideLoading();
    })
  },
  //新增地址
  bindAddAddress: function () {
    this.$route('addressEdit?isEdit=false&prepage=addrlist');
  },
  // 删除地址
  delAddress: function (id) {
    let _this = this;
    let successFn = res => {
      if (res.cancel) { //点击取消,默认隐藏弹框
      } else { //点击确定
        let params = {
          mulitId: id
        }
        Login.requestWithLogin({ api: Buyer.addressDelete, params, method: 'POST', header }).then(res => {
          if (res) {
            _this.getAddressData();
            if (_this.data.orderCheck && _this.data.checkedid == id){
              _this.data.checkedid = null;
            }
            wx.showToast({
              title: "删除成功",
              icon: 'none'
            });
          } else {
            wx.showModal({
              title: "删除失败",
              content: "删除失败!",
              icon: 'none'
            })
          }
        })
      }
    }
    wx.showModal({
      title: '删除',
      content: '删除后不可恢复，是否继续？',
      cancelText: "否",
      confirmText: "是",
      success: successFn
    })
  },
  //设置为默认地址
  setDefault: function (id) {
    let _this = this;
    let params = {
      id: id
    }
    Login.requestWithLogin({ api: Buyer.addressDefault, params, method: 'POST', header }).then(res => {
      if (res) {
        _this.getAddressData();
        wx.showToast({
          title: "设置成功",
          icon: 'none'
        });
      } else {
        wx.showModal({
          title: "设置失败",
          content: "设置失败!",
          icon: 'none'
        })
      }
    });
  },
  //修改地址
  editAddress: function (addressInfo) {
    let params = JSON.stringify(addressInfo);
    this.$route('addressEdit?isEdit=true&addressInfo=' + params +'&prepage=addrlist');
  },
  bindOrderCheck(e){
    let index = e.currentTarget.dataset.index;
    let addressList = this.data.addressList;
    this.data.checkedid = addressList[index].id;
    for (let i = 0; i < addressList.length;i++){
      addressList[i].checked=i==index?true:false
    }
    this.setData({
      addressList
    })
    setTimeout(()=>{
      this.$back();
    },1000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    if (this.data.orderCheck){
      this.$emit('changeAddr', this.data.checkedid);
    }
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