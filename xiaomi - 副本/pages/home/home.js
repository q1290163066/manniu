// pages/home/home.js
var P = require('../../lib/wxpage')
const utils=require('../../utils/util.js');
import { Home } from '../../utils/API.js';
P('home',{
  /**
   * 页面的初始数据
   */
  data: {
    //goodsSwiper
    autoplay: true,
    indicatorColor: '#c7c7c7',
    indicatorActive: '#1abc9c',
    menuList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchMenu();
    this.fetchData();
    
  },
  fetchMenu(){
    utils.PROMISE(Home.fetchMenu,{type:3},'GET').then(res=>{
      let menuList=res.act.ags.map(item=>({
        pic: utils.mergePathName(item.ag_accessory),
        id:this.getPathByType(item.ag_type),
        name:item.ag_text
      }))
      this.$setData({
        menuList
      })
    })
  },
  getPathByType(type){
    switch(type){
      //活動
      case 2:
      return 'activity';
      //商品分類
      case 4:
      return 'goodslist';
      //我的錢包
      case 7:
      return 'wallet';
      //優惠券
      case 8:
      return 'coupon';
      //我的訂單
      case 11:
      return 'orderlist';
      //積分商城
      case 25:
      return 'integralMall';
    }
  },
  fetchData(){
    let _this = this;
    utils.PROMISE(Home.banner, {}, 'POST').then(function (result) {
      // var goodswiper = [], goodarea = [], goodrecommend = [];
      // var goodswiperitem = [
      //   { key: 'text' }, { key: 'pic', fn: utils.imgHandle }, { key: 'url' }
      // ]
      // goodswiper = utils.arrangeDataArray(result.s, goodswiperitem);
      // var goodareaitem = [
      //   { key: 'id' }, { key: 'name' }, { key: 'pic', fn: utils.imgHandle }
      // ]
      // goodarea = utils.arrangeDataArray(result.t, goodareaitem);
      // goodarea = _this._classifyArea(goodarea, result.r);
      // if (result.a1[0]) {
      //   goodrecommend = result.a1[0].ags;
      //   for (let i = 0; i < goodrecommend.length; i++) {
      //     goodrecommend[i].pic = utils.mergePathName(goodrecommend[i].ag_accessory);
      //   }
      // }
      console.log(result)
      // _this.$setData({
      //   goodSwiperImg: goodswiper,
      //   goodsRecommend: goodrecommend,
      //   goodsArea: goodarea
      // })
    }).catch(function (error) {
      console.log(error);
    })
  },
  //产品分类
  // _classifyArea:function(areas,goods){
  //   var id;
  //   var goodDataItem = [
  //     { key: 'name' }, { key: 'id' }, { key: 'mainPhoto', fn: utils.imgHandle }, { key: 'price', fn: utils.handleMoney }, { key: 'goods_price', fn: utils.handleMoney }
  //   ];
  //   for(let i=0;i<areas.length;i++){
  //     id=areas[i].id;
  //     if (goods[id]){
  //       areas[i].items = utils.arrangeDataArray(goods[id], goodDataItem);
  //     }
  //   }
  //   return areas;
  // },
  // errImg:function(ev){
  //   let that=this;
  //   utils.errorImg(ev,that);
  // },
  // tapToItem: function (id) {
  //   this.$route('goodslist?id=' + id);
  // },
  // toGoodDetail:function(id){
  //   this.$route('goodDetail?id=' + id+'&&from=home');
  // },
  // swiperToDetail:function(e){
  //   var url=e.currentTarget.dataset.url;
  //   if (url.indexOf('goods_list') !== -1) {
  //     //商品列表
  //     let id = url.substr(url.length - 5, 5);
  //     this.$route('goodslist?id=' + id);
  //   } else if (url.indexOf('activity') !== -1) {
  //     //活動
  //     let idArr = url.split('id=');
  //     this.$route('activity?id=' + idArr[1]);
  //   } else if (url.indexOf('gc_id') == -1&&url.indexOf('goods')!==-1) {
  //     //商品詳情
  //     url = url.split('_');
  //     let id = url[1].split('.');
  //     this.$route('goodDetail?id=' + id[0] + '&&from=home')
  //   }
  // },
  // goodToDetail:function(e){
  //   let id=e.currentTarget.dataset.id;
  //   if(!id)return;
  //   let type = e.currentTarget.dataset.type;
  //   switch(type){
  //     //商品
  //     case 0:
  //       this.$route('goodDetail?id=' + id + '&&from=home');
  //       break;
  //     //活動
  //     case 2:
  //       this.$route('activity?id='+id);
  //       break;
  //     //積分商城
  //     case 25:
  //       this.$route('integralMall');
  //       break;
  //     //商品列表
  //     case 4:
  //     case 20:
  //     case 21:
  //     case 22:
  //       this.$route('goodslist?id=' + id);
  //       break;
  //   }
  // },
  // bindToPage(e){
  //   let id = e.currentTarget.dataset.id;
  //   if(id){
  //     this.$route(id);
  //   }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})