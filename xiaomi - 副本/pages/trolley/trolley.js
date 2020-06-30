// pages/trolley/trolley.js
var P = require('../../lib/wxpage.js');
const utils = require('../../utils/util.js');
const buildGood = require('../../utils/buildgooddata.js');
import Login from '../../utils/login.js';
import { Trolley} from '../../utils/API.js'

let handledataing=false;
const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
P('trolley',{

  /**
   * 页面的初始数据
   */
  data: {
    goodsdata:[],
    allchose:true,
    desc:'会员享有此订单折扣价',
    price:'0.00',
    integral:'0',
    hasFetch:false
  },
  fetchData:function(){
    //let res = Login.checkLogin();
    //console.log(res);
    return Login.requestWithLogin({ api: Trolley.fetch});
  },
  onNavigate:function(){
    this.$put('goodsObj',this.fetchData());
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    handledataing = true;
    this.startHandleData();
  },
  startHandleData() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    var goodObj = this.$take('goodsObj') || that.fetchData();
    goodObj.then(function (result) {
      wx.hideLoading();
      if (result == false) return;
      if (result&&result.cart.length > 0) {
        that.handleData(result.cart[0]);
      } else {
        that.setData({
          goodsdata: [],
          hasFetch: true
        })
      }
      handledataing = false;
    })
  },
  handleData(cart){
    let goodAllList = cart.gcs;
    let goodList=[];
    let allchose=true;
    for (let i = 0; i < goodAllList.length;i++){
      let good = goodAllList[i].goods;
      //goodList.push(goodAllList[i].goods);
      delete goodAllList[i].goods;
      //括號內描述
      good.desc = goodAllList[i].spec_info ? goodAllList[i].spec_info:good.title;
      //紅字提示
      good.tip = goodAllList[i].cart_state?'':'已失效';
      //購物車內商品ID
      good.trolleyId = goodAllList[i].id;
      //商品價格
      good.theprice = goodAllList[i].price;
      if (goodAllList[i].selected==false){
        allchose=false;
      }
      goodList.push({ ...goodAllList[i], ...good});
    }
    goodList = buildGood.buildGoodData(goodList);
    this.setData({
      goodsdata: goodList,
      price: cart.total_price.toFixed(2),
      integral: cart.total_integral,
      storeId: cart.store_id,
      allchose,
      hasFetch: true
    })
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
    if (handledataing == false){
      this.startHandleData();
    }
  },
  /**
   * 修改購物車
   */
  changeTrolley(goods, changeOptions, callback){
    wx.showLoading({
      title: '加载中',
    })
    let _this = this;
    let options=this.getGoodsIdNumCheck(goods);  
    Login.requestWithLogin({ api: Trolley.change, params: options, method:'POST', header}).then(res=>{
      wx.hideLoading();
      let tiptype=res.filter(item=>{
        return item.error!='100';
      })
      if (tiptype.length==0){
        if (typeof callback == 'function') {
          callback(res);
        }
      }else{
        let msg='';
        switch (tiptype[0].error) {
          case '150':
            msg ='不可大于团购数量，请重新选择数量！';
            restoreGoodData(changeOptions)
            break;
          case '200':
            msg = '有商品库存不足，请重新选择数量！';
            restoreGoodData(changeOptions)
            break;
          case '300':
            msg = '团购库存不足，请重新选择数量！';
            restoreGoodData(changeOptions)
            break;
          case '250':
            msg = '不可大于抢购数量，请重新选择数量！';
            restoreGoodData(changeOptions)
            break;
        }
        wx.showToast({
          title: msg,
          icon:'none'
        })
        
      }
    })

    function restoreGoodData(options){
      if (Object.keys(options).length == 0) return;
      let goodData = _this.data.goodsdata;
      goodData[options.pickerIndex].count = options.lastCount;
      _this.$setData({
        goodsdata: goodData
      });
    }
  },
  /**
   * 獲取商品id count selected
   * @param {array} goods
   * @param {string} options
   */
  getGoodsIdNumCheck(goods){
    if (!Array.isArray(goods)){
      goods = [goods];
    }
    let storeId = this.data.storeId;
    let options={
      cart_id: [],
      count: [],
      selected: [],
      store_id: []
    };
    goods.forEach(item=>{
      options.cart_id.push(item.trolleyId);
      options.count.push(item.count);
      options.selected.push(item.selected);
      options.store_id.push(storeId)
    })
    return options;
    //console.log(optionStr.slice(2));
    //return optionStr.slice(2);
  },
  /**
   * 計算商品總價格
   * @param {array} newGoodsData 商品信息
   * @param {string} prices 總價格
   */
  countGoodsPrice:function(newGoodsData){
    let goods = newGoodsData||this.data.goodsdata,prices=0;
    for(let i=0;i<goods.length;i++){
      if (goods[i].selected){
        //let price = parseFloat(goods[i].theprice);
        //prices += price * parseInt(goods[i].count);
        //console.log(goods[i].rate_total_price || goods[i].subtotal);
        prices += typeof goods[i].rate_total_price == 'number' ? goods[i].rate_total_price : goods[i].subtotal;
      }
    }
    return prices.toFixed(2)+'';
  },
  /**
   * 修改商品数量
   */
  changeNum: function (goodNum,pickerIndex) {
    let goods=this.data.goodsdata;
    let lastCount = goods[pickerIndex].count;
    goods[pickerIndex].count = goodNum;
    this.changeTrolley(goods, { pickerIndex, lastCount}, (res)=>{
      goods[pickerIndex].subtotal = res[pickerIndex].rate_total_price;
      let lastindex = res.length - 1;
      this.$setData({
        goodsdata: goods,
        price: this.countGoodsPrice(res),
        integral: res[lastindex].goods_total_integral
      });
    });
  },
  /**
   * 商品选择
   */
  bindCheckBoxChange:function(e){
    var checkboxItems = this.data.goodsdata, values = e.detail.value,allchose=false;
    let selectedNum = 0, lenI = checkboxItems.length;
    for (let i = 0; i < lenI; ++i) {
      checkboxItems[i].selected = false;
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].trolleyId == values[j]) {
          checkboxItems[i].selected = true;
          selectedNum+=1;
          break;
        }
      }
    }
    allchose = selectedNum === lenI ? true : false;
    this.changeTrolley(checkboxItems, {}, (res)=>{
      let lastindex = res.length - 1;
      this.$setData({
        goodsdata: checkboxItems,
        price: this.countGoodsPrice(res),
        allchose,
        integral: res[lastindex].goods_total_integral
      });
    });
  },
  /**
   * 删除商品
   */
  deleteGood:function(e){
    let goodindex = e.currentTarget.dataset.index;
    let gooditems = this.data.goodsdata;
    let options={
      id: gooditems[goodindex].trolleyId,
      store_id: this.data.storeId
    }
    
    utils.PROMISE(Trolley.remove, options, 'POST', header).then(res=>{
      if(res.count==0){
        gooditems.splice(goodindex, 1);
        this.$setData({
          goodsdata: gooditems,
          price: this.countGoodsPrice(gooditems),
          integral: parseInt(this.data.integral)-res.total_integral
        })
      }else{
        wx.showToast({
          title: '刪除失败',
          icon:'none'
        })
      }
    })
    
  },
  /**
   * 全选
   */
  choseAll:function(e){
    var gooditems = this.data.goodsdata;
    var choseBool = this.data.allchose;
    if (choseBool){
      for (let i = 0; i < gooditems.length;i++){
        gooditems[i].selected=false;
      }
    }else{
      for (let i = 0; i < gooditems.length; i++) {
        gooditems[i].selected = true;
      }
    }
    this.changeTrolley(gooditems, {}, (res)=>{
      let lastindex=res.length-1;
      this.$setData({
        goodsdata: gooditems,
        allchose: !choseBool,
        price: this.countGoodsPrice(gooditems),
        integral: res[lastindex].goods_total_integral
      })
    });
  },
  /**
   * 结算
   */
  bindSettlement:function(e){
    let goodsdata = this.data.goodsdata;
    let orderGoods = [];
    for (let i = 0; i < goodsdata.length; i++) {
      let thegood = goodsdata[i];
      /*if (!thegood.cart_state){
        wx.showModal({
          title: '提示',
          content: '结算商品中有商品已失效，请删除后重新结算',
          showCancel:false
        })
        return;
      }*/
      /*if (thegood.count > thegood.goods_inventory){
        wx.showModal({
          title: '提示',
          content: '结算商品中有商品库存不足，请调整数量后重新结算',
          showCancel: false
        })
        return;
      }*/
      if (thegood.selected) {
        orderGoods.push(thegood);
      }
    }
    if (orderGoods.length==0){
      wx.showToast({
        title: '请选择需结算的商品',
        icon:'none'
      })
      return;
    }
    wx.showLoading({
      title: '处理中',
    })
    Login.requestWithLogin({ api: Trolley.checkGoods, params: { sc_id: this.data.storeId}}).then(res=>{
      wx.hideLoading();
      if(res.error){
        let tip='';
        let tipcode = parseInt(res.error);
        switch (tipcode){
          case 100:
            tip ='已失效，';
          break;
          case 200:
            tip ='库存不足，';
          break;
        }
        wx.showToast({
          title: res.sms + tip +'请删除后重新结算',
          icon: 'none',
          duration:2000
        })
      }else{
        this.$route("confirmOrder?storeId=" + this.data.storeId);
      }
    })
    
    /*let params={
      store_id:this.data.storeId
    };
    let settlement = Login.requestWithLogin({ api: Trolley.settlement, params});
    settlement.then(result=>{
      console.log(result);
      
      //this.$put('address',result.addrs);
      //this.$put('orderGoods', orderGoods);
      this.$route("confirmOrder?storeId=" + this.data.storeId);
    })*/
  },
  bindToGoodDetail:function(e){
    let goodId=e.currentTarget.dataset.id;
    //let goodIndex = e.currentTarget.dataset.index;
    this.$route('goodDetail?id=' + goodId + '&&from=home');
    //console.log(e);
    //this.$put('theGoodDetail', this.data.goodsdata[goodIndex]);
    //this.$route('goodDetail?id=' + goodId);
  },
  bindToHome(){
    this.$switch('home');
  },
  //綁定默認圖片
  errImg:function(ev){
    let that = this;
    utils.errorImg(ev, that);
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