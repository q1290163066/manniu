/**
 * @desc
 * login code
 * 1 hasnt tel
 * 0 success
 * -1 wx login fail,cant get code
 * -2 user refuse Auth
 * -3 cant get userinfo
 * -4 login fail
 */
const utils = require('../utils/util.js');
import userAuthHub from '../utils/userAuthHub.js';
const regeneratorRuntime = require('../lib/runtime.js');
import {Buyer} from '../utils/API.js';
/**
 * 步骤合并
 */
/*function mergingStep(target,name,descriptor){
  let oriFunc=descriptor.value;
  let runningInstance=null;
  descriptor.value=function(...args){
    if(runningInstance)return runningInstance;
    let res=oriFunc.apply(this,args);
    if(!(res instanceof Promise))return res;
    runningInstance=res;
    runningInstance.then(()=>{
      runningInstance=null;
    }).catch(()=>{
      runningInstance=null;
    })
    return runningInstance;
  }
}*/
export default class Login {
  static _loginSingleton=null;
  /**
   * 登录
   */
  static async login() {
    let checkRes = await Login.checkLogin();
    let checkTel = Login.checkTel();
    if (checkRes){
      if (checkTel){
        return { code: 0 }
      }else{
        return { code: 1 }
      }
    } 
    //若当前有登录流程正在进行，则直接使用其结果作为本次登录结果
    if (Login._loginSingleton) return Login._loginSingleton;
    //否则触发登录流程
    Login._loginSingleton = Login._login();
    //并在登录结束时释放并发限制
    Login._loginSingleton.then(() => { 
      Login._loginSingleton = null 
      }).catch(() => {
        Login._loginSingleton = null 
      });

    //返回登录结果      
    return Login._loginSingleton;
  }
  /**
   * 要求登录态的数据请求
   * @param {Object} options {api params method header}
   * @return {Promise} resolve 请求结果 reject 请求详情
   */
  static async requestWithLogin(options){
    let loginRes=await Login.login();
    if (loginRes.code != 0 && loginRes.code != 1){
      let handleFn = Login._handleCondition;
      switch (loginRes.code){
        //wx login fail,cant get code
        case -1:
          throw new Error('login failed, wx login fail,cant get code');
        //user refuse Auth
        case -2:
          handleFn.refuseAuth();
          return false;
        //cant get userinfo
        case -3:
          throw new Error('login failed, cant get userinfo');
        //login fail
        case -4:
          await handleFn.loginFail();
          return false;
      }
      //throw new Error('login failed, request not sent:' + options.api);
    } else if (loginRes.code == 1){
      if (Login.istTel(options.api)) {
        let bindtelRes = await Login._handleCondition.hasntTel();
        if (bindtelRes.successed==false)return;
      }
    }
    let resp = await utils.PROMISE(options.api, options.params, options.method, options.header,true);
    //若后端登录态正常，则正常返回数据请求结果
    //if(!Login._config.apiAuthFail(resp,options))
    return resp;
    //若后端登录态过期
    //重置前端登录态，保证后续再次调用login时会真正执行登录环节
    //Login._clearLoginInfo();  
    //return Login.requestWithLogin(options);
  }

  /**
   * 检查前端登录态
   */
  static async checkLogin(){
    let session = wx.getStorageSync("sessionId");
    if(session){
      let checkRes = await _checkSession();
      return checkRes;
    }else{
      return false;
    }
    async function _checkSession(){
      return new Promise((resolve, reject) => {
        wx.checkSession({
          success: () => { resolve(true) },
          fail: () => { resolve(false) }
        })
      })
    }
  }

  static checkTel(){
    let user=wx.getStorageSync('user');
    if(user.mobile||user.telephone){
      return true;
    }else{
      return false;
    }
  }

  static istTel(api){
    if (api != Buyer.getCode && api != Buyer.updateTel){
      return true;
    }
    return false;
  }

