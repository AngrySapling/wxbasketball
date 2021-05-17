
// var index = location.href.indexOf("/zyywx");
// q3Url = location.href.substring(0, index);
// const url = q3Url +"/Rest.aspx";
const url = "https://api.it120.cc/mzsx";
// let url = "http://localhost:2000/MainSystem/Rest.aspx"
const request = require('./util.js')
let Api = request.api;
//get请求
const Get = (path,params)=>{
  return Api(url,path,params,'GET')
}

const Post = (path,params)=>{
  return Api(url,path,params,'POST')
}
module.exports = {Get,Post}