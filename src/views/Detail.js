import React, { Component } from 'react';
import './style/Detail.less';
import { albumDetailApi,collectApi } from '../server/api';
import Init from './Init';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import { connect } from 'react-redux';
import Toast from '../components/toast/Index';
import $ from 'jquery';

class Detail extends Component {
	constructor(props) {
		super(props);
		//设置模块首页组件的随机标识
		this.detailRandomId = this.getRandom();
		this.detailBtnRandomId = this.getRandom();
		this.state = {
			moduleId: '',// 模块ID
			detailId: '',// 详情ID
			imgPath: '', // 图片路径
			icon: 'http://master.dig88.cn/fit2/images/jump_fit.png',
			album: { // 专辑详情
				bigimage: "/fit/basis_f_6.png",
				calorie: "39",
				categoryid: 1,
				cover: "/fit/basis_f_s6.jpg",
				ctime: null,
				difficulty: null,
				duration: "540",
				id: 1,
				intro: "借鉴了瑜伽和普拉提训练，本次课程可作为阶段性训练中休息/恢复练习",
				itemcount: 1,
				moduleid: "fit",
				moduleidcolor: "#d4cb4c",
				moduletitle: "Fit",
				paid: 1,
				pinyin: "WANQUANLASHEN",
				playable: 0,
				price: null,
				promotion: 0,
				serno: 0,
				title: "完全拉伸",
				utime: "2020-05-22 06:22:12",
			},
			detailList: [ // 视频列表
				{
					title: 'xiangq',
					cover: '/codoon/payNO.png',
					cursor: this.setCursorObj(this.props.pageId, this.detailRandomId, 'b')
				}
			],
			buttonList: [ // 按钮列表
				{
					title: '本专辑',
					price: 0,
					playable: 0,
					type: 'buy',
					cursor: this.setCursorObj(this.props.pageId, this.detailBtnRandomId, 'a',null,{left:'no'})
				},
				{
					title: '播放',
					type: 'play',
					cursor: this.setCursorObj(this.props.pageId, this.detailBtnRandomId, 'a',null,{},true)
				},
				{
					title: '收藏',
					type: 'collect',
					cursor: this.setCursorObj(this.props.pageId, this.detailBtnRandomId, 'a',null,{right:'no'})
				}
			],
			buttonType: 'play',
			intro: [{
				intro: '说明',
				cursor: this.setCursorObj(this.props.pageId, this.detailRandomId, 'a',null,{right:'no',left:'no',top:'no'})
			}],
			recList: [
				{
					title: '推荐',
					album:[
						{
							title:'推荐详情',
							cover: '/codoon/payNO.png',
							cursor: this.setCursorObj(this.props.pageId, this.detailRandomId, 'c')
						},
					]
				}
			],
			//是否隐藏初始化页面
			initDataDetail: false,
			initDataRefresh: false, // 重新渲染页面
			moveCurr: true,
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.changeBtn = this.changeBtn.bind(this);
	}

	// 将要加载页面dom
	componentWillMount() {
		console.log('带着detail_id', this.props.params);
		console.log(this.props.navList)
		this.setState({
			detailId: this.props.params.detail_id,
			moduleId: this.props.params.module_id
		})
		this.getAlbumDetail(this.props.params.detail_id,this.props.params.module_id)
	}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		console.log(this.props.navList)
		
		this.props.navList.forEach(item => {
			if(item.id === this.props.params.module_id) {
				this.setState({
					icon: item.prefix + item.cover
				})
			}
		})
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
		shouldComponentCurrUpdate(nextProps, this, ['detailList','buttonList','intro','recList']);
	}
	// 组件中途有更新dom，更新完成后的操作
	componentDidUpdate(prevProps, prevState) {
		console.log('detail 加载完成')
		if(prevProps.backParams) {
			if(prevProps.backParams.payStatus) {
				this.getAlbumDetail(this.props.params.detail_id,this.props.params.module_id)
				prevProps.backParams.payStatus = false
			}
		}
		// if (
		// 	this.state.initDataDetail &&
		// 	(
		// 		!prevState.initDataDetail
		// 	)
		// ) {
		// 	console.log('收集DOM')
		// 	// 增加dom节点
		// 	this.props.editeDomList([this.state.detailList]);
		// 	this.props.editeDomList([this.state.buttonList]);
		// 	this.props.editeDomList([this.state.intro]);
		// 	//将dom节点收集后，才设置当前节点
		// 	this.props.setCursorDom(this.state.buttonList[1].cursor.random);
		// }
		// 重新获取模块后执行
		if(this.state.initDataRefresh !== prevState.initDataRefresh) {
			this.props.deleteCompDom(this.detailRandomId);
			this.props.deleteCompDom(this.detailBtnRandomId);
			this.props.editeDomList([this.state.detailList]);
			this.props.editeDomList([this.state.buttonList]);
			this.props.editeDomList([this.state.recList]);
			this.props.editeDomList([this.state.intro]);
			this.props.setCursorDom(this.state.buttonList[1].cursor.random);
		} else {
			// 滚动元素盒子
			let currBox = $('.detail-page')
			// 当前焦点元素
			let currDom = $('.detail-page .curr')
			// 如果当前页面存在焦点，移动滚动条
			if(currDom.length > 0 && $('.detail-page').is(':visible')) {
				currBox.scrollTop(currBox.scrollTop() + currDom.offset().top - 740)
				let currBox1 = $('.detail-page .detailmodulebox')
				let currDom1 = $('.detail-page .detailmodulebox .curr')
				if(currDom1.length > 0) {
					currBox1.scrollLeft(currBox1.scrollLeft() + currDom1.offset().left - 670)
				}
				this.state.recList.forEach((item,index)=>{
					let currBox2 = $('.detail-page .recmodulebox' + index)
					let currDom2 = $('.detail-page .recmodulebox' + index + ' .curr')
					if(currDom2.length > 0) {
						console.log(currDom2.offset().left)
						currBox2.scrollLeft(currBox2.scrollLeft() + currDom2.offset().left - 670)
					}
				})
				
				this.state.buttonList.forEach(item => {
					if(item.cursor.curr) {
						this.state.buttonList.forEach(item1 => {
							item1.cursor.resetDom = false
						});
						item.cursor.resetDom = true;
						console.log('changeBtn')
						this.changeBtn(item.type)
					}
				})
				this.props.deleteCompDom(this.detailRandomId);
				this.props.deleteCompDom(this.detailBtnRandomId);
				this.props.editeDomList([this.state.detailList]);
				this.props.editeDomList([this.state.buttonList]);
				this.props.editeDomList([this.state.recList]);
				this.props.editeDomList([this.state.intro]);
			}
		}
	}
	//监听键盘事件
	handleKeyDown(e) {
		//判断如果当前页面不再第一个的时候，忽略点击事件
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		//开始判断键盘逻辑
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			// 确认键点击
			// 推荐点击
			this.state.recList.forEach(item => {
				item.album.forEach((item1,index1)=>{
					if(item1.cursor.curr) {
						this.getAlbumDetail(item1.albumid,item1.moduleid)
						return
					}
				})
			})
			// 购买点击
			if(this.state.buttonList[0].cursor.curr) {
				if(this.state.album.moduleid === 'yangxiu') {
					this.props.pushRouter({
						name: 'orderqr',
						pageId: this.getRandom(),
						params: {
							album_id: this.state.album.id,
						}
					});
				} else {
					if(this.props.userInfo.id) {
						this.props.pushRouter({
							name: 'myinfo',
							pageId: this.getRandom(),
							params: {
								module_id: this.state.album.moduleid,
							}
						});
					} else {
						Toast.plain('请先登录')
					}
				}
			}
			// 播放点击
			if(this.state.buttonList[1].cursor.curr) {
				if(this.state.detailList[0].playable === 0) {
					// 购买
					if(this.state.album.moduleid === 'yangxiu') {
						Toast.plain('请您先购买专辑',2000)
						// this.props.pushRouter({
						// 	name: 'orderqr',
						// 	pageId: this.getRandom(),
						// 	params: {
						// 		album_id: this.state.album.id,
						// 	}
						// });
					} else {
						Toast.plain('请您先购买会员',2000)
					}
				} else {
					this.props.pushRouter({
						name: 'video',
						pageId: this.getRandom(),
						params: {
							video_id: this.state.detailList[0].id,
							album_id: this.state.album.id,
							module_id: this.state.moduleId,
						}
					});
				}
			}
			// 收藏点击
			if(this.state.buttonList[2].cursor.curr) {
				this.updataCollect()
			}
			// 视频点击 
			this.state.detailList.forEach(item => {
				if(item.cursor.curr) {
					if(item.playable === 0) {
						if(item.moduleid === 'yangxiu') {
							Toast.plain('请您先购买专辑',2000)
						} else {
							Toast.plain('请您先购买会员',2000)
						}
					} else {
						this.props.pushRouter({
							name: 'video',
							pageId: this.getRandom(),
							params: {
								video_id: item.id,
								album_id: this.state.album.id,
								module_id: this.state.moduleId,
							}
						});
					}
					return
				}
			})
			
		}
	}
	changeBtn(type) {
		if(type === this.state.buttonType) return
		setTimeout(()=>{
			this.setState({
				buttonList:this.state.buttonList,
				buttonType: type
			});
		},1);
	}
	// 收藏
	async updataCollect() {
		if(!this.props.userInfo.id) {
			Toast.plain('请先登录',2000)
			return
		}
		try{
			let res = collectApi({
				albumid: this.state.album.id
			})
			if(res) {
				Toast.plain(this.state.album.collect === 0 ? '收藏成功' : '您已取消收藏',2000)
				this.state.album.collect = this.state.album.collect === 0 ? 1 : 0
				this.setState({
					album: this.state.album
				})
			}
		} catch(e) {
			console.log(e)
		}
	}
	// 获取模块列表
	async getAlbumDetail(did,mid) {
		console.log(did,mid)
		try {
			let res = await albumDetailApi({
				albumid:did,
				moduleid:mid
			})
			res.contentlist.forEach((item,index)=> {
				item.cursor = this.setCursorObj(this.props.pageId, this.detailRandomId, 'c')
				if(index === res.contentlist.length-1 && index === 0){
					item.cursor = this.setCursorObj(this.props.pageId, this.detailRandomId, 'c',null,{
						right: 'no',
						left:'no',
					},);
				} else if(index === res.contentlist.length-1 ) {
					item.cursor = this.setCursorObj(this.props.pageId, this.detailRandomId, 'c',null,{
						right: 'no'
					});
				} else if(index === 0) {
					item.cursor = this.setCursorObj(this.props.pageId, this.detailRandomId, 'c',null,{
						left: 'no'
					},);
				}
			})
			res.recommend.forEach((item,index)=> {
				item.album.forEach((item1,index1)=> {
					item1.cursor = this.setCursorObj(this.props.pageId, this.detailRandomId, 'd')
					if(index1 === item.album.length-1 && index1 === 0){
						item1.cursor = this.setCursorObj(this.props.pageId, this.detailRandomId, 'd',null,{
							right: 'no',
							left:'no',
						},);
					} else if(index1 === item.album.length-1 ) {
						item1.cursor = this.setCursorObj(this.props.pageId, this.detailRandomId, 'd',null,{
							right: 'no'
						});
					} else if(index1 === 0) {
						item1.cursor = this.setCursorObj(this.props.pageId, this.detailRandomId, 'd',null,{
							left: 'no'
						},);
					}
				})
			})
			let intro = [{
				intro: res.album.intro,
				cursor: this.setCursorObj(this.props.pageId, this.detailRandomId, 'a',null,{right:'no',left:'no',top:'no'})
			}]
			this.setState({
				imgPath: res.prefix,
				album: res.album,
				detailList: res.contentlist,
				recList: res.recommend,
				intro: intro,
				initDataDetail: true,
				initDataRefresh: !this.state.initDataRefresh,
			})
		} catch(e) {
			console.log(e)
		}
	}
	// 页面渲染
	render() {
		if ( !this.state.initDataDetail) {
			//没有加载出来数据的时候，限制初始化页面
			// return <Init></Init>;
			return (
				<div className={'detail-page flex-ajc'}>
					<img className={'logo'} alt="logo" src={this.state.icon}></img>
				</div>
			)
		}
		return (
			<div className={'detail-page ' + this.props.display}>
				<div className={'empty_module'}></div>
				<div className={'flex'}>
					<div className={'detail_cover'}>
						<img src={this.state.imgPath + this.state.album.bigimage} alt={'专辑封面'}></img>
					</div>
					<div className={'ml40 pr'}>
						<div className={'detail_title line-clamp'}>{this.state.album.title}</div>
						<div className={'flex mt40 fs32'}>
							<div className={'mr40'}>章节:{this.state.album.itemcount}节</div>
							<div className={'mr40' + (this.state.album.difficulty ? '' : 'none')}>课程难度:{this.state.album.difficulty}</div>
							<div className={this.state.album.calorie ? '' : 'none'}>燃脂:{this.state.album.calorie}千卡</div>
						</div>
						<div className={'detail_intro mt16 fs32' + (this.state.intro[0].cursor.curr ? ' curr' : '')} ref={this.state.intro[0].cursor.refs}>
							<div className={'line-clamp-3'}>{this.state.intro[0].intro}</div>
						</div>
						<div className={'detail_btnbox flex-ac fs32'}>
							{this.state.album.moduleid === 'yangxiu' ?
								<div className={'detail_btnitem mr40 flex-ajc' + (this.state.buttonList[0].cursor.curr ? ' curr' : '') + (!this.state.album.isship ? '' : ' none')}
									ref={!this.state.album.isship ? this.state.buttonList[0].cursor.refs : ''}>
									<div className={'tc'}><div className={'mb24'} style={{color:this.state.album.moduleidcolor}}>{this.state.album.price} 元</div>购买专辑</div>
								</div>
							:
								<div className={'detail_btnitem mr40 flex-ajc' + (this.state.buttonList[0].cursor.curr ? ' curr' : '') + (!this.state.album.isship ? '' : ' none')}
									ref={!this.state.album.isship ? this.state.buttonList[0].cursor.refs : ''}>
									购买 {this.state.album.moduletitle} 会员
								</div>
							}
							<div className={'detail_btnitem mr40 flex-ajc' + (this.state.buttonList[1].cursor.curr ? ' curr' : '')} ref={this.state.buttonList[1].cursor.refs}>
								<img className={'detail_btnimg mr24'} src={require('../assets/images/detail_play.png')} alt={'播放'}></img>播放
							</div>
							<div className={'detail_btnitem mr40 flex-ajc' + (this.state.buttonList[2].cursor.curr ? ' curr' : '')} ref={this.state.buttonList[2].cursor.refs}>
								<img className={'detail_btnimg mr24'} src={require('../assets/images/detail_collect' + this.state.album.collect + '.png')} alt={'收藏'}></img>收藏
							</div>
							
							<div className={'detail_btnitem'} style={{color:this.state.album.moduleidcolor}}>内容来自{this.state.album.moduletitle}</div>
						</div>
					</div>
				</div>
				<div className={'module_title0 mt40'}>课程列表</div>
				<div className={'detailmodulebox'}>
				<div className={'module_box flex'} style={{width: this.state.detailList.length * 600}}>
					{this.state.detailList.map((item,index)=>{
						return(<div className={'mt40 mr40 module_item3' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'d' + index}>
							<img className={'module_img1'} src={this.state.imgPath + item.cover} alt={item.title}></img>
							<img className={'module_img2' + (this.state.album.isship ? ' none' : '')} src={require('../assets/images/paid' + (item.playable === 0 ? 1 : 0) + (this.state.album.moduleid === 'yangxiu' ? 0 : '') + '.png')} alt={'费用'}></img>
							<div className={'module_title1'}>{item.title}</div>
						</div>)
					})}
				</div>
				</div>
				{this.state.recList.map((item,index)=>{
					return (<div key={'c'+ index}>
						<div className={'module_title0 mt40'}>{item.title}</div>
						<div className={'recmodulebox recmodulebox'+ index}>
							<div className={'module_box flex'} style={{width: item.album.length * 600}}>
								{item.album.map((item1,index1)=>{
									return (<div className={'mt40 mr40 module_item3' + (item1.cursor.curr ? ' curr' : '')} ref={item1.cursor.refs} key={'c' + index + '' + index1}>
										<img className={'module_img1'} src={this.state.imgPath + item1.cover} alt={item1.title}></img>
										<img className={'module_img2'} src={require('../assets/images/paid' + item1.paid + (item1.moduleid === 'yangxiu' ? 0 : '') + '.png')} alt={'费用'}></img>
										<div className={'module_title1'}>{item1.title}</div>
									</div>
								)})}
							</div>
						</div>
					</div>
					)
				})}
			</div>
		);
	}
}
//【焦点】需要渲染什么数据
function mapState(state) {
	return {
		routerDomList: state.routerDomList,
		userInfo: state.userInfo,
		navList: state.navList
	};
}

export default Detail = connect(mapState, mapDispatch)(Detail);
