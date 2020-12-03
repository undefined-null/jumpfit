import React, { Component } from 'react';
import { localStore } from '../../utils/storage';

class ToastBox extends Component {
	constructor() {
		super();
		this.transitionTime = 300;
		this.state = { notices: [] };
		this.removeNotice = this.removeNotice.bind(this);
	}

	getNoticeKey() {
		const { notices } = this.state;
		return `notice-${new Date().getTime()}-${notices.length}`;
	}

	addNotice(notice) {
		const { notices } = this.state;
		notice.key = this.getNoticeKey();

		// notices.push(notice);//展示所有的提示
		notices[0] = notice; //仅展示最后一个提示

		this.setState({ notices });
		if (notice.duration > 0) {
			setTimeout(() => {
				this.removeNotice(notice.key);
			}, notice.duration);
		}
		return () => {
			this.removeNotice(notice.key);
		};
	}

	removeNotice(key) {
		const { notices } = this.state;
		this.setState({
			notices: notices.filter(notice => {
				if (notice.key === key) {
					if (notice.onClose) setTimeout(notice.onClose, this.transitionTime);
					return false;
				}
				return true;
			})
		});
	}
	//组件加载了
	componentDidMount() {
		localStore.set('toast', true);
	}
	// 组件更改的配置，键盘是否应该加上toast
	componentDidUpdate() {
		if (this.state.notices.length) {
			localStore.set('toast', true);
		} else {
			localStore.remove('toast');
		}
	}
	// 组件要卸载了
	componentWillUnmount() {
		localStore.remove('toast');
		console.log('toast组件要鞋子啊了');
	}

	render() {
		const { notices } = this.state;
		const icons = {
			info: 'toast_info',
			success: 'toast_success',
			error: 'toast_error',
			loading: 'toast_loading'
		};
		return (
			<div className="toast-mask">
				{notices.map(notice => {
					if (notice.type === 'changInfo') {
						// 项目设计的弹出toast
						return (
							<div className="page-back-toast" key={notice.key}>
								{notice.content}
							</div>
						);
					} else if (notice.type === 'changLoading') {
						// 项目设计的弹出loading
						return (
							<img
								src={require('../../assets/images/loading.gif')}
								alt=""
								className="toast-loading-icon"
								key={notice.key}
							></img>
						);
					} else if (notice.type === 'plain') {
						// 项目设计的弹出loading
						return (
							<div className="toast_plain flex-ajc" key={notice.key}>
								<div className="toast_text">{notice.content}</div>
							</div>
							);
					} else {
						// 默认的样式
						return (
							<div className="toast_box" key={notice.key}>
								<div className={`toast_icon ${icons[notice.type]}`}></div>
								<div className="toast_text">{notice.content}</div>
							</div>
						);
					}
				})}
			</div>
		);
	}
}

export default ToastBox;
// export default connect(null, mapDispatch)(ToastBox);
