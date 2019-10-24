// pages/index/index.js
Page({
	/**
   * 页面的初始数据
   */
	data: {
		id: 1,
		idArr: [],
		showModal: false,
		disableDescInput: false,
		curDescCount: 0,
		msg: {
			id: 1,
			name: 'test',
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
	onLoad: function(options) {
		let pots = wx.getStorageSync('pots');
		if (pots.length == 0) {
		} else {
			this.setData({
				flower_pots: pots
			});
		}
	},

	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function() {},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function() {
		this.setData({
			msg: {
				name: this.data.flower_pots[0].name,
				id: this.data.flower_pots[0].id
			}
		});
	},

	/**
   * 生命周期函数--监听页面隐藏
   */
	onHide: function() {},

	/**
   * 生命周期函数--监听页面卸载
   */
	onUnload: function() {
		wx.setStorageSync({
			key: 'pots',
			data: this.data.flower_pots
		});
	},

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
	onShareAppMessage: function() {},

	//点击花盆列表中的元素
	touchListItem: function(p) {
		console.log(p.currentTarget.dataset.pot);
		let pot = p.currentTarget.dataset.pot;
		//发送请求，更新数据
		wx.showToast({
			title: '数据更新中',
			icon: 'loading',
			duration: 1200
		});

		this.setData({
			msg: {
				name: pot.name,
				id: pot.id
			}
		});
	},

	addPot: function() {
		this.setData({
			showModal: true
		});
	},

	modalCancel: function() {
		this.setData({
			showModal: false
		});
	},
	descInput: function(data) {
		let count = data.detail.value.length;
		console.log(data.detail.value);

		this.setData({
			curDescCount: count
		});
	},

	submitModal: function(e) {
		console.log(e.detail.value);
		//避免id重复
		let pots = this.data.flower_pots;
		let duplicate = false;
		for (let p of pots) {
			if (p.id == e.detail.value.potId) {
				duplicate = true;
				break;
			}
		}
		if (duplicate) {
			//已经添加过了
			wx.showToast({
				title: '你已添加过该ID了',
				icon: 'error',
				image: '/images/error.png',
				duration: 1500,
				mask: false
			});
		} else {
			let newPot = {
				name: e.detail.value.potName,
				id: e.detail.value.potId,
				desc: e.detail.value.potDesc
			};
			pots.push(newPot);
		}

		this.setData({
			flower_pots: pots,
			showModal: false
		});
	}
});

function hexPacketDecode(hexPacket){

}
