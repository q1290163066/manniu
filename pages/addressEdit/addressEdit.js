// pages/addressEdit/addressEdit.js
var P = require('../../lib/wxpage')
import { Buyer } from '../../utils/API.js'
const utils = require('../../utils/util.js');
import Login from '../../utils/login.js';
const header = { "Content-Type": "application/x-www-form-urlencoded" };

P('addressEdit', {

  /**
   * 页面的初始数据
   */
  data: {
    isEdit:false, //是否是编辑标识
    name: '',
    telNumber: '',
    address: '',
    postcode: '',
    addressId:'', //地址id
    areaId: '', //区域id
    region:["","",""],
    town:null,//街道列表
    townIndex:0,//街道
    showTown: false,
    hasntTown: false,
    areaList:[],
    submiting:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let barTitle = options.isEdit === "true" ? "编辑收货地址" : "添加收货地址";
    if (options.isEdit=='true'){
      this.handleData(options.addressInfo || {}, options.prepage);
    }else{
      this.getAddressArea();
    }
    wx.setNavigationBarTitle({
      title: barTitle,
    })
    this.data.prepage = options.prepage || null;
  },
  handleData(addressInfo = {}, prepage){
    /**
     * @param {string} procity
     * @return {array}
     */
    let _splitProvinceAndCity = (shengCity)=>{
      let editArea=[];
      let provincePos = shengCity.indexOf("省") + 1;
      let cityFirstPos = shengCity.indexOf("市") + 1;
      let cityLastPos = shengCity.lastIndexOf("市") + 1;
      let areaPos = shengCity.indexOf("自治区") + 1;
      if (provincePos) {
        //省
        editArea[0] = shengCity.substring(0, provincePos);
        editArea[1] = shengCity.substring(provincePos, shengCity.length);
      } else if (cityFirstPos && cityLastPos && cityFirstPos !== cityLastPos) {
        //直轄市
        editArea[0] = shengCity.substring(0, cityFirstPos);
        editArea[1] = shengCity.substring(cityFirstPos, cityLastPos);
      } else if (areaPos) {
        //自治區
        editArea[0] = shengCity.substring(0, areaPos+2);
        editArea[1] = shengCity.substring(areaPos+2, shengCity.length);
      }
      return editArea;
    }
    let townname = null, editArea = [];
    if (prepage === "order") {
      let addressData = this.$take('theAddress');
      addressInfo.name = addressData.trueName;
      addressInfo.tel = addressData.mobile;
      editArea = _splitProvinceAndCity(addressData.area.parent);
      editArea.push(addressData.area.areaName);
      addressInfo.area_info = addressData.area_info;
      addressInfo.zip = addressData.zip;
      addressInfo.areaid = addressData.area.id;
      addressInfo.id = addressData.id;
      townname = addressData.street||null;
    } else {
      addressInfo = JSON.parse(addressInfo);
      editArea = _splitProvinceAndCity(addressInfo.area.parent)
      editArea.push(addressInfo.area.areaName);
      addressInfo.areaid = addressInfo.area.id;
      townname = addressInfo.town || null;
    }
    this.$setData({
      isEdit: true,
      name: addressInfo.name,
      telNumber: addressInfo.tel,
      region: editArea,
      address: addressInfo.area_info,
      postcode: addressInfo.zip||'',
      areaId: addressInfo.areaid,
      addressId: addressInfo.id
    });
    
    this.getAddressArea(townname);
  },
  getAddressArea(townname) {//地区数据
    let areas = wx.getStorageSync('areas');
    let towns=wx.getStorageSync('towns');
    if (areas){
      this.data.areaList = areas;
    }else{
      Login.requestWithLogin({ api: Buyer.addressEdit, method: 'POST', header }).then(result => {
        this.data.areaList = result.areas;
      });
    }
    if (towns){
      this.data.townData = towns;
      this.getTownArrayByRegion(undefined, townname);
    }else{
      utils.PROMISE('upload/nationalStreet.json').then(res => {
        this.data.townData = res;
        this.getTownArrayByRegion(undefined, townname);
      })
    }
  },
  bindRegionChange: function (e) { //地区对应的id
    let _this = this;
    let areaArr = e.detail.value;
    let parentAreaName = areaArr[0] + areaArr[1];
    let areaName = areaArr[2];
    let areaList = this.data.areaList;
    let theArea = areaList.filter(item=>{
      return item.areaName === areaName && item.parent === parentAreaName;
    })
    if (theArea.length==0){
      wx.showToast({
        title: '不支持该地址',
        icon:'none'
      })
      return;
    }
    _this.$setData({
      areaId: theArea[0].id,
      region: areaArr,
      town:null,
      hasntTown: false
    });
    _this.getTownArrayByRegion(areaArr);
    /*if (areaArr[0] == '广东省' && areaArr[1] == '广州市') {
      _this.$setData({
        areaId: theArea[0].id,
        region: areaArr
      });
      _this.getTownArrayByRegion(areaArr);
    } else {
      _this.setData({
        town: null,
        townIndex: 0,
        areaId: theArea[0].id,
        region: areaArr
      })
    }*/
  },
  getTownArrayByRegion(region,thetown){
    let townData = this.data.townData;
    region =region||this.data.region;
    let theProviceId = this.getIdByRegion(townData.city, region[0]);
    if (!theProviceId)return;
    let theCityId = this.getIdByRegion(townData[theProviceId],region[1]);
    if (!theCityId) {
      this.setData({
        showTown: false,
        hasntTown: true
      })
      return;
    }
    let theAreaId = this.getIdByRegion(townData[theCityId], region[2]);
    if (!theAreaId){
      this.setData({
        showTown:false,
        hasntTown:true
      })
      return;
    }
    let town=[];
    for (let i in townData[theAreaId]){
      town.push(townData[theAreaId][i]);
    }
    let townIndex = thetown ? town.indexOf(thetown):0;
    this.setData({
      showTown: true,
      town,
      townIndex
    })
  },
  getIdByRegion(regionObj,region){
    for(let i in regionObj){
      if(regionObj[i]==region){
        return i;
      }
    }
    return null;
  },
  bindTownChange(e){
    this.setData({
      townIndex: e.detail.value
    })
  },
  // 收货人
  bindNameChange: function (e) {
    this.$setData({
      name: e.detail.value
    })
  },
  // 手机号码
  bindTelChange: function (e) {
    this.$setData({
      telNumber: e.detail.value
    });
  },
  // 详细地址
  bindDetailAddressChange: function (e) {
    this.$setData({
      address: e.detail.value
    });
  },
  // 邮政编码
  postalCode: function (e) {
    // let regText = /^[0-9]*$/;
    // if (!(regText.test(postalCodeNumber))) {
    //   wx.showToast({
    //     title: "邮政编码错误",
    //     duration: 3000
    //   });
    //   this.$setData({
    //     postcode: ""
    //   });
    //   return false;
    // }
    this.$setData({
      postcode: e.detail.value
    });

  },
  bindSubmit: function (e) {
    if (this.data.submiting) return;
    this.data.submiting = true;
    let _this = this;
    let { name, postcode, areaId, telNumber, address, addressId, town, townIndex, hasntTown} = this.data;
    if (!name || !telNumber || !areaId || !address) {
      wx.showToast({
        title: "请把信息填写完整",
        duration: 3000,
        icon: 'none'
      })
      _this.data.submiting = false;
      return false;
    }
    //检查手机号码
    let regText = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!(regText.test(telNumber))) {
      wx.showToast({
        title: "手机号码错误",
        icon: 'none',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }
      });
      _this.data.submiting = false;
      return;
    }
    //检查收货人名称
    let nameReg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
    if (!nameReg.test(name)||name.indexOf('女士')!==-1||name.indexOf('先生')!==-1){
      wx.showToast({
        title: "请填写真实姓名",
        icon: 'none',
        duration: 2000,
        success:()=>{
          setTimeout(()=>{
            wx.hideToast();
          },2000)
        }
      });
      _this.data.submiting = false;
      return;
    }
    let params = {
      trueName: name,
      mobile: telNumber,
      zip: postcode,
      area_info: address,
      area_id: areaId,
      id: addressId,
      street: town&&!hasntTown ? town[townIndex]:null
    }
    
    wx.showLoading({
      title: '处理中',
      mask:true
    })
    Login.requestWithLogin({ api: Buyer.addressSave, params:params, method: 'POST', header }).then(result => {
      wx.hideLoading();
      if (!result){
        _this.data.submiting = false;
        return false;
      } 
      let seccessTextTip = _this.data.isEdit === true ? "修改成功！" : "添加成功！";
      wx.showToast({
        title: seccessTextTip,
        duration: 1500,
        success:()=>{
          setTimeout(()=>{
            //_this.backUpPage();
            _this.data.submiting = false;
            wx.hideToast();
            _this.$back();
          },1500)
        }
      });
    }).catch(function (error) {
      console.log(error);
    })

  },
  // 返回上一级 并刷新数据
  /*backUpPage: function () {
    var pages = getCurrentPages();//当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.changeData();//触发父页面中的方法
    }
    wx.navigateBack({
      delta: 1
    });
  },*/
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
    if(this.data.prepage=="order"){
      this.$emit('changeAddr', this.data.addressId);
    }else if(this.data.prepage=="addrlist"){
      this.$emit('updateAddr');
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