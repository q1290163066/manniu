// components/addressPanel/addressPanel.js
Component.C({
  /**
   * 组件的属性列表
   */
  properties: {
    addressInfo:{
      type:Object,
      value:{}
    },
    inlist:{
      type: Boolean,
      value: true
    },
    orderCheck:{
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
    setDefault:function(e){
      this.$set({
        "addressInfo.defaultAddress":true
      })
      this.$call("setDefault", this.data.addressInfo.id);
    },
    editAddress:function(e){
      this.$call("editAddress", this.data.addressInfo);
    },
    delAddress:function(e){
      this.$call("delAddress", this.data.addressInfo.id);
    }
  },
  externalClasses: ["in-access"]
})
