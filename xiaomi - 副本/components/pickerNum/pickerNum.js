// components/pickerNum/pickerNum.js
Component.C({
  /**
   * 组件的属性列表
   */
  properties: {
    goodNum:{
      type:Number,
      value:1
    },
    pickerIndex:{
      type:Number,
      value:0
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
    bindAdd: function (e) {
      var nowNum = this.data.goodNum + 1;
      /*this.$set({
        goodNum: nowNum
      })*/
      this.$call('changeNum', nowNum, this.data.pickerIndex);
    },
    bindLessen: function (e) {
      var lastNum = this.data.goodNum;
      if (lastNum > 1) {
        var nowNum = lastNum - 1;
        /*this.$set({
          goodNum: nowNum
        })*/
        this.$call('changeNum', nowNum, this.data.pickerIndex);
      } else {
        wx.showToast({
          title: '无法再减啦',
          icon: 'none'
        })
      }
    }
  }
})
