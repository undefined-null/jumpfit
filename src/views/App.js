import React, { Component } from 'react';
// import logo from '../assets/img/logo.svg';
import { connect } from 'react-redux';
import './style/App.less';
import Home from './Home';
import ExitApp from './ExitApp';
import Logout from './Logout';
import ClassList from './ClassList';
import BrokenNetwork from './BrokenNetwork';
import Detail from './Detail';
import Video from './Video';
import Login from './Login';
import MyInfo from './MyInfo';
import Search from './Search';
import OrderQr from './OrderQr';
import Iframe from './Iframe';
import Toast from '../components/toast/Index';
import { getRandom, TvKeyCode, mapDispatch } from '../utils/pageDom';
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	//将要架在你dom的时候的声明周期
	componentWillMount() {
		//放置出错，先销毁toast，以防止焦点无法转移
		Toast.destroy();
		this.props.pushRouter({ name: 'home', pageId: getRandom() });

	}
	componentDidUpdate(prevProps, prevState) {
		// console.log('app更改完毕', prevProps, prevState);
	}
	shouldComponentUpdate(nextProps, nextState) {
		// console.log('shouldComponentUpdate', [...nextProps.router], [...this.props.router]);
		return true;
	}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		console.error('【error】浏览器类型，' + navigator.userAgent);
		Toast.destroy();
		// 添加键盘的点击事件
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		//当联网的时候触发的回调
		window.addEventListener(
			'online',
			() => {
				//如果最后一页是断网页面的时候，返回上一页v
				if (this.props.router[this.props.router.length - 1].name === 'brokenNetwork') {
					this.props.deleteRouter();
					this.props.deletePageDom();
				}
			},
			false
		);
		//当断网的时候触发的回调
		window.addEventListener(
			'offline',
			() => {
				// 断网直接去断网页面
				this.props.pushRouter({ name: 'brokenNetwork', pageId: getRandom() });
			},
			false
		);
	}
	render() {
		return (
			<div className="app-page">
				{/* <img src={this.state.img} alt=""></img> */}
				{this.props.router.map((item, index) => {
					// 只有最后一层是显示的，以上所有层都是隐藏的
					let display = index < this.props.router.length - 1 ? 'none' : '';
					// 判断，如果最后一层是已点歌曲的弹窗，就将上一层设置为可显示（只有最后一层是的时候才可以）
					if (
						(this.props.router[this.props.router.length - 1].name === 'exitApp'
							|| this.props.router[this.props.router.length - 1].name === 'login'
							|| this.props.router[this.props.router.length - 1].name === 'logout'
							|| this.props.router[this.props.router.length - 1].name === 'orderqr'
						) &&
						index === this.props.router.length - 2
					) {
						display = '';
					}
					if (item.name === 'home') {
						// 进入首页
						return <Home display={display} pageId={item.pageId} backParams={item.backParams} key={index}></Home>;
					} else if (item.name === 'classlist') {
						// 进入模板
						return (
							<ClassList display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></ClassList>
						);
					} else if (item.name === 'search') {
						// 进入搜索页
						return (
							<Search display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></Search>
						);
					} else if (item.name === 'detail') {
						// 进入详情
						return (
							<Detail display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></Detail>
						);
					} else if (item.name === 'video') {
						// 进入详情
						return (
							<Video display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></Video>
						);
					} else if (item.name === 'myinfo') {
						// 个人信息
						return (
							<MyInfo display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></MyInfo>
						);
					} else if (item.name === 'login') {
						// 登录二维码
						return (
							<Login display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></Login>
						);
					} else if (item.name === 'orderqr') {
						// 订单二维码
						return (
							<OrderQr display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></OrderQr>
						);
					} else if (item.name === 'iframe') {
						// 广告H5
						return (
							<Iframe display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></Iframe>
						);
					} else if (item.name === 'logout') {
						// 退出登录提醒页面
						return (
							<Logout display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></Logout>
						);
					} else if (item.name === 'exitApp') {
						// 退出程序提醒页面
						return (
							<ExitApp display={display} pageId={item.pageId} backParams={item.backParams} key={index} params={item.params}></ExitApp>
						);
					} else if (item.name === 'brokenNetwork') {
						// 退出程序提醒页面
						return (
							<BrokenNetwork
								display={display}
								pageId={item.pageId}
								key={index}
								params={item.params}
							></BrokenNetwork>
						);
					} else {
						return '';
					}
				})}
				{/* <Home></Home> */}
			</div>
		);
	}
	//监听键盘事件
	handleKeyDown(e) {
		console.log('点击键盘' + e.keyCode);
		switch (e.keyCode) {
			case TvKeyCode.KEY_LEFT:
				//方向左边
				// console.log('方向左边');
				this.props.nextCursorDom('left');
				break;
			case TvKeyCode.KEY_RIGHT:
				//方向右边
				// console.log('方向右边');
				this.props.nextCursorDom('right');
				break;
			case TvKeyCode.KEY_UP:
				//方向上边
				// console.log('方向上边');
				this.props.nextCursorDom('up');
				break;
			case TvKeyCode.KEY_DOWN:
				//方向下边
				// console.log('方向下边');
				this.props.nextCursorDom('down');
				break;
			case TvKeyCode.KEY_BACK:
				//返回按钮
				// console.log('返回上页');
				let returnArray = ['video','myinfo'];
				if (
					this.props.router.length > 1 &&
					this.props.router[this.props.router.length - 1].name !== 'myinfo1'
				) {
					if (returnArray.indexOf(this.props.router[this.props.router.length - 1].name) >= 0) {
						// 如果是在购买会员页面，返回上一页失效，用页面内的返回上一页
						return;
					}
					// 大于一页，可以返回到上一页
					this.props.deleteRouter();
					this.props.deletePageDom();
				} else {
					// 正在首页，暂时无法返回
					// alert('正在首页，暂时无法返回，后期加上退出操作');
					// this.props.pushRouter({ name: 'exitApp', pageId: getRandom() });
				}
				break;
			default:
			//  默认代码块
		}
	}
}
//【焦点】需要渲染什么数据
function mapState(state) {
	return {
		router: state.router,
		routerDomList: state.routerDomList,
		userInfo: state.userInfo,
	};
}
export default connect(mapState, mapDispatch)(App);
// export default App;
