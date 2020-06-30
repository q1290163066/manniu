const utils = require('util.js');
const nameGroup = [{
    "new": "mainPhoto",
    "old": "goods_main_photo"
  },
  {
    "new": "name",
    "old": "goods_name"
  },
  {
    "new": "price",
    "old": "store_price"
  }
]
/**
   * change object's key name
   * @param {object} obj
   * @param {array[object]} nameGroup {"new":{new name},"old":{last name}}
   */
const changeKeyName= (obj, nameGroup) => {
  for (let i = 0; i < nameGroup.length; i++) {
    var newKey = nameGroup[i].new;
    var oldKey = nameGroup[i].old;
    if (obj[oldKey]){
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
  }
  return obj;
}
/**
 * @param {array} goodList
 * @return {array} goodList
 */
const buildGoodData = (goodList) => {
    let app = getApp();
    let defaultImg = utils.webUrl + app.globalData.defaultImg
    for (let i = 0; i < goodList.length; i++) {
      goodList[i] = changeKeyName(goodList[i], nameGroup);
      goodList[i].mainPhoto = goodList[i].mainPhoto ? utils.mergePathName(goodList[i].mainPhoto) :defaultImg;
      goodList[i].goods_price = utils.handleMoney(goodList[i].goods_price);
      goodList[i].price = utils.handleMoney(goodList[i].price);
    }
  return goodList;
}

module.exports.buildGoodData=buildGoodData;
