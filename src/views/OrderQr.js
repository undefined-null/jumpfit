import React, { Component } from 'react';
import './style/OrderQr.less';
import { buyApi,buyStatusApi } from '../server/api';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import QRCode from 'qrcode.react';
import { connect } from 'react-redux';
import Toast from '../components/toast/Index';
import $ from 'jquery';

class OrderQr extends Component {
	constructor(props) {
		super(props);
		//设置模块首页组件的随机标识
		this.orderRandomId = this.getRandom();
		this.state = {
			userStatus: false,
			qrCode: '', // 二维码
			orderId: '', // 订单
			payType: 1,// 订单类型 1.会员卡 2.单片
			userInfo: {
				avatar:"https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eobAYmt4D1FGQniafcgqVzkTGnGB7u7SicpSSuziaQdwXYcfbGUkr0dic7Ux0RmQgiblg5a081picTLZ8ow/132",
				id:"opXCkjkGTWXzYe1rYMePX_sRsH4U",
				lastlogin:"2020-11-04 10:33:33",
				location:"内蒙古-巴彦淖尔",
				nickname:"单曲循环",
				total_calorie:0,
				total_days:0,
				total_duration:0,
				total_num:0,
			},
			//是否隐藏初始化页面
			initDataVip: false,
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	// 将要加载页面dom
	componentWillMount() {
		console.log('进入登录页面', this.props.params);
		
		this.getQrCode(this.props.params)
	}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		// 获取导航
		document.addEventListener('keydown', this.handleKeyDown);
		this.props.editeDomList([]);
	}
	// 组件将要卸载
	componentWillUnmount() {
		// 卸载的时候，删掉当前组件的全局焦点
		document.removeEventListener('keydown', this.handleKeyDown);
	}
	// 判断是否要移动焦点的时候，用的比较多
	componentWillReceiveProps(nextProps) {
		// 【焦点】根据新的props判断，是否移动焦点
		shouldComponentCurrUpdate(nextProps, this, ['navList','myTitleList']);
	}
	// 组件中途有更新dom，更新完成后的操作
	componentDidUpdate(prevProps, prevState) {
		// if (
		// 	this.state.initDataAlbum &&
		// 	(
		// 		// !prevState.initDataModule ||
		// 		!prevState.initDataAlbum
		// 	)
		// ) {
		// 	// 增加dom节点
		// 	console.log('dom')
		// 	this.props.editeDomList([this.state.navList]);
		// 	this.props.editeDomList([this.state.myTitleList]);
		// 	//将dom节点收集后，才设置当前节点
		// 	this.props.setCursorDom(this.state.navList[0].cursor.random);
		// }
		// 滚动元素盒子
		// let currBox = $('.classlist-page')
		// // 当前焦点元素
		// let currDom = $('.classlist-page .curr')
		// // 如果当前页面存在焦点，移动滚动条
		// if(currDom.length > 0 && $('.classlist-page').is(':visible')) {
		// 	currBox.scrollTop(currBox.scrollTop() + currDom.offset().top - 374)
		// 	console.log(currDom.offset().top)
		// }
	}
	//监听键盘事件
	handleKeyDown(e) {
		//判断如果当前页面不再第一个的时候，忽略点击事件
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		//开始判断键盘逻辑
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			// 确认键点击
			console.log('模块列表')
			this.state.albumList.forEach((item,index)=> {
				console.log(item)
				if (item.cursor.curr) {
					this.props.pushRouter({
						name: 'detail',
						pageId: this.getRandom(), 
						params: {
							detail_id: item.id,
							module_id: item.moduleid
						}
					});
					return
				}
			})
		}
	}
	
	// 获取登录二维码
	async getQrCode(params) {
		let rdata = {
				cardid: params.card_id
			}
		if(params.card_id) {
			rdata = {
				cardid: params.card_id
			}
		} else if(params.album_id){
			rdata = {
				albumid: params.album_id
			}
		} else {
			// 没有拿到会员卡或者专辑
			this.deleteRouter(1)
			this.deletePageDom(1)
			return
		}
		
		try {
			let res = await buyApi(rdata)
			console.log(res)
			this.setState({
				qrCode: res.data.code_url,
				orderId: res.data.orderid,
				payType: res.paytype,
			})
			this.getOrderStatus()
		} catch(e) {
			console.log(e)
		}
	}
	// 检查支付状态
	async getOrderStatus() {
		try {
			let res = await buyStatusApi({
				orderid: this.state.orderId,
				paytype: this.state.payType
			})
			if(res === 1) {
				this.props.deleteRouter(1,{
					payStatus: true
				});
				this.props.deletePageDom(1);
				Toast.plain('支付成功',2000)
			} else if($('.order-page').is(':visible')) {
				setTimeout(()=> {
					this.getOrderStatus()
				},1000)
			}
		} catch(e) {
			console.log(e)
		}
	}
	
	// 页面渲染
	render() {
		return (
			<div className={'order-page page-mask flex-ajc ' + this.props.display}>
				<div>
					<div className={'qr_icon'}>
						{this.state.qrCode !== '' ? (
							<QRCode
								value={this.state.qrCode}
								size={400}
								imageSettings={{
									src:require('../assets/images/wechat.png'),
									height: 64,
									width: 64,
									excavate: true
								}}
							/>
						) : (
							<img className={'loading'} src={require('../assets/images/loading.gif')} alt=""></img>
						)}
					</div>
					<div className="login_title tc">请使用微信扫码支付</div>
				</div>
			</div>
		);
	}

}
//【焦点】需要渲染什么数据
function mapState(state) {
	return {
		routerDomList: state.routerDomList,
		userInfo: state.userInfo
	};
}

export default OrderQr = connect(mapState, mapDispatch)(OrderQr);
