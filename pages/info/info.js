// pages/info/info.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    potNumber: 6,
    flowerNumber: 3,
    showAbout: false,
    showHelp:false,
    teamMsg:[
      {
        level: '队长',
        name: '赵崇皓',
        college: '电子信息学院',
        subject: '电子信息工程(卓越班)',
        studentId: '2017141451258',
        phone: '15328219621'
      },
      {
        level: '组员',
        name: '朱奕霖',
        college: '电子信息学院',
        subject: '电子信息科学与技术',
        studentId: '2017141451056',
        phone: '13032893768'
      },
      {
        level: '组员',
        name: '赵庆',
        college: '华西口腔医学院',
        subject: '口腔医学(五年制)',
        studentId: '2017151642127',
        phone: '13060033978'
      }
    ],
    helpMsg:[
      {
        title: '显示',
        image: '/images/help1.png'
      },
      {
        title: '控制花盆设备',
        image: '/images/help2.png'
      },
      {
        title: '添加和连接花盆设备',
        image: '/images/help3.png'
      },
      {
        title: '登录',
        image: '/images/help4.png'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo)
    {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    }
    else if(this.data.canIUse){
      app.userInfoReadyCallBack = res =>{
        if(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    }
    else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e){
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo;
    if(app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //更新花盆和花卉数
    if(app.globalData.potNumber != this.data.potNumber)
    this.setData({potNumber: app.globalData.potNumber});
    if(app.globalData.flowerNumber != this.data.flowerNumber)
    this.setData({flowerNumber: app.globalData.flowerNumber});
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getMember: function(){
    wx.showModal({
      title: '',
      content: '活动尚未开展，敬请期待！',
      cancelText: '好吧- -',
      confirmText:"好哒！"
    })
  },

  about: function(){
    this.setData({showAbout: !this.data.showAbout});
  },

  help: function(){
    this.setData({showHelp: !this.data.showHelp});
  }
})