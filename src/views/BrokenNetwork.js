import React, { Component } from 'react';
import './style/BrokenNetwork.less';
import { mapDispatch, TvKeyCode } from '../utils/pageDom';
import { connect } from 'react-redux';

// 纯函数中用hock
class BrokenNetwork extends Component {
	constructor(props) {
		super(props);
		this.compId = this.getRandom(); //登录步骤
		this.state = {
			// 正在检查网络
			checkOnline: false,
			pageKey: {
				// 确认是否退出
				checkButton: {
					cursor: this.setCursorObj(this.props.pageId, this.compId, 'b', true)
				}
			}
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	componentWillMount() {}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyDown);
		// 增加dom节点
		this.props.editeDomList([this.state.pageKey]);
	}
	// 判断是否要移动焦点的时候，用的比较多
	componentWillReceiveProps(nextProps) {
		// 这个页面只有1个焦点，所以不能转移
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
			// 点击键盘的时候
			for (let key in this.state.pageKey) {
				if (this.state.pageKey[key].cursor.curr) {
					//找到了点击的操作按钮
					if (key === 'checkButton') {
						// 退出程序
						console.log('检查网络是否正常');
						if (navigator.onLine) {
							// 回退到上一页
							this.props.deleteRouter();
							this.props.deletePageDom();
						} else {
							this.setState({
								checkOnline: true
							});
							setTimeout(() => {
								this.setState({
									checkOnline: false
								});
							}, 1500);
						}
					}
				}
			}
		}
	}

	render() {
		return (
			<div className={'broken-network-page flex-ajc flex-col'}>
				<img className={'network-icon'} src={require('../assets/images/null_wifi.png')} alt=""></img>
				<div className={'network-desc'}>
					{this.state.checkOnline ? '正在检查网络...' : '网络未连接，请重试'}
				</div>
				<div
					className={'exit-button-box' + (this.state.pageKey.checkButton.cursor.curr ? ' curr' : '')}
					ref={this.state.pageKey.checkButton.cursor.refs}
				>
					<div className={'exit-button wi he flex-ajc'}>确定</div>
				</div>
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
export default connect(mapState, mapDispatch)(BrokenNetwork);