  static _handleCondition={
    async hasntTel(){
      let bindPhoneRes = await Login._loginSteps.openBindPhone();
      return new Promise((resolve,reject)=>{
        if (!bindPhoneRes.successed) {
          wx.showToast({
            title: '为了更好的体验请绑定手机',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/home/home'
                })
                wx.hideToast();
                resolve(false);
              }, 1400)
            }
          })
        }else{
          resolve(true);
        }
      })
    },
    refuseAuth(){
      wx.showToast({
        title: '为了更好的体验请授权',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/home'
            })
          }, 1400)
        }
      })
    },
    async loginFail(){
      let netStatus=true;
      /*if (typeof wx.onNetworkStatusChange=='function'){
        netStatus = await Login._handleCondition.checkNet();
      }*/
      if (!netStatus){
        wx.showToast({
          title: '服务器开小差了~',
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/home/home'
              })
            }, 1400)
          }
        })
      }
    },
    async checkNet(){
      console.log('net');
        return new Promise((resolve, reject) => {
          wx.onNetworkStatusChange(function (res) {
            console.log(res);
            if (!res.isConnected) {
              wx.showToast({
                title: '请检查网络连接',
                icon: 'none'
              })
              resolve(false);
            } else {
              if (res.networkType == '2g') {
                wx.showToast({
                  title: '网络情况不太好哦~',
                  icon: 'none'
                })
                resolve(false);
              } else {
                resolve(true);
              }
            }
          })
        }) 
    }
  }

  static _loginSteps={
    /**
     * 微信登錄
     * @return {Promise<Object>} 用戶標識
     */
    //@mergingStep
    wxLogin(){
      return new Promise((resolve,reject)=>{
        wx.login({
          success(res){
            resolve(Object.assign(res,{successed:true}))
          },
          fail(res){
            resolve(Object.assign(res,{successed:false}))
          }
        })
      })
    },
    /**
     * 静默登录
     */
    //@mergingStep
    async silentLogin({wxLoginRes}){

    },
    /**
     * 獲取用戶信息
     * @return {Promise<Object>} 用戶信息
     */
    
    requestUserInfo(){
      return new Promise((resolve,reject)=>{
        wx.getSetting({
          success(res){
            if (res.authSetting['scope.userInfo']){
              //用户同意授权
              wx.getUserInfo({
                success(res){
                  resolve(Object.assign(res, { successed: true}))
                },
                fail(res){
                  resolve(Object.assign(res, { successed: false }))
                }
              })
            }else{
              //用户拒绝授权
              resolve(Object.assign(res, { successed: false, message:'Refuse' }))
            }
          }
        })
      })
    },
    //提示授權
    tipAuth(){
      return new Promise((resolve,reject)=>{
        wx.showToast({
          title: '小程序需要您的微信授权才能使用哦~',
          icon: 'none',
          mask:true,
          duration:1500,
          success:()=>{
            setTimeout(()=>{
              resolve()
            },1200)
          }
        })
      })
    },
    //打開授權面板
    async openSetting(){
      let userInfoRes = await new Promise((resolve, reject) => {
        userAuthHub.subscribe(resolve);
        wx.navigateTo({
          url: '/pages/index/index',
        })
        //this.$route('index');
      })
      return userInfoRes;
    },
    //打開綁定手機面板
    async openBindPhone(){
      let bindPhoneRes=await new Promise((resolve,reject)=>{
        userAuthHub.subscribe(resolve);
        wx.navigateTo({
          url: '/pages/bindtel/bindtel?login=true',
        })
      })
      return bindPhoneRes;
    }
  }
  /**
   * 授權登錄
   */
  static async _login(){
    let steps=Login._loginSteps;
    //微信登錄
    let wxLoginRes=await steps.wxLogin();
    if(!wxLoginRes.successed)return {code:-1};

    //獲取微信用戶信息
    let userInfoRes=await steps.requestUserInfo();
    //獲取信息失敗
    if (!userInfoRes.successed && userInfoRes.message==='Refuse'){
      //提示授權
      //await steps.tipAuth();
      //打開授權面板
      let settingRes=await steps.openSetting();
      //依然拒絕授權
      if(!settingRes.successed){
        return {code:-2};
      }else{
        //同意授權
        userInfoRes = settingRes.data;
      }
      //其他原因導致授權失敗
    } else if (!userInfoRes.successed){
      return { code: -3 };
    } 

    //获取用户信息成功
    let params={
      encryptedData: userInfoRes.encryptedData,
      iv: userInfoRes.iv,
      code: wxLoginRes.code
    }
    let loginResp=await utils.PROMISE('mpauth.htm', params, 'POST', { 'Content-Type':'application/x-www-form-urlencoded'});
    if (loginResp.result==0){
      wx.setStorageSync('sessionId', loginResp.unionid);
      wx.setStorageSync('openId', loginResp.openId);
      wx.setStorageSync('user', loginResp.user);
      if (!wx.getStorageSync('userInfo')){
        wx.setStorageSync('userInfo', userInfoRes.userInfo);
      }
      if (loginResp.user.telephone || loginResp.user.mobile){
        return { code: 0 };
      }else{
        return {code:1};
      }
    }else{
      return {code:-4};
    }
  }
}