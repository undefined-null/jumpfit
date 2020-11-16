import React, { Component } from 'react';
import './style/ExitApp.less';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import { connect } from 'react-redux';

// 纯函数中用hock
class ExitApp extends Component {
	constructor(props) {
		super(props);
		this.compId = this.getRandom(); //登录步骤
		this.state = {
			pageKey: {
				// 退出程序按钮
				exitButton: {
					cursor: this.setCursorObj(this.props.pageId, this.compId, 'b')
				},
				// 继续唱歌按钮
				singButton: {
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
		shouldComponentCurrUpdate(nextProps, this, ['pageKey']);
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
					if (key === 'exitButton') {
						console.log('退出程序');
						// 退出程序
						// window.close();
						window.tizen.application.getCurrentApplication().exit();
					} else if (key === 'singButton') {
						// 继续唱歌
						// 回退到上一页
						this.props.deleteRouter();
						this.props.deletePageDom();
					}
				}
			}
		}
	}

	render() {
		return (
			<div className={'exit-app-page page-mask'}>
				<div className={'exit-app-box'}>
					<div className={'exit-desc tc'}>您确定要退出吗？</div>
					<div className={'flex-ac flex-bt'}>
						<div
							className={'exit-button-box' + (this.state.pageKey.singButton.cursor.curr ? ' curr' : '')}
							ref={this.state.pageKey.singButton.cursor.refs}
						>
							<div className={'exit-button wi he flex-ajc'}>继续训练</div>
						</div>
						<div
							className={'exit-button-box' + (this.state.pageKey.exitButton.cursor.curr ? ' curr' : '')}
							ref={this.state.pageKey.exitButton.cursor.refs}
						>
							<div className={'exit-button wi he flex-ajc'}>退出</div>
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
		routerDomList: state.routerDomList
	};
}
export default connect(mapState, mapDispatch)(ExitApp);
