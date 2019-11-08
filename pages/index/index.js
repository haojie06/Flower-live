// pages/index/index.js
var touchStartTime = 0;
var touchEndTime = 0;
// 最后一次单击事件点击发生时间
lastTapTime = 0;
// 单击事件后要触发的函数
lastTapTimeoutFunc = null;

const { encode, decode } = require('fast-gbk');
var enco = '03034570528203795997';
var numList = encode(enco);
var globalSocket = null;

let that = this;
Page({
	/**
   * 页面的初始数据
   */
	data: {
    id: 1,
		showModal: false,
    showAuto: false,
		disableDescInput: false,
		curDescCount: 0,
    autoPic: 'auto_off',
    index: 0,
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
		],
    flower_msg:[
      {
        id: 1,
        name: "郁金香",
        soilHumidity: 50,
        light: 50,
        desc: "土壤湿度不低于: 50，光照强度不低于: 50"
      },
      {
        id: 2,
        name: '玫瑰',
        soilHumidity: 50,
        light: 50,
        desc: "土壤湿度不低于: 30，光照强度不低于: 60"
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
				flower_pots: pots,
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
					if (response.data != null || response.data == 'connected') {
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
            pots[index].status = "离线";
            pots[index].pot_status = "pot-status-offline";
            this.setData({
              flower_pots: pots
            });
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
		touchStartTime = e.timeStamp;
	},
  touchEnd: function(e){
    touchEndTime = e.timeStamp;
  },

	//点击花盆列表中的元素，先查看该花盆是否在线
	touchListItem: function(p) {
		if (touchStartTime - p.timeStamp < 350) {
			//判断是否为短碰
			console.log(p.currentTarget.dataset.pot);
			let pot = p.currentTarget.dataset.pot;
			wx.showToast({
				title: '尝试连接',
				icon: 'loading',
				duration: 1200
			});

      //判断是否离线
      if (pot.pot_status == 'pot-status-offline')
      return console.log("花盆 "+pot.id +" 离线，无法连接到服务器");

      //暂存目前显示的id和花盆名字name
      this.data.id = p.currentTarget.dataset.pot.id;
      this.setData({autoPic: 'auto_off'});
      this.data.msg.name = pot.name;

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
      
      globalSocket = sockTask;

			wx.onSocketOpen((result) => {});

			sockTask.onClose(() => {
				console.log('WSS连接关闭');
			});

			sockTask.onOpen(() => {
				console.log('WSS连接已经建立');
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
				/*let count = 0;
				let timer = setInterval(() => {
					let time = new Date().toUTCString();
					let msg = 'test:' + count + time;
					let codeMsgs = encode(msg);
					let hexMsg = '';
					for (let m of codeMsgs) {
						hexMsg += m.toString(16);
					}
					packet = '03' + hexNumber + hexMsg;

					sockTask.send({
						data: hex2ab(packet),
						success: (result) => {
							console.log('成功给设备发送信息' + msg);
						}
					});
					count++;
					if (count == 11) {
						clearInterval(timer);
						console.log('停止发送信息');
					}
				}, 1000);
      */
			});

			//监听信息
			sockTask.onMessage((data) => {
				console.log('WSS收到信息');
				console.log(data);
				let buffer = data.data;
				let abHex = ab2hex(buffer);
				console.log(abHex);
				//解码成文字,十六进制两个字符一组
				let tempArr = abHex.split('');
				let codeArr = [];
				let test = 'test message';
				for (let i = 0; i < tempArr.length; i++) {
					codeArr.push(tempArr[i] + tempArr[i + 1]);
					i += 1;
				}

				let intArr = codeArr.map((str) => {
					return parseInt(str, 16);
				});
				let message = decode(intArr);
				//获得信息对象
        console.log(message.lastIndexOf('}')+ ' \ '+ message.length);
				let msgObject = JSON.parse(message.substring(message.indexOf('{'), message.lastIndexOf('}') + 1));
				console.log(msgObject);

				let currentMsg = this.data.msg;
				currentMsg.id = this.data.id;
				currentMsg.temper = msgObject.temperature;
				currentMsg.airHumidity = msgObject.air_humidity;
				currentMsg.soilHumidity = msgObject.humidity;
        currentMsg.light = msgObject.light_intensity;
				currentMsg.updateTime = new Date().toUTCString();
				this.setData({
					msg: currentMsg
				});
			});
		}
	},

	touchDelete: function(p) {
		let deleteId = p.currentTarget.dataset.pot.id;
		let pot = p.currentTarget.dataset.pot;
		let pots = this.data.flower_pots;

		if (deleteId == 3092) {
			//花盆3092无法删除
			wx.showToast({
				title: '无法删除此花盆',
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
      showAuto: false,
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
	},

  autoSet:function(e){
    let that = this;
    let pic = this.data.autoPic == 'auto_off' ? 'auto_on' : 'auto_off';

    // 判断是否为双击事件
    var curTime = e.timeStamp;
    var lastTime = lastTapTime;
    lastTapTime = curTime;

    if(curTime - lastTime < 300){
      console.log("双击");
      clearTimeout(lastTapTimeoutFunc);
      that.setData({
        showAuto: true,
        });
      
    }
    else{
    lastTapTimeoutFunc = setTimeout(function () {
      let index = that.data.index;
      let flowerId = that.data.flower_msg[index].id;
      console.log("单击");
      if (pic == 'auto_on') {
        wx.showToast({
          title: '自动管理设置',
        });
        sendData(flowerId);
      }
      else {
        wx.showToast({
          title: '自动管理取消',
        });
        sendData(); //发送0取消管理
      }
      that.setData({ autoPic: pic });
      }, 300)
    }
  },

  flowerPick: function(e){
    this.setData({index: e.detail.value});
    console.log(e.detail.value);
  },

  autoCancel: function(){
    this.setData({
      showAuto: false,
      autoPic: 'auto_off'});
  }

});
//格式 形如CE C2 B6 C8 3A 32 37 20 43 2C CA AA B6 C8 3A 34 38 20 25 20 0D 0A
function hexToString(hexString) {
	let hexArr = hexString.toLowerCase().split(' ');
	let codeArr = [];
	for (let i = 0; i < hexArr.length; i++) {
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

//发送信息，参数为0时停止自动浇水和补光
var sendData = function(msg){
  let flowerId = msg || 0;
  let codeMsgs = encode(flowerId);
  let hexMsg = '';
  let hexNumber = '';
  for(let m of codeMsgs){
    hexMsg += m.toString(16);
  }
  for (let n of numList) {
    hexNumber += n.toString(16);
  }
  packet = '03' + hexNumber + hexMsg;
  if(globalSocket != null){
    globalSocket.send({
      data: hex2ab(packet),
      success: (res)=>{
        console.log("成功发送信息" + flowerId);
      }
    })
  }
};
