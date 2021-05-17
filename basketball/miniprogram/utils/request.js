const api = require("./api.js");
// 分类

  //获取商品分类
  const getList = (callback)=>{
    let token = wx.getStorageSync("token")
    api.Get("/shop/goods/category/all?token=" + token).then((res) => {
      console.log(res)
      let data = res.data.data;
      callback(data)
    })
  }

  //商品列表
  const getShopList = (id,page,pageSize,callback)=>{
    api.Post("/shop/goods/list", {
      categoryId: id,
      page: page,
      pageSize:pageSize
    }).then((res) => {
      callback(res)
    })
  }

  //搜索
const getSearchList = (val, page, pageSize, callback) => {
  api.Post("/shop/goods/list", {
    nameLike: val,
    page: page,
    pageSize: pageSize
  }).then((res) => {
    callback(res)
  })
}
module.exports = {
  getShopList,
  getList,
  getSearchList
}