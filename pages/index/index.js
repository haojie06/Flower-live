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
			light: '0',
			updateTime: '2019-10-1 22:22:22'
		},
		flower_pots: [
			{
				id: 3092,
				name: '示例花盆',
				desc: '湿度不小于XXX，光照时间不小于XXX',
				pot_status: 'pot-status-offline',
				status: '离线'
			},
			{
				id: 2,
				name: '玫瑰',
				desc: '温度范围~，湿度不小于XXX，光照时间不小于XXX',
				pot_status: 'pot-status-offline',
				status: '离线'
			},
			{
				id: 3,
				name: 'test2',
				desc: '描述',
				pot_status: 'pot-status-offline',
				status: '离线'
			},
			{
				id: 4,
				name: 'test2',
				desc: '描述',
				pot_status: 'pot-status-offline',
				status: '离线'
			},
			{
				id: 5,
				name: 'test2',
				desc: '描述',
				pot_status: 'pot-status-offline',
				status: '离线'
			},
			{
				id: 6,
				name: 'test2',
				desc: '描述',
				pot_status: 'pot-status-offline',
				status: '离线'
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
		this.setData({});
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
		//获得当前列表中所有的花盆的id
		let pots = this.data.flower_pots;
		for (let index in pots) {
			let pot = pots[index];
			console.log('花盆ID：' + pot.id);
			//刷新花盆列表在线情况
			wx.request({
				url: 'https://cloud.alientek.com/api/orgs/1365/devicestate/' + pot.id,
				data: {},
				method: 'GET',
				header: {
					token: 'bce786a63e1640878067e25738a74f0a'
				}, // 设置请求的 header
				success: (res) => {
					// success
					let response = res.data;
					//console.log(response);
					//测试用
					if (response.data != null || response.data == 'disconnect') {
						console.log(response);
						console.log(`更新${pot.id}成功`);
						pots[index].status = '在线';
						pots[index].pot_status = 'pot-status-online';
						//注意这里修改数组中对象的方式
						this.setData({
							flower_pots: pots
						});
						wx.showToast({
							title: '成功更新数据',
							icon: 'Success',
							image: '',
							duration: 1500,
							mask: false
						});
					} else {
						console.log(`更新${pot.id}失败`);
					}
				}
			});
		}
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

	//点击花盆列表中的元素，先查看该花盆是否在线
	touchListItem: function(p) {
		if (time - p.timeStamp < 350) {
			//判断是否为短碰
			console.log(p.currentTarget.dataset.pot);
			let pot = p.currentTarget.dataset.pot;
			wx.showToast({
				title: '尝试连接',
				icon: 'loading',
				duration: 1200
			});

			//尝试建立wss连接
			let sockTask = wx.connectSocket({
				url: 'wss://cloud.alientek.com/connection/bce786a63e1640878067e25738a74f0a/org/1365?token=' + newGuid(),
				header: {},
				method: 'GET',
				protocols: [],
				success: () => {},
				fail: () => {},
				complete: () => {}
			});

			wx.onSocketOpen((result) => {});

			sockTask.onClose(() => {
				console.log('WSS连接关闭');
			});

			sockTask.onOpen(() => {
				console.log('WSS连接已经建立');
				let enco = '03034570528203795997';
				//let arrayBuffer = new ArrayBuffer(21);
				let numList = encode(enco);
				let hexNumber = '';
				console.log(numList);
				for (let n of numList) {
					hexNumber += n.toString(16);
				}
				console.log(hexNumber);

				let packet = '01' + hexNumber;
				let abPacket = hex2ab(packet);
				console.log('buffer长度' + abPacket.byteLength);

				//订阅设备信息
				sockTask.send({
					data: abPacket,
					success: (result) => {
						console.log('WSS发送监听请求');
						console.log(result);
					}
				});

				//发送信息到设备
				//将信息按gb2312编码
				let msg = 'test message';
				let codeMsgs = encode(msg);
				let hexMsg = '';
				for (let m of codeMsg) {
					hexMsg += m.toString(16);
				}
				packet = '03' + hexNumber + hexMsg;
				sockTask.send({
					data: hex2ab(packet),
					success: (result) => {
						console.log('成功给设备发送信息');
					}
				});
			});

			//监听信息
			sockTask.onMessage((data) => {
				console.log('WSS收到信息');
				console.log(data);
				let buffer = data.data;
				let abHex = ab2hex(buffer);
				console.log(abHex);
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
	return decode(codeArr);
}

function newGuid() {
	var guid = '';
	for (var i = 1; i <= 32; i++) {
		var n = Math.floor(Math.random() * 16.0).toString(16);
		guid += n;
		if (i == 8 || i == 12 || i == 16 || i == 20) guid += '-';
	}
	return guid;
}

var hex2ab = function(hex) {
	var typedArray = new Uint8Array(
		hex.match(/[\da-f]{2}/gi).map(function(h) {
			return parseInt(h, 16);
		})
	);

	var buffer = typedArray.buffer;
	return buffer;
};

const ab2hex = function(buffer) {
	var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function(bit) {
		return ('00' + bit.toString(16)).slice(-2);
	});
	return hexArr.join('');
};
