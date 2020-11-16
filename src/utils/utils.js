/**
 * @desc 将对象按照key的大小升序排序
 * @param {Array} 要排序的数组
 */
export function objKeySort(arys) {
	//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
	var newkey = Object.keys(arys).sort();
	//console.log('newkey='+newkey);
	var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
	for (var i = 0; i < newkey.length; i++) {
		//遍历newkey数组
		newObj[newkey[i]] = arys[newkey[i]];
		//向新创建的对象中按照排好的顺序依次增加键值对
	}
	return newObj; //返回排好序的新对象
}

/**
 * @desc sleep函数
 * @param {Number} 书面毫秒数
 * 用法：async await / sleep(500).then(() => {})
 */

export function sleep(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

/*
 * public methods by jame.d
 * 根据（时间/时间戳格）式化时间
 * 例子：formatTimeByDate(1580641846,"yyyy-MM-dd hh:mm:ss")
 * 例子：formatTimeByDate(new Date(),"yyyy-MM-dd hh:mm:ss")
 */
export const formatTimeByDate = (time, fmt) => {
	console.log('he------->', time);
	if (typeof time == 'number') {
		//如果传入的是时间戳，就将时间戳转成时间
		time = new Date(time);
	} else if (typeof time == 'string') {
		time = new Date(time);
	}
	console.log('---', time);
	var o = {
		'M+': time.getMonth() + 1, //月份
		'd+': time.getDate(), //日
		'h+': time.getHours(), //小时
		'm+': time.getMinutes(), //分
		's+': time.getSeconds(), //秒
		'q+': Math.floor((time.getMonth() + 3) / 3), //季度
		S: time.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
	return fmt;
};

//根据开始时间和结束时间算出时间差值   01:06:34
export const duration = (start, end, type = 'day') => {
	console.log('duration -> start, end', start, end);
	let startTime = Date.parse(new Date(start.replace(/-/g, '/'))) / 1000;
	let endTime = Date.parse(new Date(end.replace(/-/g, '/'))) / 1000;
	let times = endTime - startTime;
	// console.log('111', endTime , startTime, endTime - startTime)
	if (times < 0) {
		return '';
	}
	console.log('times', times);
	let seconds = times % 60;
	let minutes = Math.floor(times / 60) % 60;
	let hours = Math.floor(times / 60 / 60) % 24;
	let days = Math.floor(times / 60 / 60 / 24) % 365;
	let years = Math.floor(times / 60 / 60 / 24 / 365);
	console.log('day', days);
	if (type === 'day') {
		return (years > 0 ? years + '年' : '') + (days > 0 ? days + '天' : '');
	} else {
		days = Math.floor(times / 60 / 60 / 24);
		return (
			(days > 0 ? days + '天 ' : '') +
			(hours < 10 ? '0' + hours : hours) +
			':' +
			(minutes < 10 ? '0' + minutes : minutes) +
			':' +
			(seconds < 10 ? '0' + seconds : seconds)
		);
	}
};

//根据时间戳算出时间
export const durationTimes = times => {
	//算出天数
	let days = Math.floor(times / (24 * 3600 * 1000));
	// 算出小时数
	var leave1 = times % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000));
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000);
	return (
		(days ? days + '天' : '') +
		(hours ? hours + '小时' : '') +
		(minutes ? minutes + '分钟' : '') +
		(seconds ? seconds + '秒' : '')
	);
};
