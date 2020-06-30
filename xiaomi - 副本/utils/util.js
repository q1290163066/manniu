/*const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}*/

//network
 //const webUrl = 'https://jiagy.zerosky.top/';
const webUrl ='https://jiagy.zerosky.top/';
//const webUrl = 'https://jiagy.zerosky.top/';

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//格式化时间
const formatTime = date => {
  if (date==null){
    return date;
  }
  if (typeof date == "number") {
    date = new Date(date);
  }
  const now = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  if (now.getFullYear() == year) {
    return [month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
  } else {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
}
//格式化日期
const formatDate=(date,joinicon='-')=>{
  if (date == null) {
    return date;
  }
  if (typeof date == "number") {
    date = new Date(date);
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join(joinicon);
}
const hidePhoneNumber = phone => phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");

const handleMoney= price => {
  if(typeof price=="number"){
    return price.toFixed(2);
  } else if (typeof price == "string"){
    let priceNum = parseFloat(price);
    if (isNaN(priceNum)){
      return '0.00';
    }else{
      priceNum.toFixed(2);
    }
  }else{
    return '0.00'
  }
}

//合并Url
const mergePathName = obj => {
  if (obj&&obj.path!=null && obj.name!=null){
    let thepath = (webUrl + obj.path + '/' + obj.name).replace("\\","/");
    return thepath;
  }else{
    return null;
  }
};

//图片加webUrl
const imgHandle = imgurl => webUrl + imgurl;

/**
 * 数据数组处理
 * @param {array[object]} array 原始数组
 * @param {array[object{key,fn}]} items 需要的数据及处理的方法
 * @return {array[object]} 处理完成的数据对象数组
 */
const arrangeDataArray = (array, items) => {
  var arrayed = [];
  for (let i = 0; i < array.length; i++) {
    var obj = {};
    for (let j = 0; j < items.length; j++) {
      var theObj = array[i];
      var theKey = items[j].key;
      //console.log(typeof theObj[theKey]!='undefined' && typeof theObj[theKey] != 'Object', theKey);
      if (typeof theObj[theKey] != 'undefined' && typeof theObj[theKey]!='Object') {
        if (typeof items[j].fn == 'function') {
          var handleFn = items[j].fn;
          obj[theKey] = handleFn(theObj[theKey]);
        } else {
          obj[theKey] = theObj[theKey];
        }
      }
    }
    arrayed.push(obj);
  }
  return arrayed;
}

const errorImg = (e, that,img='default') => {
  var app = getApp();
  var _errImg = e.target.dataset.errimg;
  var _errObj = {};
  if (img=='user'){
    _errObj[_errImg] = webUrl + app.globalData.userImg;
  }else{
    _errObj[_errImg] = webUrl + app.globalData.defaultImg;
  }
  that.setData(_errObj);
}


//连接失败回调
const failEvent = res => {
  wx.showToast({
    title: '请检查网络连接',
    icon:'none',
    duration:2000
  })
}

/**
 * promise 封装
 * @param {string} api
 * @param {object} params 参数data
 * @param {string} method 属性 GET or POST 默認GET
 * @param {object} header
 * @param {bool} sendId
 */
const PROMISE = (api, params={}, method="GET", header={},sendId=false) => {
  if (sendId) {
    let sessionObj = { "unionid": wx.getStorageSync('sessionId') };
    //let sessionObj = { "unionid": 'ojutz1f8trq-NU0OwbD3qU1bIrVg' };
    params = Object.assign(params, sessionObj);
  }
  params.isxcx='0';
  return new Promise(function (resolve, reject) {
    wx.request({
      url: webUrl + api,
      method: method,
      data: params,
      header:header,
      success: res => {
        if (res.statusCode==200){
          resolve(res.data)
        }else{
          console.error(res.statusCode, api);
          wx.showToast({
            title: '数据加载失败',
            icon: 'none',
            duration: 1000
          })
          reject(res.statusCode)
        }
      },
      fail: res => {
        failEvent(res);
        reject(res.errMsg+api)
      }
    })
  })
}
const GET = (api, params={}, success, header = {}, fail = failEvent, complete) => {
  /*if (sendId) {
    let sessionObj = { "sessionId": wx.getStorageSync('sessionId') };
    params = Object.assign(params, sessionObj);
  }*/
  params.isxcx = '0';
  wx.request({
    url: webUrl+api,
    data: params,
    header: header,
    success: res => success(res),
    fail: res => fail(res),
    complete: function (res) {
      if (typeof complete == "function") {
        complete(res);
      }
    },
  })
}
const POST = (api, params={}, success, header = {}, fail = failEvent, complete) => {
  /*if (sendId) {
    let sessionObj = { "sessionId": wx.getStorageSync('sessionId') };
    params = Object.assign(params, sessionObj);
  }*/
  params.isxcx = '0';
  wx.request({
    url: webUrl + api,
    method: "POST",
    data: params,
    header: header,
    success: res => success(res),
    fail: res => fail(res),
    complete: function (res) {
      if (typeof complete == "function") {
        complete(res);
      }
    },
  })
}
module.exports = {
  webUrl,
  imgHandle,
  arrangeDataArray,
  failEvent,
  handleMoney,
  formatTime,
  formatDate,
  formatNumber,
  errorImg,
  mergePathName,
  PROMISE,
  GET,
  POST,
  hidePhoneNumber
}
