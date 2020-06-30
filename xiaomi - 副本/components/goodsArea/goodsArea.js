// pages/components/goodsArea.js
const utils = require('../../utils/util.js');
Component.C({
  /**
   * 组件的属性列表
   */
  properties: {
    areaData:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },


  attached: function () {
    /*const goodDatas = this.data.areaData.items;
    if (!goodDatas)return;
    var inClassify = goodDatas[0].title?true:false;
    var goodDataItem = [
      { key: 'name' }, { key: 'id' }, { key: 'mainPhoto', fn: utils.imgHandle }, { key: 'price', fn: utils.handleMoney }, { key: 'goods_price', fn: utils.handleMoney }
    ];
    var goodDataArr = utils.arrangeDataArray(goodDatas, goodDataItem);
    this.$set({
      "areaData.items": goodDataArr,
      "inClassify": inClassify
    })*/
  },
  /**
 * 组件的方法列表
 */
  methods: {
    errImg: function (ev) {
      let that = this;
      utils.errorImg(ev, that);
    },
    tapToItem: function (e) {
      var id = e.currentTarget.dataset.id;
      this.$call('tapToItem',id);
      //this.$route('goodslist?id=' + id);
    },
    toGoodDetail: function (id) {
      this.$call('toGoodDetail', id);
    }
  }
})
