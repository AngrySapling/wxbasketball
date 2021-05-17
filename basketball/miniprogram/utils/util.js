
  //时间转换
  const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//网络请求
// fetch.js
const api = (api, path, params, method)=>{  //暴露接口才可以引入
  // wx.showLoading({
  //   title: '加载中',
  // })
  return new Promise((resolve, reject) => {
    let token = wx.getStorageSync('token');
    let header;
    let ContentType = ""
    ContentType = 'application/x-www-form-urlencoded;charset=UTF-8'
    if (token) {
      header = {
        'Content-type': ContentType,
        'x-token': token
      };
    } else {
      header = {
        'Content-type': ContentType
      };
    }
    wx.request({
      url: `${api}`+path,  //api地址
      method: method,  // 请求方法
      data: params,   // 参数
      header:header, //请求头，默认
      success:function(res){
        if(res.data.code === 2000){
          console.log(20000)
          // wx.redirectTo({
          //   url: '../start/start'
          // })
        }else{
          resolve(res)
        }
      } ,
      fail: reject
    })
  })
}

//路由拦截


module.exports = {
  formatTime: formatTime,
  api: api
}