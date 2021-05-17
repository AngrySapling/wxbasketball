/**
 * 定义url与session
 */
const apiUrl = "https://api.it120.cc/mzsx";
let Token = "";

let Options = {
  url:'',
  data:{},
  header:{
    "Content-Type": "application/x-www-form-urlencoded"
  },
  methods:"GET",
  dataType:"json"
}

/**
 * 判断请求状态是否成功
 * 参数：http状态码
 * 返回值：[Boolen]
 */
function isHttpSuccess(status) {
  return status >= 200 && status < 300 || status === 304;
}

/**
 * promise请求
 * 参数：参考wx.request
 * 返回值：[promise]res
 */
function requestP(opt = {}) {
 
  let options = Object.assign({}, Options, opt);
  let {url,data, header, method, dataType, responseType, } = options;
  console.log(url,778899)
  //对请求头进行写入sessionId
  // let header = Object.assign({
  //   sessionId: sessionID
  // }, options.header);
  return new Promise((res, rej) => {
    wx.request({
      url,
      data,
      header,
      method,
      dataType,
      success(r){
        const isSuccess = isHttpSuccess(r.statusCode);
        if (isSuccess) {  // 成功的请求状态
          res(r.data);
        } else {
          rej({
            msg: `网络错误:${r.statusCode}`,
            detail: r
          });
        }
      },
      //失败调用的是网络丢包等而不是400,500错误
      fail: rej,
    });
  });
}

//进行注册
function regester(code,referrer){
  return new Promise((res,rej)=>{
    requestP({
      url: `${apiUrl}/user/wxapp/register/simple`,
      data: { code: code,},
      method: 'POST',
    }).then((res1)=>{
      if(res1.code !== 0){
        rej({
          msg:'注册失败',
          detail:res1
        })
      }else{
        login();
        res(res)
      }
    }).catch((err)=>{
      rej(err);
    })
  })
}



/**
 * 进行登录
 * 参数:undefined
 * 返回值:[Prmise]res
 */
function login(){
  return new Promise((res,rej)=>{
    //微信登陆
    wx.login({
      success(lg){
        if(lg.code){
          //微信进行登录
          requestP({
            url: `${apiUrl}/user/wxapp/login`,
            data: {
              code: lg.code,
            },
            method: 'POST',
          }).then((r1)=>{
            if(r1.code === 0){
              Token = r1.data.token;
              wx.setStorage({ key: 'token', data: Token })
              res(r1)
            } else if (r1.code === 10000) {
              //无法登陆没有进行注册
              wx.login({
                success(lg) {
                  if (lg.code) {
                    let referrer = wx.getStorageSync('referrer')//获取邀请人id
                    regester(lg.code, referrer)
                  }
                }
              })
            }else{
              rej({
                msg: r1.msg,
                detail:r1
              })
            }
          }).catch((err)=>{
            rej(err);
          })
        }else{
          rej({
              msg:'获取code失败',
              detail:lg
          })
        }
      },
      fail:rej
    })
  })
}



/**
 * 获取Token
 * 参数：undefined
 * 返回值：[promise]Token
 */
let loginList = [];
let isLogin = false;
function getToken() {
  return new Promise((res, rej) => {
    // 本地sessionId缺失，重新登录
    if (!Token) {
      //添加未执行命令
      loginList.push({res,rej});
      if (!isLogin){//关闭
        isLogin = true;
        login().then((r1) => {
          isLogin = false;
          while (loginList.length) {
            loginList.shift().res(r1);
          };
        }).catch((err) => {
          isLogin = false;
          while (loginList.length) {
            loginList.shift().rej(err);
          }
        });
      }
    }else{
      res(Token);
    }
  });
}


function api(options = {},isLogin = true) {
  //如果登录了则进行token有效验证
  if (isLogin) {
    return new Promise((resolve, reject) => {
      getToken().then((item) => {//进行有效验证
        //进行请求
        requestP(options).then((res) => {
          console.log(res,77445)
          if (res.code === 401){
            Token = "";
            wx.removeStorage('token')
            getSessionId().then((res1) => {
              requestP(options)
                .then(resolve)
                .catch(rej);
            });
          }else{
            resolve(res)
          }
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    })
  } else {
    return requestP(options);
  }
}
module.exports = api;

