import React, { Component } from 'react';
import './style/MyInfo.less';
import { homeModuleApi,userVipApi,userOutApi,vipCardApi,albumBuyApi,historyApi,collectListApi,sportApi } from '../server/api';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import { connect } from 'react-redux';
import NavList from '../components/nav/NavList';
import Popup from '../components/affirm/Popup';
import Toast from '../components/toast/Index';
import $ from 'jquery';

class MyInfo extends Component {
	constructor(props) {
		super(props);
		//设置模块首页组件的随机标识
		this.myNavRandomId = this.getRandom();
		this.myRandomId = this.getRandom();
		this.state = {
			imgPath: 'http://master.dig88.cn/fit2/images/', // 图片路径
			albumList: [
				{
					title: 'xiangq',
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'c',null,{left:'no'})
				}
			], // 视频列表
			myTitleList: [// 我的信息
				{
					title: '我的会员',
					id: 'vip',
					cursor: this.setCursorObj(this.props.pageId, this.myNavRandomId, 'a',null,{left:'no'})
				},
				{
					title: '我的训练',
					id: 'train',
					cursor: this.setCursorObj(this.props.pageId, this.myNavRandomId, 'a',)
				},
				{
					title: '我的收藏',
					id: 'collect',
					cursor: this.setCursorObj(this.props.pageId, this.myNavRandomId, 'a')
				},
				{
					title: '我的数据',
					id: 'data',
					cursor: this.setCursorObj(this.props.pageId, this.myNavRandomId, 'a',null,{right:'no'})
				},
			],
			isVip: false,// 是否购买会员
			vipCard: [{ // 会员卡
				cardid: 1,
				cover: "test1.png",
				ctime: "2020-11-17 16:21:30",
				enddate: "2020-12-17 23:59:59",
				fromdate: "2020-11-17 00:00:00",
				id: 6,
				moduleid: "fit",
				title: "包月",
				userid: "opXCkjkGTWXzYe1rYMePX_sRsH4U",
				cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'd')
			}],
			cardList: [ // 会员卡列表
				{
					cover: "test1_s.png",
					ctime: "2020-05-29 03:21:58",
					duration: 1,
					id: 1,
					membercover: "test1.png",
					moduleid: "fit",
					price: 97,
					promotion: 1,
					serno: 1,
					title: "包月",
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'd')
				}
			],
			buttonList: [
				{
					title: '',
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'd',null,{left: 'no',bottom: 'no'})
				},
				{
					title: '',
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'd',)
				}
			],
			yangxiuList: [ // 氧秀已购买专辑
				{
					title: '',
					cover: '/codoon/payNO.png',
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'd')
				}
				
			],
			historyList: [ // 我的训练
				{
					title:'',
					paid: 0,
					cover: '/codoon/payNO.png',
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'd')
				}
			],
			collectList: [ // 我的收藏
				{
					title:'',
					paid: 0,
					cover: '/codoon/payNO.png',
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'd')
				}
			],
			sportInfo: { // 运动数据
				ctime: "2020-11-26 14:26:43",
				id: "opXCkjkGTWXzYe1rYMePX_sRsH4U",
				total_calorie: 174.05,
				total_days: 1,
				total_duration: "966979",
				total_num: 2,
				utime: "2020-11-26 14:27:02",
			},
			sportList: [ // 运动列表
				{
					date: '2020-11-11',
					content: [
						{
							title: '',
							cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'd')
						}
					]
				}
			],
			mtTitleId: 'vip', // 选择的信息
			moduleColor: '#d4cb4c', // 模板颜色
			navList: [],// 导航列表
			moduleId: 'fit',
			//弹出确认删除按钮
			affirmDelete: false,
			affirmInfo: {
				title: '确定退出登录吗？',
				affirm: '确定',
				cancel: '取消',
			},
			//是否隐藏初始化页面
			initDataVip: false,
			initDataNav: false,
			noLoading: false,
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.getModuleCode = this.getModuleCode.bind(this);
		this.tagChose = this.tagChose.bind(this);
	}

	// 将要加载页面dom
	componentWillMount() {
		console.log('进入信息页', this.props.params);
		// this.getUserVip()
		// this.tagChose()
	}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		// 获取导航
		this.getNav()
		document.addEventListener('keydown', this.handleKeyDown);
		
		if(this.props.params) {
			// 带title_id 过来
			if(this.props.params.title_id) {
				console.log(this.props.params.title_id)
				this.setState({
					mtTitleId: this.props.params.title_id
				})
				setTimeout(()=>{
					this.tagChose()
				},100)
			}
		} else {
			this.tagChose()
		}
	}
	// 组件将要卸载
	componentWillUnmount() {
		// 卸载的时候，删掉当前组件的全局焦点
		document.removeEventListener('keydown', this.handleKeyDown);
	}
	// 判断是否要移动焦点的时候，用的比较多
	componentWillReceiveProps(nextProps) {
		// 【焦点】根据新的props判断，是否移动焦点
		shouldComponentCurrUpdate(nextProps, this, ['navList','myTitleList','buttonList','cardList','vipCard','yangxiuList','historyList','collectList','sportList',]);
	}
	// 组件中途有更新dom，更新完成后的操作
	componentDidUpdate(prevProps, prevState) {
		if (
			// this.state.initDataVip && 
			this.state.initDataNav && 
			(
				!prevState.initDataNav
				// !prevState.initDataVip
			)
		) {
			// 增加dom节点
			this.props.deleteCompDom(this.myRandomId)
			this.props.editeDomList([this.state.navList]);
			this.props.editeDomList([this.state.myTitleList]);
			this.props.editeDomList([this.state.buttonList]);
			this.props.editeDomList([this.state.cardList]);
			this.props.editeDomList([this.state.vipCard]);
			this.props.editeDomList([this.state.yangxiuList]);
			this.props.editeDomList([this.state.historyList]);
			this.props.editeDomList([this.state.collectList]);
			this.props.editeDomList([this.state.sportList]);
			//将dom节点收集后，才设置当前节点
			this.props.setCursorDom(this.state.navList[0].cursor.random);
		}
		// 展示确认弹窗
		if (prevState.affirmDelete !== this.state.affirmDelete && this.state.affirmDelete) {
			// 展示确认删除弹窗的时候
			console.log('【已选歌曲】展示确认删除弹窗的时候', prevState.affirmDelete, this.state.affirmDelete);
			//更新完毕后，删除dom节点
			this.props.deleteCompDom(this.myRandomId);
			// 增加dom节点
			this.props.editeDomList([]);
		} else if(this.state.initDataVip !== prevState.initDataVip) {
			// 数据更新
			this.props.deleteCompDom(this.myRandomId)
			this.props.editeDomList([this.state.navList]);
			// this.props.editeDomList([this.state.myTitleList]);
			this.props.editeDomList([this.state.buttonList]);
			this.props.editeDomList([this.state.cardList]);
			this.props.editeDomList([this.state.vipCard]);
			this.props.editeDomList([this.state.yangxiuList]);
			this.props.editeDomList([this.state.historyList]);
			this.props.editeDomList([this.state.collectList]);
			this.props.editeDomList([this.state.sportList]);
		}
		// 滚动元素盒子
		let currBox1 = $('.myinfo-page .yxpay_list')
		// 当前焦点元素
		let currDom1 = $('.myinfo-page .yxpay_list .curr')
		// 如果当前页面存在焦点，移动滚动条
		if(currDom1.length > 0 && $('.myinfo-page').is(':visible')) {
			currBox1.scrollTop(currBox1.scrollTop() + currDom1.offset().top)
		}
		// 滚动元素盒子
		let currBox0 = $('.myinfo-page')
		// 当前焦点元素
		let currDom2 = $('.myinfo-page .list_page .curr')
		// 如果当前页面存在焦点，移动滚动条
		if(currDom2.length > 0 && $('.myinfo-page').is(':visible')) {
			currBox0.scrollTop(currBox0.scrollTop() + currDom2.offset().top - 374)
		}
		// 滚动元素盒子
		let currBox3 = $('.myinfo-page .sport_list')
		// 当前焦点元素
		let currDom3 = $('.myinfo-page .sport_list .curr')
		// 如果当前页面存在焦点，移动滚动条
		if(currDom3.length > 0 && $('.myinfo-page').is(':visible')) {
			currBox3.scrollTop(currBox3.scrollTop() + currDom3.offset().top - 250)
		}
		
	}
	//监听键盘事件
	handleKeyDown(e) {
		//判断如果当前页面不再第一个的时候，忽略点击事件
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		//开始判断键盘逻辑
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			// 确认键点击
			// 模式选择
			this.state.myTitleList.forEach((item,index)=> {
				if (item.cursor.curr) {
					this.setState({
						mtTitleId: item.id
					})
					this.tagChose()
					return
				}
			})
			// 会员卡购买
			this.state.cardList.forEach((item,index)=> {
				if(item.cursor.curr) {
					this.props.pushRouter({
						name: 'orderqr',
						pageId: this.getRandom(),
						params: {
							card_id: item.id,
						}
					});
					return
				}
			})
			// 会员卡续费
			if(this.state.vipCard[0].cursor.curr) {
				this.props.pushRouter({
					name: 'orderqr',
					pageId: this.getRandom(),
					params: {
						card_id: this.state.vipCard[0].cardid,
					}
				});
				return
			}
			// 退出登录
			if(this.state.buttonList[0].cursor.curr) {
				// this.logOut()
				this.setState({
					affirmDelete: true
				})
				return
			} else if(this.state.buttonList[1].cursor.curr) {
				// 跳转首页
				this.props.pushRouter({
					name: 'home',
					pageId: this.getRandom(),
					params: {
						module_id: this.state.moduleId,
					}
				});
				return
			}
			// 氧秀已购买专辑点击
			this.state.yangxiuList.forEach(item=> {
				if(item.cursor.curr) {
					this.props.pushRouter({
						name: 'detail',
						pageId: this.getRandom(),
						params: {
							detail_id: item.albumid,
							module_id: item.moduleid
						}
					});
					return
				}
			})
			// 训练点击
			this.state.historyList.forEach(item => {
				if(item.cursor.curr) {
					this.props.pushRouter({
						name: 'detail',
						pageId: this.getRandom(),
						params: {
							detail_id: item.albumid,
							module_id: item.moduleid
						}
					});
					return
				}
			})
			// 收藏点击
			this.state.collectList.forEach(item => {
				if(item.cursor.curr) {
					this.props.pushRouter({
						name: 'detail',
						pageId: this.getRandom(),
						params: {
							detail_id: item.albumid,
							module_id: item.moduleid
						}
					});
					return
				}
			})
		}
	}
	
	// 获取导航
	async getNav() {
		try {
			let res = await homeModuleApi()
			res.data = res.data.splice(1)
			res.data.forEach((item,index) => {
				item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'b');
				if(index === res.length-1){
					item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'b',null,{
						right: 'no'
					});
				}
				if(index === 0) {
					item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'b',null,{
						left: 'no'
					});
				}
			});
			this.setState({
				navList: res.data,
				navImgpath: res.prefix,
				initDataNav: true
			})
		} catch(e) {
			console.log(e)
		}
	}
	
	// 导航回调
	getModuleCode = (res,code) => {
		console.log(code)
		let moduleColor = this.state.navList.forEach(item => {
			if(item.id === code) {
				return item.color
			}
		})
		this.setState({
			moduleId: code,
			moduleColor: moduleColor,
		})
		this.tagChose()
	}
	// 导航选项点击
	tagChose(res) {
		this.setState({
			noLoading: false,
		})
		console.log(this.state.mtTitleId)
		console.log(this.state.moduleId)
		if(this.state.mtTitleId === 'vip') {
			// 我的会员
			if(this.state.moduleId !== 'yangxiu') {
				this.getUserVip()
			} else {
				this.getUserYangxiu()
			}
		} else if(this.state.mtTitleId === 'train') {
			// 我的训练
			this.getUserHistory()
		} else if(this.state.mtTitleId === 'collect') {
			// 我的收藏
			this.getUserCollect()
			
		} else if(this.state.mtTitleId === 'data') {
			// 我的数据
			this.getUserSport()
		}
	}
	async logOut() {
		try {
			let res = await userOutApi()
			if(res){
				this.props.removeUserInfo()
				this.props.deleteRouter(1,{asd:'asd'});
				this.props.deletePageDom(1);
				Toast.plain('您已退出登录',2000)
			}
		} catch(e) {
			console.log(e)
		}
	}
	// 获取用户会员数据
	async getUserVip() {
		Toast.empty()
		try {
			let res = await userVipApi({
				moduleid: this.state.moduleId
			})
			if(res) {
				// 用户已购买会员
				console.log(res)
				res.result.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'd')
				this.state.vipCard[0] = res.result
				this.setState({
					vipCard: this.state.vipCard,
					isVip: true,
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
				Toast.destroy()
			} else {
				// 用户未购买会员，找模块会员
				this.setState({
					isVip: false,
					noLoading: true,
				})
				this.getVipCard()
			}
			console.log(res)
		} catch(e) {
			console.log(e)
		}
	}
	// 获取模块会员卡
	async getVipCard() {
		try {
			let res = await vipCardApi({
				moduleid: this.state.moduleId
			})
			if(res) {
				// 存在模块会员卡
				res.result.forEach((item,index)=> {
					item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'd');
				})
				this.setState({
					cardList: res.result,
					imgPath: res.prefix,
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
				Toast.destroy()
			} else {
				Toast.plain('会员卡获取失败！',2000)
				// Toast.destroy()
			}
			console.log(res)
		} catch(e) {
			console.log(e)
		}
	}
	// 获取用户氧秀数据
	async getUserYangxiu() {
		try {
			let res = await albumBuyApi()
			if(res) {
				// 用户已购氧秀专辑
				console.log(res)
				res.result.forEach(item => {
					item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'd');
				})
				this.setState({
					yangxiuList: res.result,
					imgPath: res.prefix,
					isVip: true,
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
			} else {
				this.setState({
					isVip: false,
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
			}
			console.log(res)
		} catch(e) {
			console.log(e)
		}
	}
	
	// 获取用户训练数据
	async getUserHistory() {
		try {
			let res = await historyApi({
				moduleid: this.state.moduleId,
				pageno: 0,
				pagesize: 9999
			})
			console.log(res)
			if(res) {
				res.result.forEach((item,index)=>{
					if((index) % 3 === 0) {
						item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'c', null,{left: 'right'});
					} else if((index+1) % 3 === 0) {
						item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'c', null,{right: 'left'});
					} else {
						item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'c');
					}
				})
				this.setState({
					historyList: res.result,
					imgPath: res.prefix,
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
			} else {
				this.setState({
					historyList: [],
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
			}
		} catch(e) {
			console.log(e)
		}
	}
	// 获取用户收藏数据
	async getUserCollect() {
		try {
			let res = await collectListApi({
				moduleid: this.state.moduleId,
				pageno: 0,
				pagesize: 9999
			})
			console.log(res)
			if(res) {
				res.data.forEach((item,index)=>{
					if((index) % 3 === 0) {
						item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'c', null,{left: 'right'});
					} else if((index+1) % 3 === 0) {
						item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'c', null,{right: 'left'});
					} else {
						item.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'c');
					}
				})
				this.setState({
					collectList: res.data,
					imgPath: res.prefix,
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
			} else {
				this.setState({
					collectList: [],
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
			}
		} catch(e) {
			console.log(e)
		}
	}
	// 获取用户运动数据
	async getUserSport() {
		try {
			let res = await sportApi()
			console.log(res)
			if(res) {
				res.history.forEach((item,index)=>{
					item.content.forEach(item1 => {
						item1.cursor = this.setCursorObj(this.props.pageId, this.myRandomId, 'c');
					})
				})
				this.setState({
					sportInfo: res.sport,
					sportList: res.history,
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
			} else {
				this.setState({
					collectList: [],
					noLoading: true,
					initDataVip: !this.state.initDataVip
				})
			}
		} catch(e) {
			console.log(e)
		}
	}
	// 弹窗取消
	closeAffirm() {
		console.log('关闭弹窗');
		this.setState({
			affirmDelete: false
		});
	}
	// 弹窗确认
	deleteAllList() {
		console.log('删除全部数据');
		this.setState({
			affirmDelete: false
		});
		this.logOut()
	}
	// 页面渲染
	render() {
		return (
			<div className={'myinfo-page ' + this.props.display}>
				<div className={'empty_56'}></div>
				<div className={'module_box flex-ac mb40'}>
					{this.state.myTitleList.map((item,index)=> {
						return(<div className={'myinfo_title ' + (item.cursor.curr ? ' curr' : '')  + (item.id === this.state.mtTitleId ? ' on' : '')} ref={item.cursor.refs} key={'a' + index}>
							{item.title}
						</div>)
					})}
				</div>
				{/* nav导航 */}
				{this.state.mtTitleId !== 'data' ?
					<NavList 
						pageId={this.props.pageId}
						navBack={this.getModuleCode}
						compId={this.myRandomId}
						navList={this.state.navList}
						navImgpath={this.state.navImgpath}
						navCode={this.state.moduleId}
					></NavList>
				:''}
				{this.state.noLoading ?
					<div>
						{this.state.mtTitleId === 'vip' ? 
							<div className={'myvip_box flex-bt'}>
								<div className={'myvip_user tc'}>
									<img className={'myvip_user_img'} src={this.props.userInfo.avatar} alt={'用户头像'}></img>
									<div className={'myvip_user_name mt40 fs32 line-clamp'}>{this.props.userInfo.nickname}</div>
									<div className={'myvip_user_btn fs32' + (this.state.buttonList[0].cursor.curr ? ' curr' : '')} ref={this.state.buttonList[0].cursor.refs}>退出登录</div>
									<img className={'myvip_user_qr' + (this.state.moduleId === 'yangxiu' ? ' none' : '')} src={require('../assets/images/wechatQr.jpg')} alt={'公众号二维码'}></img>
								</div>
								<div className={'myvip_card'}>
									{this.state.navList.map((item,index)=> {
										if(item.id === this.state.moduleId) {
											return (
												<div className={'myvip_card_title fs32'} key={'nav' + index}>{this.state.isVip ? '已购买' : '您还未购买'}<span className={'ml24'} style={{color:item.color}}>{item.title}{this.state.moduleId !== 'yangxiu' ? '会员卡' : '专辑'}</span></div>
											)
										} else {
											return ''
										}
									})}
									{this.state.isVip ? 
										(this.state.moduleId !== 'yangxiu' ? <div className={'module_itemcard mt40'}>
											<div className={'flex-bt'}>
												<div className={'myvip_card_card_title fs40 line-clamp'} style={{color: this.state.moduleColor}}>{this.state.vipCard[0].title}</div>
												{/* <div className={'myvip_card_card_btn tc fs40' + (this.state.vipCard[0].cursor.curr ? ' curr' : '')}  ref={this.state.vipCard[0].cursor.refs}>续费</div> */}
											</div>
											<div className={'myvip_card_card_date fs26'}>{this.state.vipCard[0].enddate}到期</div>
										</div>
										:
										<div className='module_box yxpay_list flex flex-wrap' >
											{this.state.yangxiuList.map((item,index)=>{
												return (<div className={'module_item4 mb40 mr40 my_scale' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'yx' + index}>
														<img className={'module_img1'} src={this.state.imgPath + item.cover} alt={item.title}></img>
														<div className={'module_title1'}>{item.title}</div>
													</div>)
											})}
											<div className={'module_item4 mr40'}></div>
											<div className={'module_item4 mr40'}></div>
											<div className={'module_item4 mr40'}></div>
										</div>
										)
									:
										(this.state.moduleId !== 'yangxiu' ? 
											<div className={'module_box mt40 flex'}>
												{this.state.cardList.map((item,index)=> {
													return (
														<div className={'module_item4 card_item mr40 ' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'n' + index}>
															<img className={'myvip_card_hotsell ' + (item.promotion === 1 ? '' : ' none')} src={require('../assets/images/hotsell.png')} alt={'热销'}></img>
															<div className={'myvip_card_card_title fs40 line-clamp-2'}>{item.title}</div>
															<div className={'myvip_card_card_price fs20'}>￥<span className={'myvip_card_card_price_big'}>{item.price}</span></div>
														</div>
													)
												})}
											</div>
										:
										 <div className={''}>
											<div className={'myvip_user_btn mt40 fs32' + (this.state.buttonList[1].cursor.curr ? ' curr' : '')} ref={this.state.buttonList[1].cursor.refs}>立即购买</div>
										 </div>
										)
									}
									<div className={'myvip_card_desc fs26 ' + (this.state.moduleId === 'yangxiu' ? ' none' : '')}>
										<div className={'myvip_card_desc_title fs32'}>服务说明</div>
										<p>1.本应用仅限于三星电视，三星电视端应用与手机端应用内容不完全同步，App由艾数达科技开发运营和技术维护。</p>
										<p>2.如果用户在使用过程中遇到任何问题都可以微信搜索【艾数达智能电视应用】关注此公众号或扫描左方二维码关注公众号进行反馈。</p>
										<p>3.该商品为虚拟内容服务，购买后不支持退款，请谨慎购买，敬请谅解，可先体验免费课程！</p>
									</div>
								</div>
							</div>
						: '' }
						{this.state.mtTitleId === 'train' ?
							(this.state.historyList.length > 0 ?
								<div className={'module_box flex-bt flex-wrap list_page'}>
									{this.state.historyList.map((item,index)=> {
										return(<div className={'module_item3 my_scale mt40' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'his' + index}>
											<img className={'module_img1'} src={this.state.imgPath + item.cover} alt={item.title}></img>
											<img className={'module_img2'} src={require('../assets/images/paid' + item.paid + '.png')} alt={'费用'}></img>
											<div className={'module_title1'}>{item.title}</div>
										</div>
									)})}
									<div className={'empty_module module_item3'}></div>
									<div className={'empty_module module_item3'}></div>
								</div>
							:
								<div className={'list_empty'}>您还没有训练记录哦~</div>
							)
						: '' }
						{this.state.mtTitleId === 'collect' ?
							(this.state.collectList.length > 0 ?
								<div className={'module_box flex-bt flex-wrap list_page'}>
									{this.state.collectList.map((item,index)=> {
										return(<div className={'module_item3 my_scale mt40' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'his' + index}>
											<img className={'module_img1'} src={this.state.imgPath + item.cover} alt={item.title}></img>
											<img className={'module_img2'} src={require('../assets/images/paid' + item.paid + '.png')} alt={'费用'}></img>
											<div className={'module_title1'}>{item.title}</div>
										</div>
									)})}
									<div className={'empty_module module_item3'}></div>
									<div className={'empty_module module_item3'}></div>
								</div>
							:
								<div className={'list_empty'}>您还没有收藏记录哦~</div>
							)
						: '' }
						{this.state.mtTitleId === 'data' ?
							<div className={'sport_box flex-bt'}>
								<div className={'sport_left'}>
									<div className={'sport_user flex-ac'}>
										<img className={'sport_user_img'} src={this.props.userInfo.avatar} alt={'用户头像'}></img>
										<div className={'sport_user_name line-clamp'}>{this.props.userInfo.nickname}</div>
									</div>
									<div className={'sport_info flex-bt flex-wrap'}>
										<div className={'sport_info_item'}>
											<div className={'fs56 font-bold'}>{Math.floor(this.state.sportInfo.total_duration/(60*1000))}</div>
											<div className={'fs26 mt24'}>总时长（分钟）</div>
										</div>
										<div className={'sport_info_item'}>
											<div className={'fs56 font-bold'}>{this.state.sportInfo.total_calorie}</div>
											<div className={'fs26 mt24'}>总消耗（千卡）</div>
										</div>
										<div className={'sport_info_item'}>
											<div className={'fs56 font-bold'}>{this.state.sportInfo.total_days}</div>
											<div className={'fs26 mt24'}>累计（天）</div>
										</div>
										<div className={'sport_info_item'}>
											<div className={'fs56 font-bold'}>{this.state.sportInfo.total_num}</div>
											<div className={'fs26 mt24'}>完成（次）</div>
										</div>
									</div>
								</div>
								<div className={'sport_right'}>
									{this.state.sportList.map((item,index)=> {
										if(item.content.length > 0) {
											return (
												<div className={'sport_list'} key={'spl' + index}>
													<div className={'sport_list_title mt32 fs40'}>{item.date}</div>
													{item.content.map((item1,index1)=> {
														return(
														<div className={'sport_list_item flex-bt flex-ac mt24 fs32 ' + (item1.cursor.curr ? ' curr' : '')} ref={item1.cursor.refs} key={'spl' + index + '' + index1}>
															<div>{item1.title}</div>
															<div>{Math.floor(item1.played / (60*1000))}分{Math.floor(item1.played / 1000) % 60}秒</div>
														</div>
													)})}
												</div>
											)
										} else {
											return ''
										}
									})}
								</div>
							</div>
						: '' }
					</div>
				: ''}
				{this.state.affirmDelete ? (
					<Popup
						affirmCallback={this.deleteAllList.bind(this)}
						cancelCallback={this.closeAffirm.bind(this)}
						affirmInfo={this.state.affirmInfo}
						pageId={this.props.pageId}
					></Popup>
				) : (
					''
				)}
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

export default MyInfo = connect(mapState, mapDispatch)(MyInfo);
