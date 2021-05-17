// pages/my/index.js
const db = wx.cloud.database()


Page({
  data: {
    userInfo: {},
    isshowbtn: true,
  },
  //onload  页面一刷新就会执行这个
  onLoad() {

    wx.cloud.callFunction({
      name: 'openapi',
      success(res) {
        console.log("请求成功", res)
      },
      fail(err){
        console.log(err)
      }
      //做一些后续操作，不用考虑代码的异步执行问题。
    })
    
    let user = wx.getStorageSync('userInfo')
    if (user) {
      console.log("本地用户信息")
      this.setData({
        userInfo: user,
        isshowbtn: false,
      })
    } else {
      console.log("本地无用户信息")
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认

    console.log("获取信息")
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用
      success: (res) => {
        let user = res.userInfo

        db.collection('todos').doc(user).get().then(res => {
          console.log(res.data)
        })


        let jifen = 50
        this.setData({
          userInfo: user,
          isshowbtn: false,
        })
        //存入本地  不用重复授权
        wx.setStorageSync('userInfo', user)
        wx.setStorageSync('jifen', jifen)

        db.collection("userinfo").add({
          _id: id,
          data: {
            userInfo: user,
            jifen: jifen,
          }
        })

        //传到数据库后产生openid  获取openid 并存入本地 作为房间标识
        db.collection('userinfo').where({
            userInfo: {
              nickName: user.nickName
            }
          })
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              console.log(res.data)
              console.log(res.data[0]._openid)



              wx.setStorageSync('_openid', res.data[0]._openid)

              console.log("我获得了自己的openid")
            }
          })
      }
    })
  },

})