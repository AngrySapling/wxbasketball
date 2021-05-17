const apiUrl = "https://api.it120.cc/mzsx";
const api = require('./request.js');
//轮播
const banner = `${apiUrl}/banner/list`

const indexs = {
  //轮播
  getBanner(data,callback){
    api({url:banner,data}).then((res)=>{
      let data = res.data;
      callback(data)
    }).catch((err)=>{
      showErr(err)
    })
  },
}

function showErr(err) {
  wx.showModal({
    showCancel: false,
    content: err.msg
  });
}
module.exports = indexs;
