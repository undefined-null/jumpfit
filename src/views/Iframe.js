import React, { Component } from 'react';
import './style/Iframe.less';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import { connect } from 'react-redux';
import $ from 'jquery';

class Iframe extends Component {
	constructor(props) {
		super(props);
		//设置模块首页组件的随机标识
		this.iframeRandomId = this.getRandom();
		this.state = {
			iframeSrc: 'https://fanyi.baidu.com/', // 链接
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	// 将要加载页面dom
	componentWillMount() {
		console.log('加载Iframe', this.props.params);
		this.setState({
			iframeSrc: this.props.params.src
		})
		document.addEventListener('keydown', this.handleKeyDown);
	}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		// 获取导航
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
	}
	// 组件中途有更新dom，更新完成后的操作
	componentDidUpdate(prevProps, prevState) {
		
	}
	handleKeyDown(e) {
		console.log(e.keyCode)
	}
	// 页面渲染
	render() {
		return (
			<div className={'iframe-page page-mask flex-ajc ' + this.props.display}>
				<div>
					<iframe
						className={'iframe'}
						frameborder={0}
						src={this.state.iframeSrc}
					></iframe>
				</div>
			</div>
		);
	}

}
//【焦点】需要渲染什么数据
function mapState(state) {
	return {
		routerDomList: state.routerDomList,
	};
}

export default Iframe = connect(mapState, mapDispatch)(Iframe);
