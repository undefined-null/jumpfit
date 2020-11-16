import React, { Component } from 'react';
import './Popup.less';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../../utils/pageDom';
import { connect } from 'react-redux';

// 纯函数中用hock
class Popup extends Component {
	constructor(props) {
		super(props);
		this.compId = this.getRandom(); //登录步骤
		this.state = {
			pageKey: {
				// 确认按钮
				affirmButton: {
					cursor: this.setCursorObj(this.props.pageId, this.compId, 'b')
				},
				// 取消按钮
				cancelButton: {
					cursor: this.setCursorObj(this.props.pageId, this.compId, 'b', true)
				}
			}
		};
		//绑定，取消绑定的时候，确保是一个函数
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
		//更新完毕后，删除dom节点
		this.props.deleteCompDom(this.compId);
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
					console.log('弹窗组件的按钮滴我anjii');
					//找到了点击的操作按钮
					if (key === 'affirmButton') {
						// 确认按钮
						this.props.affirmCallback();
					} else if (key === 'cancelButton') {
						// 取消按钮
						this.props.cancelCallback();
					}
				}
			}
		}
	}

	render() {
		return (
			<div className={'exit-app-page page-mask'}>
				<div className={'exit-app-box'}>
					<div className={'exit-desc tc'}>{this.props.affirmInfo.title}</div>
					<div className={'flex-ac flex-bt'}>
						<div
							className={'exit-button-box' + (this.state.pageKey.cancelButton.cursor.curr ? ' curr' : '')}
							ref={this.state.pageKey.cancelButton.cursor.refs}
						>
							<div className={'exit-button wi he flex-ajc'}>{this.props.affirmInfo.cancel}</div>
						</div>
						<div
							className={'exit-button-box' + (this.state.pageKey.affirmButton.cursor.curr ? ' curr' : '')}
							ref={this.state.pageKey.affirmButton.cursor.refs}
						>
							<div className={'exit-button wi he flex-ajc'}>{this.props.affirmInfo.affirm}</div>
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
export default connect(mapState, mapDispatch)(Popup);
