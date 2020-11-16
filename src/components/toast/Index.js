import React from 'react';
import ReactDOM from 'react-dom';
import Toast from './toast';
import './toast.less';
import { localStore } from '../../utils/storage';

function createNotification() {
	const div = document.createElement('div');
	document.body.appendChild(div);
	const notification = ReactDOM.render(<Toast />, div);
	return {
		addNotice(notice) {
			return notification.addNotice(notice);
		},
		destroy() {
			ReactDOM.unmountComponentAtNode(div);
			document.body.removeChild(div);
		}
	};
}

let notification;
// 创建弹窗toast
const notice = (type, content, duration = 0, onClose) => {
	if (!notification) notification = createNotification();
	return notification.addNotice({ type, content, duration, onClose });
};

// 销毁弹窗toast
const destroy = () => {
	if (localStore.has('toast')) {
		localStore.remove('toast');
	}
	if (notification) {
		try {
			notification.destroy();
			notification = null;
		} catch (e) {
			console.error(e);
		}
	}
};

export default {
	// Toast.changLoading('已经是最后一首歌啦', 1000000);
	// 设计的提示弹窗，默认只有描述的时候不消失
	changInfo(content, duration, onClose) {
		return notice('changInfo', content, duration, onClose);
	},
	// 设计的转圈等待，默认只有描述的时候不消失
	changLoading(content, duration, onClose) {
		return notice('changLoading', content, duration, onClose);
	},
	// 普通的提示，没图标，默认只有描述的时候不消失
	plain(content, duration, onClose) {
		return notice('plain', content, duration, onClose);
	},
	// 普通的提示，有个叹号的图标，默认只有描述的时候不消失
	info(content, duration, onClose) {
		return notice('info', content, duration, onClose);
	},
	// 普通的提示，有个对号的图标，默认只有描述的时候不消失
	success(content = '操作成功', duration, onClose) {
		return notice('success', content, duration, onClose);
	},
	// 普通的提示，有个叉号的图标，默认只有描述的时候不消失
	error(content, duration, onClose) {
		return notice('error', content, duration, onClose);
	},
	// 普通的提示，有个转圈的图标，默认只有描述的时候不消失
	loading(content = '加载中...', duration = 0, onClose) {
		return notice('loading', content, duration, onClose);
	},
	// 没有样式提示，只会将点击事件给封死，调用destory还可以放开
	empty() {
		localStore.set('toast', 'true');
	},
	// 判断是否有弹窗，true就证明有toast，false就证明没有
	have() {
		return localStore.has('toast');
	},
	// 销毁页面中的toast提示窗口
	destroy() {
		return destroy();
	}
};
