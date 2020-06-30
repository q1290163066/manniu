export default{
  _listeners:[],
  //前一頁面監聽
  subscribe(listener){
    this._listeners.push(listener);
  },
  //后一页面進行結果回調
  notify(res){
    this._listeners.forEach(listener=>listener(res));
    this._listeners=[];
  }
}