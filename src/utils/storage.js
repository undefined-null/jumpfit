// storage操作方法，转成各自的对象
/*
 * 添加监听set添加操作的事件(在构造函数中给handle添加bind(this))
 * window.addEventListener('setLocalStoreEvent', this.handle, false);
 * 移除监听set添加操作的事件
 * window.removeEventListener('setLocalStoreEvent', this.handle, false);
 * ------------------------------------
 * 添加监听remove删除操作的事件(在构造函数中给handle添加bind(this))
 * window.addEventListener('removeLocalStoreEvent', this.handle, false);
 * 移除监听remove删除操作的事件
 * window.removeEventListener('removeLocalStoreEvent', this.handle, false);
 * ------------------------------------
 * 添加监听clear清空操作的事件(在构造函数中给handle添加bind(this))
 * window.addEventListener('clearLocalStoreEvent', this.handle, false);
 * 移除监听clear清空操作的事件
 * window.removeEventListener('clearLocalStoreEvent', this.handle, false);
 */

/**
 * @desc 将歌曲添加到一点歌曲列表中
 * @param {Object} 要添加的歌曲
 */
export const localStore = {
	// 在localStorage中获取某个key/value值
	get: key => {
		let value = window.localStorage.getItem(key);
		try {
			return JSON.parse(value);
		} catch (e) {
			return value;
		}
	},
	// 网localStorage中设置某个key/value值
	set: (key, value) => {
		// 给设置item的事件添加监听抛出
		var setLocalStoreEvent = new Event('setLocalStoreEvent');
		setLocalStoreEvent.key = key; //将当前要设置的数据key抛出
		setLocalStoreEvent.newValue = value; //将当前要设置的新数据data值抛出
		// 将object数据转成json字符串形式
		if (typeof value === 'object') {
			value = JSON.stringify(value);
		}
		// 将数据存储起来
		window.localStorage.setItem(key, value);
		// 抛出监听事件
		window.dispatchEvent(setLocalStoreEvent);
	},
	// 判断localStorage中某个数据是否存在
	has: key => {
		let value = window.localStorage.getItem(key);
		if (!value) {
			return false;
		} else {
			return true;
		}
	},
	// 删除localStorage中的某个数据
	remove: key => {
		// 给删除item的事件添加监听抛出
		var removeLocalStoreEvent = new Event('removeLocalStoreEvent');
		removeLocalStoreEvent.key = key; //将当前要删除的key值抛出
		// 将指定key的数据删除
		window.localStorage.removeItem(key);
		// 抛出监听事件
		window.dispatchEvent(removeLocalStoreEvent);
	},
	// 清除存储对象中所有的键
	clear: () => {
		// 给清空localStorage的事件添加监听抛出
		var clearLocalStoreEvent = new Event('clearLocalStoreEvent');
		// 将指定key的数据删除
		window.localStorage.clear();
		// 抛出监听事件
		window.dispatchEvent(clearLocalStoreEvent);
	}
};
