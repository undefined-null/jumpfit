import React, { Component } from 'react';
import './style/MyInfo.less';
import { homeModuleApi,userVipApi,vipCardApi } from '../server/api';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import { connect } from 'react-redux';
import NavList from '../components/nav/NavList';
import Toast from '../components/toast/Index';
import $ from 'jquery';

class MyInfo extends Component {
	constructor(props) {
		super(props);
		//设置模块首页组件的随机标识
		this.myRandomId = this.getRandom();
		this.state = {
			imgPath: '', // 图片路径
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
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'a',null,{left:'no'})
				},
				{
					title: '我的训练',
					id: 'train',
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'a',)
				},
				{
					title: '我的收藏',
					id: 'collect',
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'a')
				},
				{
					title: '我的数据',
					id: 'data',
					cursor: this.setCursorObj(this.props.pageId, this.myRandomId, 'a',null,{right:'no'})
				},
			],
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
				}
			],
			mtTitleId: 'vip', // 选择的信息
			navList: [],// 导航列表
			moduleId: 'fit',
			//是否隐藏初始化页面
			initDataVip: false,
			initDataNav: false,
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.getModuleCode = this.getModuleCode.bind(this);
		this.tagChose = this.tagChose.bind(this);
	}

	// 将要加载页面dom
	componentWillMount() {
		console.log('进入信息页', this.props.params);
		this.getUserVip()
	}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		// 获取导航
		this.getNav()
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
		shouldComponentCurrUpdate(nextProps, this, ['navList','myTitleList']);
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
			console.log('dom')
			this.props.editeDomList([this.state.navList]);
			this.props.editeDomList([this.state.myTitleList]);
			//将dom节点收集后，才设置当前节点
			this.props.setCursorDom(this.state.navList[0].cursor.random);
		}
		// 滚动元素盒子
		let currBox = $('.myinfo-page')
		// 当前焦点元素
		let currDom = $('.myinfo-page .curr')
		// 如果当前页面存在焦点，移动滚动条
		if(currDom.length > 0 && $('.myinfo-page').is(':visible')) {
			currBox.scrollTop(currBox.scrollTop() + currDom.offset().top - 374)
			console.log(currDom.offset().top)
		}
	}
	//监听键盘事件
	handleKeyDown(e) {
		//判断如果当前页面不再第一个的时候，忽略点击事件
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		//开始判断键盘逻辑
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			// 确认键点击
			console.log('模块列表')
			this.state.myTitleList.forEach((item,index)=> {
				if (item.cursor.curr) {
					this.setState({
						mtTitleId: item.id
					})
					this.tagChose()
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
		this.setState({
			moduleId: code
		})
		this.tagChose()
	}
	// 导航选项点击
	tagChose = (res) => {
		console.log(this.state.mtTitleId)
		console.log(this.state.moduleId)
		if(this.state.mtTitleId == 'vip') {
			this.getUserVip()
		}
	}
	// 获取用户会员数据
	async getUserVip() {
		try {
			let res = await userVipApi({
				moduleid: this.state.moduleId
			})
			if(res) {
				// 用户已购买会员
				console.log(res)
			} else {
				// 用户未购买会员，找模块会员
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
				// 用户已购买会员
				this.setState({
					cardList: res.result,
					imgPath: res.prefix,
				})
			} else {
				Toast.plain('会员卡获取失败！',2000)
			}
			console.log(res)
		} catch(e) {
			console.log(e)
		}
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
				<NavList 
					pageId={this.props.pageId}
					navBack={this.getModuleCode}
					compId={this.myRandomId}
					navList={this.state.navList}
					navImgpath={this.state.navImgpath}
					navCode={'fit'}
				></NavList>
				<div className={'myvip_box flex-bt'}>
					<div className={'myvip_user tc'}>
						<img className={'myvip_user_img'} src={this.props.userInfo.avatar} alt={'用户头像'}></img>
						<div className={'myvip_user_name mt40 fs32 line-clamp'}>{this.props.userInfo.nickname}</div>
						<div className={'myvip_user_btn fs32'}>退出登录</div>
						<img className={'myvip_user_qr'} src={this.props.userInfo.avatar} alt={'公众号二维码'}></img>
					</div>
					<div className={'myvip_card'}>
						{this.state.navList.map((item,index)=> {
							if(item.id === this.state.moduleId) {
								return (
									<div className={'myvip_card_title fs32'}>您还未购买<span className={'ml24'} style={{color:item.color}}>{item.title}会员卡</span></div>
								)
							}
						})}
						<div className={'module_box mt40 flex'}>
							{this.state.cardList.map((item,index)=> {
								return (
									<div className={'module_item4 mr40'}>
										<img className={'myvip_card_hotsell ' + (item.promotion === 1 ? '' : ' none')} src={require('../assets/images/hotsell.png')} alt={'热销'}></img>
										<div className={'myvip_card_card_title fs40 line-clamp-2'}>{item.title}</div>
										<div className={'myvip_card_card_price fs20'}>￥<span className={'myvip_card_card_price_big'}>{item.price}</span></div>
									</div>
								)
							})}
						</div>
						<div className={'myvip_card_vip'}></div>
						
						<div className={'myvip_card_desc fs26'}>
							<div className={'myvip_card_desc_title fs32'}>服务说明</div>
							<p>1.本应用仅限于三星电视，三星电视端应用与手机端应用内容不完全同步，App由艾数达科技开发运营和技术维护。</p>
							<p>2.如果用户在使用过程中遇到任何问题都可以微信搜索【艾数达智能电视应用】关注此公众号或扫描左方二维码关注公众号进行反馈。</p>
							<p>3.该商品为虚拟内容服务，购买后不支持退款，请谨慎购买，敬请谅解，可先体验免费课程！</p>
						</div>
					</div>
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

export default MyInfo = connect(mapState, mapDispatch)(MyInfo);
