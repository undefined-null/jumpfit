import axios from 'axios';
// import md5 from 'js-md5';
// import Qs from 'qs';
// import { Toast } from 'vant';
// import store from '@/store'
// import { getToken, removeToken } from './token';
import Toast from '../components/toast/Index';
// import { objKeySort } from './utils';

// create an axios instance
const service = axios.create({
	baseURL: process.env.REACT_APP_ENV === 'dev' ? '' : process.env.REACT_APP_API,
	// baseURL: 'http://api.dig88.cn/jumpfit/public/',
	// baseURL: '',
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 15000, // request timeout
	// responseType: 'blob'
	// headers: {
	// 	'Content-Type': 'multipart/form-data'
	// }
	headers: {
		'Content-Type': 'application/json;charset=UTF-8'
	}
});

// request拦截器，每次发起请求都会调用这个方法
service.interceptors.request.use(
	config => {
		// if (config.url.indexOf('http://new.hat219.top') >= 0 || config.url.indexOf('http://api.dig88.cn') >= 0) {
		// 	config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		// 	config.data = Qs.stringify(config.data);
		// }
		return config;
	},
	error => {
		console.log(error); // for debug
		return Promise.reject(error);
	}
);

// response 拦截器
service.interceptors.response.use(
	response => {
		if (response.status === 200) {
			// return response.data;
			if (response.data && response.data.code === 200) {
				// console.log(response)
				return response.data.result;
			}
			// else if (response.data && response.data.code === 403) {
			// removeToken();
			// Toast('登录信息未通过验证，请重新登录');
			// if (window.location.href.indexOf('register') > 0) return; //如果当前页是login则不再跳转
			// //跳转到登录页面，并且带着上个页面的信息，支持会跳回去
			// let redirect =
			// 	window.location.pathname + window.location.search + window.location.hash;
			// redirect = redirect.replace(process.env.BASE_URL, '/');
			// window.location.href = process.env.BASE_URL + `register?redirect=${redirect}`;
			// return response.data;
			// } else {
			// Toast('请求错误：' + response.data.code + '----' + response.data.msg);
			// return Promise.resolve(response.data);
			// return Promise.reject({})
			// }
		}
	},
	error => {
		// Toast('请求错误：' + error)
		// console.log('err:' + error); // for debug
		return Promise.reject(error);
	}
);

// export default service;
function apiAxios(method, url, params) {
	if (!params) {
		//传参为空的情况下
		params = {};
	}
	// //将保底的频道id加上
	// params.default_channelid = process.env.REACT_APP_CHANNEL_ID;
	// //进行参数排序
	// params = objKeySort(params);
	// //将对象转成key=value&key=value形式
	// let tempParamArr = [],
	// 	tempParamStr = '';
	// for (let key in params) {
	// 	tempParamArr.push(key + '=' + params[key]);
	// }
	// tempParamStr = tempParamArr.join('&') + process.env.REACT_APP_TOKEN;
	// // console.log(tempParamStr);
	// //将sing参数加到访问参数中
	// params.sign = md5(tempParamStr);
	// params.sign_type = 'MD5';
	// 开始执行查询操作
	return new Promise((resolve, reject) => {
		let addUrl = '';
		if (method === 'POST' && url.indexOf('http') < 0) {
			// if (method === 'POST') {
			//如果是post形式传参，也需要在url后加上签名数据
			let tempArr = [];
			for (let key in params) {
				tempArr.push(key + '=' + params[key]);
			}
			addUrl = tempArr.join('&');
			addUrl = addUrl.length ? '?' + addUrl : '';
		}
		service({
			method: method,
			url: url + addUrl,
			data: method === 'POST' || method === 'PUT' ? params : null, //post形式传传参
			params: method === 'GET' || method === 'DELETE' ? params : null //get形式传参
		})
			.then(function (res) {
				// console.log('返回结果了', url);
				resolve(res);
				// if (res.code === 0) {
				// 	resolve(res.result);
				// } else if (url.indexOf('http') >= 0) {
				// 	resolve(res);
				// } else {
				// 	// 弹出错误信息
				// 	console.error('接口返回错误：', res.message);
				// 	// 接口错误，不是网络原因
				// 	// Toast.error(res.message, 1500);
				// 	reject(res);
				// }
			})
			.catch(function (error) {
				// window.console.log('接口网络错误', error, error.response);
				Toast.error('网络请求失败，请返回上页重试',10);
				//判断是否断网，如果断网就去断网页面，不做其他处理了
				if (error.response) {
					// 请求已发出，但服务器响应的状态码不在 2xx 范围内,弹出错误信息
					console.error(error.response.status);
					// reject(error.response.status);
				} else {
					//超时的情况下，走这个
					window.console.log('Error', error.message);
					// reject(error);
				}
			});
	});
}

export default {
	get: function (url, params, response) {
		return apiAxios('GET', url, params, response);
	},
	post: function (url, params, response) {
		return apiAxios('POST', url, params, response);
	},
	put: function (url, params, response) {
		return apiAxios('PUT', url, params, response);
	},
	delete: function (url, params, response) {
		return apiAxios('DELETE', url, params, response);
	}
};
