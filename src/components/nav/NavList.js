import React from 'react';
import './NavList.less';
import {
	mapDispatch,
	TvKeyCode,
	shouldComponentCurrUpdate
} from '../../utils/pageDom';
import {
	connect
} from 'react-redux';

class NavList extends React.Component {
	constructor(props) {
		super(props);
		//设置头部组件的随机标识
		this.compId = this.getRandom();
		this.navListId = this.getRandom();
		this.state = {
			navListBox: React.createRef(),
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
				},
				// 已经点的歌曲
				alreadyClickButton: {
					cursor: this.setCursorObj(this.props.pageId, this.compId, 'a', null, {
						top: 'no'
					})
				},
				// 设置按钮
				settingButton: {
					cursor: this.setCursorObj(this.props.pageId, this.compId, 'a', null, {
						top: 'no'
					})
				}
			},
			navList: [
				{
					title: '精选',
					id: 'chosen',
					cover: '',
					cursor: this.setCursorObj(this.props.pageId, this.navListId, 'b')
				}
			],
			navCode: 'jingxuan',
		};
		this.ifUpdate = false; //是否重新更改组件
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	// 判断是否要移动焦点的时候，用的比较多
	componentWillReceiveProps(nextProps) {
		// 【焦点】根据新的props判断，是否移动焦点
		shouldComponentCurrUpdate(nextProps, this, ['navList']);
	}
	// 页面渲染之前
	componentWillMount() {
		this.setState({
			navCode: this.props.navCode
		})
	}
	//页面渲染完成之后
	componentDidMount() {
		// 增加dom节点
		// this.props.editeDomList([this.props.navList]);
		document.addEventListener('keydown', this.handleKeyDown);
	}
	// 更新完毕
	componentDidUpdate(prevProps, prevState) {
		// 增加dom节点
		if (
			this.props.routerDomList[this.props.routerDomList.length - 1].pageId === this.props.pageId &&
			this.ifUpdate
		) {
			//当前页面已经是展示的页面
			this.ifUpdate = false;
			//更新完毕后，删除dom节点
			// this.props.deleteCompDom(this.compId);
			// // 增加dom节点
			// this.props.editeDomList([this.props.navList]);
		}
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
		// 全键盘的时候
			for (let key in this.props.navList) {
				if (this.props.navList[key].cursor.curr) {
					let id = this.props.navList[key].id
					if (id !== this.state.navCode) {
						this.setState({
							navCode: id
						})
						this.props.navBack(this, this.props.navList[key].id)
					}
				}
			}
		}
	}
	
					// <div className={'wi he flex-ajc'}>{item.title}</div>
	render() {
		return (<div className={'nav-list flex-ac flex-bt'} ref={this.state.homeListBox}>
			{this.props.navList.map((item, index) => {
				return (<div className={'nav-item flex-ac' + (item.cursor.curr ? ' curr' : '') + (this.props.navCode === item.id ? ' on' : '')}
					ref={item.cursor.refs}
					key={item.id}
				>
					<img className={'nav-img'} src={this.props.navImgpath + item.cover} alt={item.title}></img>
				</div>
				)
			})
			}
		</div>
		);
	}
	
}

//【焦点】需要渲染什么数据
function mapState(state) {
	return {
		routerDomList: state.routerDomList
	};
}

export default connect(mapState, mapDispatch)(NavList);