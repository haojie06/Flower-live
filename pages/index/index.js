// pages/index/index.js
Page({
	/**
   * 页面的初始数据
   */
	data: {
		id: 1,
		idArr: [],
		msg: {
			temper: '0℃',
			airHumidity: '0%',
			soilHumidity: '0%',
			light: '0'
		},
		flower_pots: [
			{
				id: 1,
				name: 'test',
				desc: '描述'
			},
			{
				id: 2,
				name: 'test2',
				desc: '描述'
			},
			{
				id: 3,
				name: 'test2',
				desc: '描述'
			},
			{
				id: 4,
				name: 'test2',
				desc: '描述'
			},
			{
				id: 5,
				name: 'test2',
				desc: '描述'
			},
			{
				id: 6,
				name: 'test2',
				desc: '描述'
			}
		]
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {},

	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function() {},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function() {},

	/**
   * 生命周期函数--监听页面隐藏
   */
	onHide: function() {},

	/**
   * 生命周期函数--监听页面卸载
   */
	onUnload: function() {},

	/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
	onPullDownRefresh: function() {},

	/**
   * 页面上拉触底事件的处理函数
   */
	onReachBottom: function() {},

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function() {}
});
