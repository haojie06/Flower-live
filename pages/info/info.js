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
    flowerNumber: 3
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
  }
})