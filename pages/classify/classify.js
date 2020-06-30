// // pages/classify/classify.js
// var P = require('../../lib/wxpage');
// const utils = require('../../utils/util.js');

// P("classify",{
//   /**
//    * 页面的初始数据
//    */
//   data: {
//     activeTab:0,
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     let that = this;
//     utils.PROMISE('data.htm', { t:true,u:false,i:false,c:true,a:4},"GET").then(function(result){
//       //hotsell
//       let hotsell=result.a[4][0];
//       var goodstab = hotsell.ags;
//       for (let i = 0; i < goodstab.length;i++){
//         goodstab[i].pic = utils.mergePathName(goodstab[i].ag_accessory);
//       }
//       //classify
//       let classify = result.t;
//       //set navlist
//       let navlist = [];
//       navlist[0] = { id: hotsell.id, name: hotsell.ac_title };
//       navlist[1] = { id: 0, name: '全部商品', url: '../goodslist/goodslist' }
//       for (let i = 0; i < classify.length; i++) {
//         var theClassify = classify[i];
//         navlist.push({ id: theClassify.id, name: theClassify.name });
//         //set classify
//         classify[i].pic = utils.imgHandle(theClassify.pic);
//         if (theClassify.items){
//           for (let j = 0; j < theClassify.items.length; j++) {
//             classify[i].items[j].pic = utils.imgHandle(theClassify.items[j].pic);
//           }
//         }
//       }
//       that.$setData({
//         navlist: navlist,
//         goodsTab: goodstab,
//         goodsClassify: classify
//       })
//     })
//   },
//   tabClick: function (e) {
//     if (e.currentTarget.dataset.link){
//       this.$route(e.currentTarget.dataset.link)
//     }else{
//       this.$setData({
//         activeTab: e.currentTarget.dataset.id
//       });
//     }
//   },
//   toGoodsItem:function(e){
//     var id=e.currentTarget.dataset.id;
//     this.$route('goodslist?id='+id);
//   },
//   toGoodsByType:function(e){
//     let id = e.currentTarget.dataset.id;
//     let type = e.currentTarget.dataset.type;
//     switch(type){
//       case 0:
//         this.$route('goodDetail?id=' + id + '&&from=home');
//         break;
//       case 2:
//         this.$route('activity?id=' + id);
//         break;
//       case 4:
//         this.$route('goodslist?id=' + id);
//         break;
//     }
//   },
//   errImg: function (ev) {
//     let that = this;
//     utils.errorImg(ev, that);
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