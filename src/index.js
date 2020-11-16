import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import './style/main.less';
import App from './views/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
// import { createStore } from 'redux';
import store from './redux/store/index';
import { setCursorObj, getRandom } from './utils/pageDom';
import { localStore } from './utils/storage';
import { sleep } from './utils/utils';
//将生产dom节点ref的方法设置为全局方法，在组件内就可以直接通过this.setCursorObj()使用了
React.Component.prototype.setCursorObj = setCursorObj;
//将生产随机数的方法设置为全局方法，在组件内就可以直接通过this.getRandom()使用了
React.Component.prototype.getRandom = getRandom;
//将封装好的增删改查localStorage的方法设置为全局方法，在组件内就可以直接通过this.localStore.set(key,value)使用了
React.Component.prototype.localStore = localStore;
//将封装好的【睡眠】方法设置为全局方法，在组件内就可以直接通过this.localStore.set(key,value)使用了
React.Component.prototype.sleep = sleep;
//将传入的refs节点转成位置数组设置为全局方法，在组件内就可以直接通过this.getRandom()使用了
// React.Component.prototype.mapObjectRefs = mapObjectRefs;

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
