// pages/comment/comment.js
var web_list =  [
  {
    url: "",
    image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573628506769&di=9ebc04e76cda40fa60c791f97ca3f1e7&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20151026%2Fmp37784391_1445848640592_30.jpeg",
    title: "四川大学第十六届锦江电子杯电子设计大赛"
  },
  {
    url: "https://www.huahuier.com/",
    image: "https://cn.bing.com/th?id=OIP.iLKoBJ7svJIa39RTBlk49QHaE8&pid=Api&rs=1",
    title: "花卉百科（推荐!）"
  },
  {
    url: "http://www.china-flower.com/",
    image: "https://cn.bing.com/th?id=OIP.i_H38zOgk6JY8UB0ZQxMwAHaEo&pid=Api&rs=1",
    title: "中国花卉网"
  },
  {
    url: "http://www.worldscape.net.cn/",
    image: "http://www.xuetangx.com/asset-v1:TJU+2010241X+2016_T2+type@asset+block@%E5%9B%AD%E6%9E%97%E6%A4%8D%E7%89%A9%E6%99%AF%E8%A7%82%E5%AD%A6%E5%8E%9F%E7%90%86%E4%B8%8E%E6%96%B9%E6%B3%95.jpg",
    title: "世界园林"
  },
  {
    url: "https://www.drlmeng.com/",
    image: "https://pds.exblog.jp/pds/1/201503/08/69/b0194769_12503028.jpg",
    title: "多肉联萌"
  }
];

var flower_list = [
  {
    url: "http://www.xuexi111.org/book/shengwu/1055.html#download",
    image: "http://www.reader8.cn/uploadfile/2012/0905/20120905015710993.jpg",
    title: "世界园林植物与花卉百科全书(下载)"
  }
];

var comment_list = [
  {
    url: "https://www.zhihu.com/question/41466375",
    image: "https://tse4-mm.cn.bing.net/th?id=OIP.8jw7e3DvdgmArWASh16MyAE-DE&w=298&h=179&c=7&o=5&dpr=1.25&pid=1.7",
    title: "新手养花最容易犯哪些错误?应该如何避免?"
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:["flower1", "flower4", "flower3"],
    show_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({show_list: web_list});
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

  openTheWeb: function(e){
    let web = e.currentTarget.dataset.web; 
  },

  webSwitch: function(){
    this.setData({show_list: web_list});
  },

  knowSwitch: function(){
    this.setData({show_list: flower_list});
  },

  commentSwitch: function(){
    this.setData({show_list: comment_list})
  }
})