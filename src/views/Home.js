import React, { Component } from 'react';
import './style/Home.less';
import {  homeIndexApi, homeModuleApi, classHomeApi } from '../server/api';
// import { getToken, removeToken } from '../utils/token';
import Init from './Init';
import NoMore from './NoMore';
import NavList from '../components/nav/NavList';
import HomeHeader from '../components/topHeader/HomeHeader';
// import selectSong from './SelectSong';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import { connect } from 'react-redux';
import Toast from '../components/toast/Index';
import $ from 'jquery';

class Home extends Component {
	constructor(props) {
		super(props);
		this.homeRandomId = this.getRandom();
		this.homeModuleId = this.getRandom();
		this.state = {
			moduleId: '',
			navList: [],// 导航列表
			classList: [], // 分类列表
			recList: { // 推荐
				top_up: {
					content: [],
					title: '',
				},
				top_right: {
					content: [],
					title: '',
				},
				top_bottom: {
					content: [],
					title: '',
				},
			},
			topLeftList: [ // 推荐中左，固定写死
				{
					type: 'train',
					title: '我的训练',
					cursor: this.setCursorObj(this.props.pageId, this.homeModuleId, 'c',null,{left:'no'})
				},
				{
					type: 'collect',
					title: '我的收藏',
					cursor: this.setCursorObj(this.props.pageId, this.homeModuleId, 'c')
				},
			],
			yangxiuRecList: [ // 氧秀推荐
				{
					bigimage: "/fit/basis_f_6.png",
					calorie: "39",
					cover: "/fit/basis_f_s6.jpg",
					ctime: null,
					difficulty: null,
					duration: "540",
					id: 515,
					intro: "借鉴了瑜伽和普拉提训练，本次课程可作为阶段性训练中休息/恢复练习",
					itemcount: 1,
					moduleid: "yangxiu",
					paid: 1,
					pinyin: "WANQUANLASHEN",
					price: 20,
					promotion: 0,
					serno: 0,
					title: "完全拉伸",
					utime: "2020-05-22 06:22:12",
					cursor: this.setCursorObj(this.props.pageId, this.homeModuleId, 'c',)
				},
			],
			moduleList: [ // 模块列表
				{
					title: '模版标题',
					content: [
						{
							id: 0,
							title: '模块标题',
							cover: '/codoon/payNO.png',
							cursor: this.setCursorObj(this.props.pageId, this.homeModuleId, 'c')
						}
					]
				}
			],
			imgPath: '', // 图片根路径
			//是否隐藏初始化页面
			initDataNav: false,
			initDataModule: false,
			initUserAccout: false,
			initDataRefresh: false, // 重新获取模板数据
			infoCode: 'chosen',
		};
		// 热门点场分页
		this.songRange = {
			page: 0,
			pagesize: 100
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.getModuleCode = this.getModuleCode.bind(this)
	}

	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		this.getAppJump()
		this.getNav();// 获取导航
		// this.getHomeIndex();// 获取首页模块
		// this.setState({
		// 	initDataRefresh: !this.state.initDataRefresh,
		// })
		this.getClassList('home');// 获取首页分类
		this.props.editeDomList([]);
		document.addEventListener('keydown', this.handleKeyDown);
	}
	// 组件将要卸载
	componentWillUnmount() {
		// 卸载的时候，删掉当前组件的全局焦点
		document.removeEventListener('keydown', this.handleKeyDown);
	}
	// 判断是否要移动焦点的时候，用的比较多
	componentWillReceiveProps(nextProps) {
		// 【焦点】根据新的props判断，是否移动焦点
		shouldComponentCurrUpdate(nextProps, this, ['navList', 'recList', 'topLeftList', 'moduleList','classList','yangxiuRecList']);
	}
	// 组件中途有更新dom，更新完成后的操作
	componentDidUpdate(prevProps, prevState) {
		if (
			this.state.initDataNav &&
			this.state.initDataModule &&
			( !prevState.initDataNav || !prevState.initDataModule)
		) {
			// console.log('home初始化完成，开始添加节点', prevProps, prevState);
			// 增加dom节点
			this.props.editeDomList([this.state.navList]);
			this.props.editeDomList([this.state.recList.top_up.content]);
			this.props.editeDomList([this.state.recList.top_right.content]);
			this.props.editeDomList([this.state.recList.top_bottom.content]);
			this.props.editeDomList([this.state.topLeftList]);
			this.props.editeDomList([this.state.classList]);
			this.props.editeDomList([this.state.yangxiuRecList]);
			this.props.editeDomList([this.state.moduleList]);
			//将dom节点收集后，才设置当前节点
			this.props.setCursorDom(this.state.navList[0].cursor.random);
		} else 
		
		// 重新获取模块后执行
		if(this.state.initDataRefresh !== prevState.initDataRefresh) {
			this.props.deleteCompDom(this.homeModuleId);
			this.props.editeDomList([this.state.navList]);
			this.props.editeDomList([this.state.recList.top_up.content]);
			this.props.editeDomList([this.state.recList.top_right.content]);
			this.props.editeDomList([this.state.recList.top_bottom.content]);
			this.props.editeDomList([this.state.topLeftList]);
			this.props.editeDomList([this.state.classList]);
			this.props.editeDomList([this.state.yangxiuRecList]);
			this.props.editeDomList([this.state.moduleList]);
			// this.setState({
			// 	initDataRefresh: false
			// })
		}
		// 滚动元素盒子
		let currBox = $('.home-page')
		// 当前焦点元素
		let currDom = $('.home-page .curr')
		// 如果当前页面存在焦点，移动滚动条
		if(currDom.length > 0 && $('.home-page').is(':visible')) {
			currBox.scrollTop(currBox.scrollTop() + currDom.eq(currDom.length - 1).offset().top - 384)
		}
		// 导航移动确认（遥控器无需确认）
		this.state.navList.forEach(item => {
			if(item.cursor.curr) {
				this.state.navList.forEach(item1 => {
					item1.cursor.resetDom = false
				})
				item.cursor.resetDom = true
				this.getClassList(item.id)
			}
		})
	}
	//监听键盘事件
	handleKeyDown(e) {
		//判断如果当前页面不再第一个的时候，忽略点击事件
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		//开始判断键盘逻辑
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			// 确认执行事件
			// 推荐上部跳转专辑详情
			this.state.recList.top_up.content.forEach(item => {
				if (item.cursor.curr) {
					console.log('专辑封面跳转')
					if(!item.adtype) { // 非广告跳转
						console.log('非广告跳转')
						this.props.pushRouter({
							name: 'detail',
							pageId: this.getRandom(), 
							params: {
								detail_id: item.id,
								module_id: item.moduleid
							}
						});
					} else if(item.adtype === 2){ // APP跳转
						console.log('跳转广告')
						if(window.webapis) {
							var appControl = new window.tizen.ApplicationControl(
								item.appdata, // 传参
								null,
								"image/jpeg",
								null);
							var appControlReplyCallback = {
								// callee sent a reply
								onsuccess: function (data) {
									for (var i = 0; i < data.length; i++) {
										if (data[i].key == "http://tizen.org/appcontrol/data/selected") {
											console.log('Selected image is ' + data[i].value[0]);
										}
									}
								},
								// callee returned failure
								onfailure: function () {
									console.log('The launch application control failed');
								}}
							window.tizen.application.launchAppControl(
								appControl,
								item.appid,
								function () { console.log("launch application control succeed"); },
								function (e) { console.log("launch application control failed. reason: " + e.message); },
								appControlReplyCallback
							);
						} else {
							console.log('环境不允许')
						}
					} else if(item.adtype === 1) {
						console.log('跳转H5')
						this.props.pushRouter({
							name: 'iframe',
							pageId: this.getRandom(),
							params: {
								src: item.adsrc
							}
						})
					}
					return
				}
			});
			// 推荐右跳转专辑详情
			this.state.recList.top_right.content.forEach(item => {
				if (item.cursor.curr) {
					console.log('专辑封面跳转')
					console.log(item)
					if(!item.adtype) { // 非广告跳转
						console.log('非广告跳转')
						this.props.pushRouter({
							name: 'detail',
							pageId: this.getRandom(), 
							params: {
								detail_id: item.id,
								module_id: item.moduleid
							}
						});
					} else if(item.adtype === 2){ // APP跳转
						console.log('跳转广告')
						if(window.webapis) {
							var appControl = new window.tizen.ApplicationControl(
								item.appdata, // 传参
								null,
								"image/jpeg",
								null);
							var appControlReplyCallback = {
								// callee sent a reply
								onsuccess: function (data) {
									for (var i = 0; i < data.length; i++) {
										if (data[i].key == "http://tizen.org/appcontrol/data/selected") {
											console.log('Selected image is ' + data[i].value[0]);
										}
									}
								},
								// callee returned failure
								onfailure: function () {
									console.log('The launch application control failed');
								}}
							window.tizen.application.launchAppControl(
								appControl,
								item.appid,
								function () { console.log("launch application control succeed"); },
								function (e) { console.log("launch application control failed. reason: " + e.message); },
								appControlReplyCallback
							);
						} else {
							console.log('环境不允许')
						}
					} else if(item.adtype === 1) {
						console.log('跳转H5')
						this.props.pushRouter({
							name: 'iframe',
							pageId: this.getRandom(),
							params: {
								src: item.adsrc
							}
						})
					}
					return
				}
			});
			// 我的训练
			if(this.state.topLeftList[0].cursor.curr) {
				if(!this.props.userInfo.id){
					Toast.plain('请先登录',2000)
					return
				}
				this.props.pushRouter({
					name: 'myinfo',
					pageId: this.getRandom(), 
					params: {
						title_id: 'train'
					}
				});
				return
			} else if(this.state.topLeftList[1].cursor.curr) {
				if(!this.props.userInfo.id){
					Toast.plain('请先登录',2000)
					return
				}
				// 我的收藏
				this.props.pushRouter({
					name: 'myinfo',
					pageId: this.getRandom(), 
					params: {
						title_id: 'collect'
					}
				});
				return
			}
			// 推荐底部跳转专辑详情
			this.state.recList.top_bottom.content.forEach(item => {
				if (item.cursor.curr) {
					console.log('专辑封面跳转')
					if(!item.adtype) { // 非广告跳转
						console.log('非广告跳转')
						this.props.pushRouter({
							name: 'detail',
							pageId: this.getRandom(), 
							params: {
								detail_id: item.id,
								module_id: item.moduleid
							}
						});
					} else if(item.adtype === 2){ // APP跳转
						console.log('跳转广告')
						if(window.webapis) {
							var appControl = new window.tizen.ApplicationControl(
								item.appdata, // 传参
								null,
								"image/jpeg",
								null);
							var appControlReplyCallback = {
								// callee sent a reply
								onsuccess: function (data) {
									for (var i = 0; i < data.length; i++) {
										if (data[i].key == "http://tizen.org/appcontrol/data/selected") {
											console.log('Selected image is ' + data[i].value[0]);
										}
									}
								},
								// callee returned failure
								onfailure: function () {
									console.log('The launch application control failed');
								}}
							window.tizen.application.launchAppControl(
								appControl,
								item.appid,
								function () { console.log("launch application control succeed"); },
								function (e) { console.log("launch application control failed. reason: " + e.message); },
								appControlReplyCallback
							);
						} else {
							console.log('环境不允许')
						}
					} else if(item.adtype === 1) {
						console.log('跳转H5')
						this.props.pushRouter({
							name: 'iframe',
							pageId: this.getRandom(),
							params: {
								src: item.adsrc
							}
						})
					}
					return
				}
			});
			// 氧秀推荐跳转专辑详情
			this.state.yangxiuRecList.forEach(item => {
				if (item.cursor.curr) {
					console.log('专辑封面跳转')
					if(!item.adtype) { // 非广告跳转
						console.log('非广告跳转')
						this.props.pushRouter({
							name: 'detail',
							pageId: this.getRandom(), 
							params: {
								detail_id: item.id,
								module_id: item.moduleid
							}
						});
					} else if(item.adtype === 2){ // APP跳转
						console.log('跳转广告')
						if(window.webapis) {
							var appControl = new window.tizen.ApplicationControl(
								item.appdata, // 传参
								null,
								"image/jpeg",
								null);
							var appControlReplyCallback = {
								// callee sent a reply
								onsuccess: function (data) {
									for (var i = 0; i < data.length; i++) {
										if (data[i].key == "http://tizen.org/appcontrol/data/selected") {
											console.log('Selected image is ' + data[i].value[0]);
										}
									}
								},
								// callee returned failure
								onfailure: function () {
									console.log('The launch application control failed');
								}}
							window.tizen.application.launchAppControl(
								appControl,
								item.appid,
								function () { console.log("launch application control succeed"); },
								function (e) { console.log("launch application control failed. reason: " + e.message); },
								appControlReplyCallback
							);
						} else {
							console.log('环境不允许')
						}
					} else if(item.adtype === 1) {
						console.log('跳转H5')
						this.props.pushRouter({
							name: 'iframe',
							pageId: this.getRandom(),
							params: {
								src: item.adsrc
							}
						})
					}
					return
				}
			});
			// 模板跳转专辑详情
			this.state.moduleList.forEach(item => {
				item.content.forEach(item1 => {
					if (item1.cursor.curr) {
						if(item1.type === 'more') {
							// 氧秀更多跳转分类列表
							this.props.pushRouter({
								name: 'classlist',
								pageId: this.getRandom(), 
								params: {
									category_id: item1.id,
									module_id: item1.moduleid
								}
							});
						} else {
					console.log('专辑封面跳转')
					if(!item1.adtype) { // 非广告跳转
						console.log('非广告跳转')
						this.props.pushRouter({
							name: 'detail',
							pageId: this.getRandom(), 
							params: {
								detail_id: item1.id,
								module_id: item1.moduleid
							}
						});
					} else if(!item1.adtype === 2){ // APP跳转
						console.log('跳转广告')
						if(window.webapis) {
							var appControl = new window.tizen.ApplicationControl(
								item1.appdata, // 传参
								null,
								"image/jpeg",
								null);
							var appControlReplyCallback = {
								// callee sent a reply
								onsuccess: function (data) {
									for (var i = 0; i < data.length; i++) {
										if (data[i].key == "http://tizen.org/appcontrol/data/selected") {
											console.log('Selected image is ' + data[i].value[0]);
										}
									}
								},
								// callee returned failure
								onfailure: function () {
									console.log('The launch application control failed');
								}}
							window.tizen.application.launchAppControl(
								appControl,
								item1.appid,
								function () { console.log("launch application control succeed"); },
								function (e) { console.log("launch application control failed. reason: " + e.message); },
								appControlReplyCallback
							);
						} else {
							console.log('环境不允许')
						}
					} else if(!item1.adtype === 1) {
						console.log('跳转H5')
						this.props.pushRouter({
							name: 'iframe',
							pageId: this.getRandom(),
							params: {
								src: item1.adsrc
							}
						})
					}
					return
				}
						return
					}
				})
			});
			// 跳转分类列表
			this.state.classList.forEach(item => {
				if (item.cursor.curr) {
					this.props.pushRouter({
						name: 'classlist',
						pageId: this.getRandom(), 
						params: {
							category_id: item.id,
							module_id: item.moduleid
						}
					});
					return
				}
			});
		} else if(e.keyCode === TvKeyCode.KEY_BACK) {
			// 判断焦点
			let exit = false
			let module_index = 0
			this.state.navList.forEach((item,index) => {
				if(item.cursor.curr) {
					exit = true
				}
				if(item.id === this.state.moduleId) {
					module_index = index
				}
			})
			// 退出APP
			if(exit) {
				// console.log('退出APP')
				setTimeout(()=> {
					this.props.pushRouter({ name: 'exitApp', pageId: this.getRandom() });
				},5)
			} else {
				this.props.setCursorDom(this.state.navList[module_index].cursor.random);
				$('.home-page').scrollTop(0)
			}
		}
	}
	// 接受APP跳转带参
	getAppJump() {
		if(window.webapis) {
			var reqAppControl = window.tizen.application.getCurrentApplication().getRequestedAppControl();
			if (reqAppControl) {
				console.log("Requester AppID : " + reqAppControl.callerAppId);
				var appControl = reqAppControl.appControl;
				console.log("Requester operation : " + appControl.operation);
				if (appControl.operation == "http://tizen.org/appcontrol/operation/pick") {
					console.log('我接收到参数了: ', appControl.operation);
					// var data = new tizen.ApplicationControlData("http://tizen.org/appcontrol/data/selected", ["Image1.jpg"]);
					// reqAppControl.replyResult([data]);
				}
			}
		} else {
			console.log('环境不支持')
		}
	}
	// 获取导航
	async getNav() {
		try {
			let res = await homeModuleApi()
			res.data.forEach((item,index) => {
				item.prefix = res.prefix
				item.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'b');
				if(index === res.length-1){
					item.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'b',null,{
						right: 'no'
					});
				}
				if(index === 0) {
					item.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'b',null,{
						left: 'no'
					},true);
				}
			});
			this.props.setNavList(res.data)
			this.setState({
				navList: res.data,
				navImgpath: res.prefix,
				initDataNav: true
			})
		} catch(e) {
			console.log(e)
		}
	}
	
	// 获取模块分类列表
	async getClassList(id) {
		if(id === this.state.moduleId) return
		
		this.setState({
			moduleId: id,
			navList: this.state.navList
		})
		Toast.empty()
		try {
			let res = await classHomeApi({moduleid:id})
			res.forEach((item, index) => {
				item.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'd');
			});
			this.setState({
				classList: res,
			})
			this.getHomeIndex(id)
		} catch(e) {
			console.log(e)
		}
	}
	
	// 获取首页模板
	async getHomeIndex(id) {
		try {
			let res = await homeIndexApi({moduleid:id})
			
			// 首页推荐绑定
			if(id === 'home') {
				res.top.top_up.content[0].cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c', null, {left: 'no'});
				res.top.top_up.content[1].cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c');
				res.top.top_up.content[2].cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c', null, {right: 'no'});
				res.top.top_right.content[0].cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c');
				res.top.top_right.content[1].cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c', null, {right: 'no'});
				res.top.top_bottom.content[0].cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c', null, {left: 'no'});
				res.top.top_bottom.content[1].cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c');
				res.top.top_bottom.content[2].cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c', null, {right: 'no'});
				res.data.forEach((item, index) => {
					item.content.forEach((item1,index1)=> {
						if((index1) % 3 === 0) {
							item1.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'e', null,{left: 'right'});
						} else if((index1+1) % 3 === 0) {
							item1.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'e', null,{right: 'left'});
						} else {
							item1.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'e');
						}
					})
				});
				// 首页模块绑定
				this.setState({
					moduleList: res.data,
					imgPath: res.prefix,
					recList: res.top,
					initDataModule: true,
					initDataRefresh: !this.state.initDataRefresh,
				})
			} else if(id === 'yangxiu'){
				res.data.forEach((item, index) => {
					// 氧秀模块添加更多按钮
					item.content.push({
						type: 'more',
						cover: "",
						id: item.categoryid,
						paid: 0,
						moduleid: "yangxiu",
						title: "更多",
					})
					item.content.forEach((item1,index1)=> {
						if(index1 === 2 || item1.type === 'more') {
							item1.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'e', null,{right: 'left'});
						} else if((index1%3) === 0) {
							item1.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'e', null,{left: 'right'});
						} else {
							item1.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'e');
						}
					})
				});
				res.top[0].content.forEach((item,index)=>{
					if((index) % 3 === 0) {
						item.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c', null,{left: 'right'});
					} else if((index+1) % 3 === 0) {
						item.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c', null,{right: 'left'});
					} else {
						item.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'c');
					}
				})
				// 首页模块绑定
				this.setState({
					moduleList: res.data,
					imgPath: res.prefix,
					yangxiuRecList: res.top[0].content,
					initDataModule: true,
					initDataRefresh: !this.state.initDataRefresh,
				})
			} else {
				res.data.forEach((item, index) => {
					item.content.forEach((item1,index1)=> {
						if((index1) % 4 === 0) {
							item1.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'e', null,{left: 'right'});
						} else if((index1+1) % 4 === 0) {
							item1.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'e', null,{right: 'left'});
						} else {
							item1.cursor = this.setCursorObj(this.props.pageId, this.homeModuleId, 'e');
						}
					})
				});
				// 首页模块绑定
				this.setState({
					moduleList: res.data,
					imgPath: res.prefix,
					initDataModule: true,
					initDataRefresh: !this.state.initDataRefresh,
				})
			}
			Toast.destroy()
		} catch(e) {
			console.log(e)
		}
	}
	
	// 导航回调
	getModuleCode = (result, code) => {
		try {
			this.getClassList(code)
		} catch (e) {
			console.log(e);
		}
	}
	// 页面渲染
	render() {
		if ( !this.state.initDataModule || !this.state.initDataNav) {
			//没有加载出来数据的时候，限制初始化页面
			return <Init></Init>;
		}
		return (
			<div className={'home-page ' + this.props.display}>
				{/* 首页顶部的状态栏 */}
				<HomeHeader pageId={this.props.pageId}></HomeHeader>
				{/* nav导航 */}
				<NavList 
					pageId={this.props.pageId}
					navBack={this.getModuleCode}
					compId={this.homeRandomId}
					navList={this.state.navList}
					navImgpath={this.state.navImgpath}
					navCode={this.state.moduleId}
				></NavList>
					<div className={'module_box flex-bt'}>
						{this.state.recList.top_up.content.map((item,index) => {
							if(this.state.moduleId === 'home') {
							return (<div className={'module_item3 mt40' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'tu' + index}>
									<img className={'module_img1'} src={this.state.imgPath + item.cover} alt={item.title}></img>
									<img className={'module_img2'} src={require('../assets/images/paid' + item.paid + (item.moduleid === 'yangxiu' ? 0 : '') + '.png')} alt={'费用'}></img>
									<div className={'module_title1 none'}>{item.title}</div>
								</div>)
						}else {
							return ''
						}})}
					</div>
					<div className={'module_box flex-bt '}>
						{this.state.topLeftList.map((item,index)=> {
							if(this.state.moduleId === 'home') {
							return (<div className={'module_item4 mt40 rec_my_' + item.type + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'tl' + index}>{item.title}</div>)
						}else{return ''}})}
						{this.state.recList.top_right.content.map((item,index) => {
							if(this.state.moduleId === 'home') {
							return (<div className={'module_item4 mt40' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'tr' + index}>
									<img className={'module_img1'} src={this.state.imgPath + item.bigimage} alt={item.title}></img>
									<img className={'module_img2'} src={require('../assets/images/paid' + item.paid + (item.moduleid === 'yangxiu' ? 0 : '') + '.png')} alt={'费用'}></img>
									<div className={'module_title1 none'}>{item.title}</div>
								</div>)
						}else{return ''}})}
					</div>
					<div className={'module_box flex-bt ' + ( this.state.moduleId === 'home' ? 'mb32' : '')}>
						{this.state.recList.top_bottom.content.map((item,index) => {
							if(this.state.moduleId === 'home') {
							return (<div className={'module_item3 mt40' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'tb' + index}>
									<img className={'module_img1'} src={this.state.imgPath + item.cover} alt={item.title}></img>
									<img className={'module_img2'} src={require('../assets/images/paid' + item.paid + (item.moduleid === 'yangxiu' ? 0 : '') + '.png')} alt={'费用'}></img>
									<div className={'module_title1 none'}>{item.title}</div>
								</div>)
						}else{return ''}})}
					</div>
					<div className={'module_box flex-bt flex-wrap ' + (this.state.moduleId === 'yangxiu' ? 'mb32' : '')}>
						{this.state.yangxiuRecList.map((item,index) => {
							if(this.state.moduleId === 'yangxiu') {
							return (<div className={'module_item3 mt40' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'yx' + index}>
									<img className={'module_img1'} src={this.state.imgPath + item.cover} alt={item.title}></img>
									<img className={'module_img2'} src={require('../assets/images/paid' + item.paid + (item.moduleid === 'yangxiu' ? 0 : '') + '.png')} alt={'费用'}></img>
									<div className={'module_title1 none'}>{item.title}</div>
								</div>)
						}else{return ''}})}
					</div>
					<div className={'module_box flex-bt flex-wrap'}>
						{this.state.classList.map((item,index)=>{
							return (<div className={'module_item5 flex-ajc mt40 fs40 font-bold' + (item.cursor.curr ? ' curr' : '') + (this.state.moduleId !== 'home' ? ' module_item_class' : '')} ref={item.cursor.refs} key={'class' + index}>{item.title}</div>)
						})}
						<div className={'empty_module module_item5'}></div>
						<div className={'empty_module module_item5'}></div>
						<div className={'empty_module module_item5'}></div>
						<div className={'empty_module module_item5'}></div>
					</div>
					{/*  */}
					{this.state.moduleList.map((item,index)=>{
						return (<div key={'md'+ index}>
							<div className={'module_title0 mt40 pt32'}>{item.title}</div>
							<div className={'module_box flex-bt flex-wrap' + (this.state.moduleId === 'yangxiu' ? ' module_boxy' : '')}>
								{item.content.map((item1,index1)=>{
									return (<div className={'mt40 '
										+ (this.state.moduleId === 'home' ? ' module_item3' : ' module_item4')
										+ (item1.type === 'more' ? ' module_item_more' : '')
										+ (item1.cursor.curr ? ' curr' : '')}
										ref={item1.cursor.refs} key={'md' + index + '' + index1}>
										<img className={'module_img1' + (item1.type === 'more' ? ' none' : '') + (this.state.moduleId === 'home' ? '' : ' none')} src={this.state.imgPath + item1.cover} alt={item1.title}></img>
										<img className={'module_img1' + (item1.type === 'more' ? ' none' : '') + (this.state.moduleId !== 'home' ? '' : ' none')} src={this.state.imgPath + (index1 === 1 || index1===2 ? (item1.vertical ? item1.vertical : item1.bigimage) : item1.bigimage)} alt={item1.title}></img>
										<img className={'module_img2' + (item1.type === 'more' ? ' none' : '')} src={require('../assets/images/paid' + item1.paid + (item1.moduleid === 'yangxiu' ? 0 : '') + '.png')} alt={'费用'}></img>
										<img className={'mr40' + (item1.type === 'more' ? '' : ' none')} src={require('../assets/images/home_more.png')} alt={item1.title}></img>
										<div className={'module_title1 ' + (index1 > 5 ? '' : 'none')}>{item1.title}</div>
									</div>
								)})}
							</div>
						</div>
						)
					})}
					<NoMore></NoMore>
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

export default Home = connect(mapState, mapDispatch)(Home);
