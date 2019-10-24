// pages/index/index.js
var time = 0;
const { encode, decode } = require('fast-gbk');
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
			temper: '0',
			airHumidity: '0',
			soilHumidity: '0',
			light: '0'
		},
		flower_pots: [
			{
				id: 1,
				name: '郁金香',
				desc: '湿度不小于XXX，光照时间不小于XXX'
			},
			{
				id: 2,
				name: '玫瑰',
				desc: '温度范围~，湿度不小于XXX，光照时间不小于XXX'
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
	onPullDownRefresh: function() {
		hexToString('CE C2 B6 C8 3A 32 37 20 43 2C CA AA B6 C8 3A 34 38 20 25 20 0D 0A');
	},

	/**
   * 页面上拉触底事件的处理函数
   */
	onReachBottom: function() {},

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function() {},

	touchStart: function(e) {
		time = e.timeStamp;
	},

	//点击花盆列表中的元素
	touchListItem: function(p) {
		if (time - p.timeStamp < 350) {
			//判断是否为短碰
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
		}
	},

	touchDelete: function(p) {
		var that = this;
		let deleteId = p.currentTarget.dataset.pot.id;
		let pot = p.currentTarget.dataset.pot;
		let pots = this.data.flower_pots;

		if (deleteId >= 1 && deleteId <= 6) {
			//1-6花盆无法删除
			wx.showToast({
				title: '无法删除前六个',
				icon: 'error',
				image: '/images/error.png',
				duration: 1200
			});
			return;
		}
		wx.showModal({
			title: '删除',
			content: '是否要删除id: ' + deleteId + '的花盆',
			success: function(res) {
				if (res.confirm) {
					pots = pots.filter((x) => {
						return x.id != deleteId;
					});
					that.setData({
						flower_pots: pots,
						msg: { id: pots[0].id, name: pots[0].name }
					});
					wx.showToast({
						title: '删除成功',
						icon: 'success'
					});
				}
			},
			fail: function() {
				wx.showToast({
					title: '删除失败',
					icon: 'error',
					image: '/images/error.png'
				});
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
			showModal: false,
			curDescCount: 0
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
				name: e.detail.value.potName || 'test',
				id: e.detail.value.potId || pots[pots.length - 1].id * 1 + 1,
				desc: e.detail.value.potDesc || '描述'
			};
			pots.push(newPot);
		}

		this.setData({
			flower_pots: pots,
			showModal: false,
			curDescCount: 0
		});
	}
});
//格式 形如CE C2 B6 C8 3A 32 37 20 43 2C CA AA B6 C8 3A 34 38 20 25 20 0D 0A 
function hexToString(hexString) {
	let hexArr = hexString.toLowerCase().split(' ');
	let codeArr = [];
	for (let i = 0; i < hexArr.length; i++) {
		//如果大于128就读两个字节
		let fb = parseInt(hexArr[i], 16);
		codeArr.push(fb);
	}
	console.log(decode(codeArr));
}
