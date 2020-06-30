// components/priceBox/priceBox.js
Component.C({
  /**
   * 组件的属性列表
   */
  properties: {
    nowPrice:{
      type:String,
      value:"0"
    },
    lastPrice:{
      type:String,
      value:"0"
    },
    inItem:{
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

  },
  externalClasses: ['newprice-class', 'lastprice-class','pricebox-class']
})
