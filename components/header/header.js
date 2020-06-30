// pages/components/header.js
Component.C({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    logoImg: 'https://jiagy.zerosky.top/resources/style/system/front/wap/jgy/images/jlogo.png',
    placeholder:'输入搜索关键词',
    searchtext:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindSearchGood(e){
      let searchtext = this.data.searchtext;
      if (searchtext=='')return;
      this.$route('goodslist?name=' + searchtext);
    },
    bindInput(e) {
      this.$set({
        searchtext: e.detail.value
      })
    },
  }
})
