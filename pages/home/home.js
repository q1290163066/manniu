// pages/home/home.js
var P = require('../../lib/wxpage')
const utils=require('../../utils/util.js');
import { Home } from '../../utils/API.js';
P('home',{
  data: {
    banner:[],
    category:[],
    hotSearch:[],
    shopList:[]
  },
  onLoad: function (options) {
    this.getBanner();
    this.getCategory()
    this.getHot()
    this.getShopList()
  },
  getHot(){
    // utils.PROMISE(Home.hotSearch, {}, 'POST').then( (result)=> {
    //   console.log(result)
    // }).catch(function (error) {
    //   console.log(error);
    // })
  },
  getBanner(){
    utils.PROMISE(Home.banner, {}, 'POST').then( (result)=> {
      let banner=result.advertisingList
      banner.forEach(item=>{
        if((item.advertisingImg).indexOf('http')<0){
          item.advertisingImg='http://www.manniushop.com/'+item.advertisingImg
        }
      })
      this.setData({
        banner: banner
      })
      // console.log(banner)
    }).catch(function (error) {
      console.log(error);
    })
  },
  getCategory(){
    utils.PROMISE(Home.category, {}, 'POST').then( (result)=> {
      this.setData({
        category:result.categoryList
      })
    }).catch(function (error) {
      console.log(error);
    })
  },
  getShopList(){
    utils.PROMISE(Home.shopList, {pageSize:6}, 'POST').then( (result)=> {
      console.log(result.goodsList.objects)
      this.setData({
        shopList:result.goodsList.objects
      })
    }).catch(function (error) {
      console.log(error);
    })
  }
})