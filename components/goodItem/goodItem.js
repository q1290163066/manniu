// pages/components/goodItem.js
const utils = require('../../utils/util.js');
Component.C({
  /**
   * 组件的属性列表
   */
  properties: {
    goodData: {
      type:Object,
      value: {}
    },
    inClassify:{
      type: Boolean,
      value:false
    },
    isGift:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    errImg: function (ev) {
      let that = this;
      utils.errorImg(ev, that);
    },
    tapToDetail: function (e) {
      var id = e.currentTarget.dataset.id;
      this.$call('toGoodDetail', id);
    }
  },
  
  attached: function () {
    
  },
  externalClasses: ['itembox-class','observer-class']
})
