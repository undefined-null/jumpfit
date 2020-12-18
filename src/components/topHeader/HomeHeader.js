import React from 'react';
import './HomeHeader.less';
import { userStatusApi } from '../../server/api';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../../utils/pageDom';
import { connect } from 'react-redux';
import Toast from '../../components/toast/Index';

class HomeHeader extends React.Component {
	constructor(props) {
		super(props);
		//设置头部组件的随机标识
		this.compId = this.getRandom();
		this.state = {
			buttonList: {
				// 顶部搜索按钮
				searchButton: {
					cursor: this.setCursorObj(this.props.pageId, this.compId, 'a', null, {
						top: 'no'
					})
				},
				// 开通会员按钮
				openVipButton: {
					cursor: this.setCursorObj(this.props.pageId, this.compId, 'a', null, {
						top: 'no'
					})
				},
				// 登录或者个人中心
				loginOrMineButton: {
					cursor: this.setCursorObj(this.props.pageId, this.compId, 'a', null, {
						top: 'no'
					})
				}
			}
		};
		this.ifUpdate = false; //是否重新更改组件
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	// 判断是否要移动焦点的时候，用的比较多
	componentWillReceiveProps(nextProps) {
		// 【焦点】根据新的props判断，是否移动焦点
		shouldComponentCurrUpdate(nextProps, this, ['buttonList']);
	}
	componentWillMount() {
		this.getUserStatus()
	}
	//页面渲染完成之后
	componentDidMount() {
		// 增加dom节点
		this.props.editeDomList([this.state.buttonList]);
		document.addEventListener('keydown', this.handleKeyDown);
	}
	// 更新完毕
	componentDidUpdate(prevProps, prevState) {
		
		// if (prevProps.userInfo.account_id !== this.props.userInfo.account_id) {
		// 	this.ifUpdate = true;
		// }
		if (prevProps.userInfo.id !== this.props.userInfo.id) {
			this.ifUpdate = true;
		}
		if (
			this.ifUpdate
		) {
			//当前页面已经是展示的页面
			this.ifUpdate = false;
			//更新完毕后，删除dom节点
			// this.props.deleteCompDom(this.compId);
			// // 增加dom节点
			// this.props.editeDomList([this.state.buttonList]);
		}
		// console.log('顶部更新')
		this.props.deleteCompDom(this.compId);
		this.props.editeDomList([this.state.buttonList]);
	}
	// 组件将要卸载
	componentWillUnmount() {
		// 卸载的时候，删掉当前组件的全局焦点
		document.removeEventListener('keydown', this.handleKeyDown);
	}
	//监听键盘事件
	handleKeyDown(e) {
		//判断如果当前页面不再第一个的时候，忽略点击事件
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		//开始判断键盘逻辑
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			// 搜索
			if(this.state.buttonList.searchButton.cursor.curr) {
				this.props.pushRouter({
					name: 'search',
					pageId: this.getRandom(),
				});
				return
			}
			// 个人中心
			if(this.state.buttonList.openVipButton.cursor.curr) {
				if(this.props.userInfo.id) {
					this.props.pushRouter({
						name: 'myinfo',
						pageId: this.getRandom(),
					});
				} else {
					Toast.plain('请您先登录',2000)
				}
				return
			}
			// 登录
			if(this.state.buttonList.loginOrMineButton.cursor.curr) {
				if(this.props.userInfo.id) {
					this.props.pushRouter({
						name: 'myinfo',
						pageId: this.getRandom(), 
						params: {
							title_id: 'data'
						}
					});
					
				} else {
					this.props.pushRouter({
						name: 'login',
						pageId: this.getRandom(),
					});
				}
				return
			}
		}
	}

	// 检查登录状态
	async getUserStatus() {
		try {
			let res = await userStatusApi()
			console.log('检查登录')
			if(res) {
				this.props.setUserInfo(res)
			}
		} catch(e) {
			console.log(e)
		}
	}
	render() {
		return (
			<div className={'home-header flex-ac'}>
				<img className={'logo'} alt="logo" src={require('../../assets/images/logohome.png')}></img>
				<div className={'flex-1'}></div>
				{/* 搜索框 */}
				<div
					className={'button-box flex-ac' + (this.state.buttonList.searchButton.cursor.curr ? ' curr' : '')}
					ref={this.state.buttonList.searchButton.cursor.refs}
				>
					<span className={'mlr32 search-text'}>请输入专辑名称</span>
					<img
						className={'button-icon mlr16'}
						src={require('../../assets/images/home_search.png')}
						alt="search-icon"
					></img>
				</div>
				<div
					className={
						'button-box flex-ac' + (this.state.buttonList.openVipButton.cursor.curr ? ' curr' : '')
					}
					ref={this.state.buttonList.openVipButton.cursor.refs}
				>
					<img
						className={'button-icon mlr16'}
						src={require('../../assets/images/home_vip1.png')}
						alt="search-icon"
					></img>
					<span className={'mr32'}>个人中心</span>
				</div>
				<div
					className={
						'button-box flex-ac' + (this.state.buttonList.loginOrMineButton.cursor.curr ? ' curr' : '')
					}
					ref={this.state.buttonList.loginOrMineButton.cursor.refs}
				>
					<img
						className={'button-icon'}
						src={this.props.userInfo.id ? this.props.userInfo.avatar : require('../../assets/images/home_head.png')}
						alt="search-icon"
					></img>
					{this.props.userInfo.id ? 
						<div  className={'ml16 mr24 flex-ac fs26'}>
							总时长(分钟):<span className={'font-bold fs32 ml16'}>{Math.floor(this.props.userInfo.total_duration/(60 *1000))}</span>
							<div className={'header_line'}></div>
							总消耗(千卡):<span className={'font-bold fs32 ml16'}>{parseInt(this.props.userInfo.total_calorie)}</span>
						</div>
					
					:
						<span  className={'ml16 mr24'}>登录</span>
					}
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

export default connect(mapState, mapDispatch)(HomeHeader);
