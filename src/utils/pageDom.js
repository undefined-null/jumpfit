import React from 'react';
import {
	addDom,
	deleteCompDom,
	nextCursorDom,
	setCursorDom,
	pushRouter,
	deleteRouter,
	deletePageDom
} from '../redux/actions/routerDom';
import Toast from '../components/toast/Index';
import { setUserInfo, removeUserInfo, } from '../redux/actions/user';
import { setGoodsList } from '../redux/actions/goods';
import { changeSongNum } from '../redux/actions/index';

/**
 * @desc 获取随机数
 * @param {Number} 上一级的随机数，生成组合随机数
 */
export function getRandom(pageRandom) {
	return (pageRandom ? pageRandom + '_' : '') + Number.parseInt(Math.random() * 10000000000);
}

/**
 * @desc 封装光标对象
 * @param {pageRandom:Number} 页面的随机标识
 * @param {compRandom:Number} 组件的随机标识
 * @param {level:String} 元素的层级
 * @param {curr:Boolan} 元素是否点亮
 * @param {direction:Object} 判断焦点的移动条件，必须符合一下数据条件
 *  @description：left = ['right','yes','no']、right = ['left','yes','no']、top = ['yes','no']、bottom = ['yes','no']
 */
export function setCursorObj(
	pageRandom,
	compRandom,
	level = 'a',
	curr = false,
	direction = { left: 'yes', right: 'yes', top: 'yes', bottom: 'yes' }
) {
	//判断传入的方向对不对
	//下一步移动的动作， yes（可以移动，但是没有了就不移动），no（不可以移动），right(没有左边了就从上一层的右开始移动)
	direction.left = direction.left ? direction.left : 'yes';
	direction.right = direction.right ? direction.right : 'yes';
	direction.top = direction.top ? direction.top : 'yes';
	direction.bottom = direction.bottom ? direction.bottom : 'yes';
	//判断方向数据是否填写错误
	if (['right', 'yes', 'no'].indexOf(direction.left) < 0) {
		console.error('在设置焦点数据的时候，left方向参数设置错误，只能设置right/yes/no，当前页面pageId=' + pageRandom);
	} else if (['left', 'yes', 'no'].indexOf(direction.right) < 0) {
		console.error('在设置焦点数据的时候，right方向参数设置错误，只能设置left/yes/no，当前页面pageId=' + pageRandom);
	} else if (['yes', 'no'].indexOf(direction.top) < 0) {
		console.error('在设置焦点数据的时候，top方向参数设置错误，只能设置yes/no，当前页面pageId=' + pageRandom);
	} else if (['yes', 'no'].indexOf(direction.bottom) < 0) {
		console.error('在设置焦点数据的时候，bottom方向参数设置错误，只能设置yes/no，当前页面pageId=' + pageRandom);
	}

	return {
		pageId: pageRandom,
		compId: compRandom,
		random: pageRandom + '_' + compRandom + '_' + getRandom(),
		curr: curr,
		level: level,
		refs: React.createRef(),
		direction: direction
	};
}

/**
 * @desc 遍历传入的对象的dom.ref,将dom转成坐标，返回一个数组
 * @param {arguments} 传入的所有dom相关的数组或者对象
 */
export function mapObjectRefs(domObjList) {
	let refs = [];
	function handleRect(domObjItem) {
		//如果有多个焦点，就遍历全部导入
		if (domObjItem.cursorList) {
			for (let smKey in domObjItem.cursorList) {
				if (domObjItem.cursorList[smKey] && domObjItem.cursorList[smKey].refs.current) {
					let currentRect = domObjItem.cursorList[smKey].refs.current;
					let clientRect = currentRect.getBoundingClientRect();
					if (
						clientRect &&
						typeof clientRect === 'object' &&
						(clientRect['x'] === undefined || clientRect['x'] === '')
					) {
						clientRect = {
							x: clientRect['left'] ? clientRect['left'] : currentRect.offsetLeft,
							y: clientRect['top'] ? clientRect['top'] : currentRect.offsetTop,
							width: clientRect['width'] ? clientRect['width'] : currentRect.clientWidth,
							height: clientRect['height'] ? clientRect['height'] : currentRect.clientHeight,
							top: clientRect['top'] ? clientRect['top'] : currentRect.offsetTop,
							left: clientRect['left'] ? clientRect['left'] : currentRect.offsetLeft,
							right: clientRect['right']
								? clientRect['right']
								: currentRect.offsetLeft + currentRect.clientWidth,
							bottom: clientRect['bottom']
								? clientRect['bottom']
								: currentRect.offsetTop + currentRect.clientHeight
						};
					}
					refs.push({
						...domObjItem.cursorList[smKey],
						client: clientRect,
						refs: ''
					});
				}
			}
		}
		// 如果有单个焦点，也遍历导入，大部分是这种情况
		if (domObjItem.cursor && domObjItem.cursor.refs.current) {
			let currentRect = domObjItem.cursor.refs.current;
			let clientRect = currentRect.getBoundingClientRect();
			if (
				clientRect &&
				typeof clientRect === 'object' &&
				(clientRect['x'] === undefined || clientRect['x'] === '')
			) {
				clientRect = {
					x: clientRect['left'] ? clientRect['left'] : currentRect.offsetLeft,
					y: clientRect['top'] ? clientRect['top'] : currentRect.offsetTop,
					width: clientRect['width'] ? clientRect['width'] : currentRect.clientWidth,
					height: clientRect['height'] ? clientRect['height'] : currentRect.clientHeight,
					top: clientRect['top'] ? clientRect['top'] : currentRect.offsetTop,
					left: clientRect['left'] ? clientRect['left'] : currentRect.offsetLeft,
					right: clientRect['right']
						? clientRect['right']
						: currentRect.offsetLeft + currentRect.clientWidth,
					bottom: clientRect['bottom']
						? clientRect['bottom']
						: currentRect.offsetTop + currentRect.clientHeight
				};
			}
			refs.push({
				...domObjItem.cursor,
				client: clientRect,
				refs: ''
			});
		}
	}
	for (var i = 0; i < domObjList.length; i++) {
		// console.log('遍历出来的数：', Object.prototype.toString.call(arguments[i]));
		for (let key in domObjList[i]) {
			// console.log('【】', key);
			// console.log('【】', domObjList[i][key]);

			handleRect(domObjList[i][key]);

			if (!domObjList[i][key].cursor && !domObjList[i][key].cursorList) {
				// 外层没有找到焦点，循环内层继续找
				for (const k in domObjList[i][key]) {
					const element = domObjList[i][key][k];
					// 如果是对象 继续循环
					if (typeof element === 'object') {
						for (const k2 in element) {
							handleRect(element[k2]);
						}
					}
				}
			}
		}
	}
	return refs;
}

/**
 * @desc 封装的单个组件的mapDispatch方法，因为每个组件都有公共的此方法
 */
export function mapDispatch(dispatch, props) {
	// console.log('props', props);
	return {
		// 增加dom节点
		editeDomList: domObjList => {
			// console.log('😜', domObjList);
			// console.log('😁', mapObjectRefs(domObjList));
			dispatch(addDom(props.pageId, mapObjectRefs(domObjList)));
		},
		// 删除组件级别的dom节点
		deleteCompDom: compId => {
			if (!compId && !props.compId) {
				console.error('删除组件级别的dom节点，缺少compId');
			}
			dispatch(deleteCompDom(props.pageId, compId ? compId : props.compId));
		},
		// 删除页面的所有焦点,不传就回退一页，返回index就回退指定页数
		deletePageDom: index => dispatch(deletePageDom(index ? index : 1)),
		// 更改下一个节点位置
		nextCursorDom: direction => dispatch(nextCursorDom(direction)),
		// 设置指定光标节点位置（初始化后开始设置，以防止提前设置出现元素大一圈的情况）
		setCursorDom: random => dispatch(setCursorDom(random)),
		// 压路路由一个页面
		pushRouter: data => dispatch(pushRouter(data)),
		// 删除路由一个页面,不传就回退一页，返回index就回退指定页数
		deleteRouter: (index, backParams) => {
			//删除页面中的toast
			Toast.destroy();
			dispatch(deleteRouter(index ? index : 1, backParams));
		},
		// 将用户信息存放起来
		setUserInfo: data => dispatch(setUserInfo(data)),
		// 将用户信息删除
		removeUserInfo: data => dispatch(removeUserInfo()),
		// 获取会员购买列表
		setGoodsList: data => dispatch(setGoodsList(data)),
		// 修改已选歌曲的个数
		changeSongNum: num => dispatch(changeSongNum(num))
	};
}

/**
 * @desc app顶层组件中，添加上下左右的鼠标事件
 * @param {domList:Array} 传入的所有dom相关的数组或者对象
 * @param {direction:String} 操作的方向
 */

// export function addDirectionEventListener(handleKeyCallback) {
// 	console.log('---------');
// 	document.addEventListener('keydown', handleKeyDown);
// }
// function handleKeyDown(e) {
// 	console.log('😝');
// }

/**
 * @desc 计算光标下一步的位置
 * @param {domList:Array} 传入的所有dom相关的数组或者对象
 * @param {direction:String} 操作的方向
 */
export function nextCursorLocation(domList, direction) {
	if (direction === undefined) return;
	// 获取当前焦点位置
	let currents = domList.filter(item => {
		return item.curr;
	}),
		current = '';
	console.log(currents)
	// 检查当前焦点是否只有1个
	if (currents.length > 1) {
		console.error('当前焦点出现2个，请检查程序是否正确');
		return null;
	} else {
		current = currents[0];
	}
	if (!current) {
		console.error('当前页面没有选中的焦点，可能存在错误，或者有意为之');
		return null;
	} else if (current.direction[direction === 'up' ? 'top' : direction === 'down' ? 'bottom' : direction] === 'no') {
		console.error('当前有焦点，但是此方向【' + direction + '】被人为设置为不可走');
		return null;
	}
	// 判断搜索页面
	if(domList[0].compId.indexOf('search') > 0) {
		// 搜索页面独有移动方法
		if (direction === 'right' || direction === 'left') {
			let correctDom = [];
			if (direction === 'right') {
				// 方向右边，遍历找到一行中同层级的在当前元素右边的元素
				correctDom = domList.filter(item => {
					//找出符合下一步条件的dom元素
					// return current.client.x + current.client.width <= item.client.x && current.level === item.level;
					if(current.level === 'b'){
						return current.client.x + current.client.width <= item.client.x;
					} else if(current.level === 'a') {
						return current.client.x + current.client.width <= item.client.x && (item.level === 'a' || item.level === 'd');
					} else {
						return current.client.x + current.client.width <= item.client.x;
					}
				});
			} else {
				// 方向左边，遍历找到一行中同层级的在当前元素左边的元素
				console.log(correctDom)
				console.log(current)
				correctDom = domList.filter(item => {
				
					// 找出符合下一步条件的dom元素
					if(current.level === 'b'){
						return current.client.x >= item.client.x + item.client.width && item.level === 'b';
					} else if(current.level === 'a') {
						return current.client.x >= item.client.x + item.client.width && item.level === 'a';
					} else if(current.level === 'e') {
						return current.client.x >= item.client.x + item.client.width && (item.level === 'd' || item.level === 'e');
					} else {
						return current.client.x >= item.client.x + item.client.width;
					}

				});
				console.log(correctDom)

			}
			// 判断如果存在符合条件的元素，才进行焦点转移
			if (correctDom.length) {
				// console.log(direction + '存在符合条件的元素', { ...correctDom });
				//将符合条件的元素进行排序，找到最应该转移的一个dom元素
				correctDom = correctDom.sort((a, b) => {
					if (direction === 'right') {
						// 向右点击的时候，查找元素
						return a.client.x - b.client.x;
					} else {
						// 向左侧点击的时候，查找元素
						return b.client.x + b.client.width - (a.client.x + a.client.width);
					}
				});
				// console.log(direction + '符合条件的元素，进行最优排序', correctDom.length, [...correctDom]);
				// 开始筛选最优解
				if (
					correctDom.length === 1 ||
					(direction === 'right' && correctDom[0].client.x !== correctDom[1].client.x) ||
					(direction === 'left' &&
						correctDom[0].client.x + correctDom[0].client.width !==
						correctDom[1].client.x + correctDom[1].client.width)
				) {
					//只有一个备选对象的时候，直接转移焦点
					// console.log('选出了要转移的焦点', correctDom[0]);
					return correctDom[0];
				} else {
					// 先筛选出，在同一x轴的所有dom元素
					correctDom = correctDom.filter(item => {
						if (direction === 'right') {
							//向右转移焦点的时候
							return correctDom[0].client.x === item.client.x;
						} else {
							//想做转移焦点的时候
							return (
								correctDom[0].client.x + correctDom[0].client.width === item.client.x + item.client.width
							);
						}
					});
					//同级别的焦点存在多个的时候，开始计算最优解
					correctDom = correctDom.sort((a, b) => {
						//筛选距离当前圆度，重心最近的一个开始转移
						let currentGravity = current.client.y + (current.client.height / 2);
						return (
							Math.abs(a.client.y + (a.client.height / 2) - currentGravity) -
							Math.abs(b.client.y + (b.client.height / 2) - currentGravity)
						);
					});
					//当前第一个元素就是最优解，嘎嘎嘎
					// console.log('当前第一个元素就是最优解', correctDom[0]);
					return correctDom[0];
				}
				// console.log(direction + '符合条件的元素，排序后', { ...correctDom });
			} else {
				if (
					(direction === 'right' &&
						current.direction[direction === 'up' ? 'top' : direction === 'down' ? 'bottom' : direction] ===
						'left') ||
					(direction === 'left' &&
						current.direction[direction === 'up' ? 'top' : direction === 'down' ? 'bottom' : direction] ===
						'right')
				) {
					// 继续往左或者右没有焦点了，但是可以去上下层寻找新的焦点
					console.log('继续往' + direction + '没有焦点了，但是可以去上下层寻找新的焦点');
					if (direction === 'left') {
						//往当前元素的上一层的最右边寻找焦点
						correctDom = domList.filter(item => {
							//找出符合下一步条件的dom元素
							return current.client.y >= item.client.y + item.client.height && current.level === item.level;
						});
						if (correctDom.length) {
							// 寻找符合条件的右下角的元素
							// 判断逻辑，寻找上有层，元素右下角距离上一层box右下角做进的一个dom
							let windowWidth = document.querySelector('body').offsetWidth;
							correctDom = correctDom.sort((a, b) => {
								let aAidth = windowWidth - a.client.x - a.client.width;
								let aHeight = current.client.y - a.client.y - a.client.height;
								let bAidth = windowWidth - b.client.x - b.client.width;
								let bHeight = current.client.y - b.client.y - b.client.height;
								return (
									Math.sqrt(Math.pow(Math.abs(aAidth), 2) + Math.pow(Math.abs(aHeight), 2)) -
									Math.sqrt(Math.pow(Math.abs(bAidth), 2) + Math.pow(Math.abs(bHeight), 2))
								);
							});
							return correctDom[0];
						} else {
							console.error(direction + '不存在符合条件的元素，忽略操作1');
							return null;
						}
					} else if (direction === 'right') {
						// 往当前元素的下一层的最右边寻找焦点
						correctDom = domList.filter(item => {
							//找出符合下一步条件的dom元素
							return (
								current.client.y + current.client.height <= item.client.y && current.level === item.level
							);
						});
						if (correctDom.length) {
							// 寻找符合条件的右下角的元素
							// 判断逻辑，寻找下一层，元素左下角距离上一层box左下角做进的一个dom
							correctDom = correctDom.sort((a, b) => {
								let aAidth = a.client.x;
								let aHeight = a.client.y - current.client.y - current.client.height;
								let bAidth = b.client.x;
								let bHeight = b.client.y - current.client.y - current.client.height;
								return (
									Math.sqrt(Math.pow(Math.abs(aAidth), 2) + Math.pow(Math.abs(aHeight), 2)) -
									Math.sqrt(Math.pow(Math.abs(bAidth), 2) + Math.pow(Math.abs(bHeight), 2))
								);
							});
							return correctDom[0];
						} else {
							console.error(direction + '不存在符合条件的元素，忽略操作2');
							return null;
						}
					}
				} else {
					console.error(direction + '不存在符合条件的元素，忽略操作3');
					return null;
				}
			}
		} else if (direction === 'up' || direction === 'down') {
			let correctDom = [];
			if (direction === 'up') {
				// 方向上边，遍历找到一行中同层级的在当前元素右边的元素
				correctDom = domList.filter(item => {
					if(current.level === 'b') {
						return current.client.y >= item.client.y + item.client.height && (current.level === item.level || item.level === 'a');
					} else if(current.level === 'c') {
						return current.client.y >= item.client.y + item.client.height && 'b' === item.level;
					} else {
						return current.client.y >= item.client.y + item.client.height && current.level === item.level;
					}
				});
			} else {
				// 方向下边，遍历找到一行中同层级的在当前元素左边的元素
				correctDom = domList.filter(item => {
					// 找出符合下一步条件的dom元素
					if(current.level === 'b') {
						return current.client.y + current.client.height <= item.client.y && (current.level === item.level || item.level === 'c');
					} else if(current.level === 'a') {
						return current.client.y + current.client.height <= item.client.y && 'b' === item.level;
					} else {
						return current.client.y + current.client.height <= item.client.y && current.level === item.level;
					}
				});
			}
			// 判断如果存在符合条件的元素，才进行焦点转移
			if (correctDom.length) {
				// console.log(direction + '存在符合条件的元素', { ...correctDom });
				//将符合条件的元素进行排序，找到最应该转移的一个dom元素
				correctDom = correctDom.sort((a, b) => {
					if (direction === 'up') {
						// 向上点击的时候，查找元素
						if (a.level === b.level) {
							//同意层级的时候
							return b.client.y + b.client.height - (a.client.y + a.client.height);
						} else {
							return a.level < b.level ? 1 : -1;
						}
					} else {
						// 向下侧点击的时候，查找元素
						if (a.level === b.level) {
							//同意层级的时候
							return a.client.y - b.client.y;
						} else {
							return a.level < b.level ? -1 : 1;
						}
					}
				});
				
				if(direction === 'up'){
					let tempBordery = correctDom[0].client.y+correctDom[0].client.height;
					correctDom = correctDom.filter(item=> {
						if(item.client.y+item.client.height===tempBordery) {
							return true
						} else {
							return false
						}
					})
				} else {
					let tempBordery = correctDom[0].client.y;
					correctDom = correctDom.filter(item=> {
						
						if(item.client.y === tempBordery){
						return true;
						}else{
						return false;
						}
					})
				}
				// console.log(direction + '符合条件的元素，进行最优排序', correctDom.length, [...correctDom]);
				correctDom = correctDom.sort((a, b) => {
					// console.log('排序的时候的方法：', a.client.x, b.client.x);
					//筛选距离当前圆度，重心最近的一个开始转移
					let gravityX = current.client.x + current.client.width / 2;
					let gravityY = direction === 'up' ? current.client.y : current.client.bottom;
					let itemAX = a.client.x + a.client.width / 2;
					let itemAY = direction === 'up' ? a.client.bottom : a.client.y;

					let itemBX = b.client.x + b.client.width / 2;
					let itemBY = direction === 'up' ? b.client.bottom : b.client.y;
					return (
						Math.sqrt(Math.pow(Math.abs(gravityX - itemAX), 2) + Math.pow(Math.abs(gravityY - itemAY), 2)) -
						Math.sqrt(Math.pow(Math.abs(gravityX - itemBX), 2) + Math.pow(Math.abs(gravityY - itemBY), 2))
					);
				});
				return correctDom[0];
			} else {
				console.info(direction + '不存在符合条件的元素，忽略操作');
				return null;
			}
		}
	} else {
		// 开始进行方向操作
		if (direction === 'right' || direction === 'left') {
			let correctDom = [];
			if (direction === 'right') {
				// 方向右边，遍历找到一行中同层级的在当前元素右边的元素
				correctDom = domList.filter(item => {
					//找出符合下一步条件的dom元素
					return current.client.x + current.client.width <= item.client.x && current.level === item.level;
				});
			} else {
				// 方向左边，遍历找到一行中同层级的在当前元素左边的元素
				correctDom = domList.filter(item => {
					// 找出符合下一步条件的dom元素
					return current.client.x >= item.client.x + item.client.width && current.level === item.level;
				});
			}
			// 判断如果存在符合条件的元素，才进行焦点转移
			if (correctDom.length) {
				// console.log(direction + '存在符合条件的元素', { ...correctDom });
				//将符合条件的元素进行排序，找到最应该转移的一个dom元素
				correctDom = correctDom.sort((a, b) => {
					if (direction === 'right') {
						// 向右点击的时候，查找元素
						return a.client.x - b.client.x;
					} else {
						// 向左侧点击的时候，查找元素
						return b.client.x + b.client.width - (a.client.x + a.client.width);
					}
				});
				// console.log(direction + '符合条件的元素，进行最优排序', correctDom.length, [...correctDom]);
				// 开始筛选最优解
				if (
					correctDom.length === 1 ||
					(direction === 'right' && correctDom[0].client.x !== correctDom[1].client.x) ||
					(direction === 'left' &&
						correctDom[0].client.x + correctDom[0].client.width !==
						correctDom[1].client.x + correctDom[1].client.width)
				) {
					//只有一个备选对象的时候，直接转移焦点
					// console.log('选出了要转移的焦点', correctDom[0]);
					return correctDom[0];
				} else {
					// 先筛选出，在同一x轴的所有dom元素
					correctDom = correctDom.filter(item => {
						if (direction === 'right') {
							//向右转移焦点的时候
							return correctDom[0].client.x === item.client.x;
						} else {
							//想做转移焦点的时候
							return (
								correctDom[0].client.x + correctDom[0].client.width === item.client.x + item.client.width
							);
						}
					});
					//同级别的焦点存在多个的时候，开始计算最优解
					correctDom = correctDom.sort((a, b) => {
						//筛选距离当前圆度，重心最近的一个开始转移
						let currentGravity = current.client.y + current.client.height / 2;
						return (
							Math.abs(a.client.y + a.client.height / 2 - currentGravity) -
							Math.abs(b.client.y + b.client.height / 2 - currentGravity)
						);
					});
					//当前第一个元素就是最优解，嘎嘎嘎
					// console.log('当前第一个元素就是最优解', correctDom[0]);
					return correctDom[0];
				}
				// console.log(direction + '符合条件的元素，排序后', { ...correctDom });
			} else {
				if (
					(direction === 'right' &&
						current.direction[direction === 'up' ? 'top' : direction === 'down' ? 'bottom' : direction] ===
						'left') ||
					(direction === 'left' &&
						current.direction[direction === 'up' ? 'top' : direction === 'down' ? 'bottom' : direction] ===
						'right')
				) {
					// 继续往左或者右没有焦点了，但是可以去上下层寻找新的焦点
					console.log('继续往' + direction + '没有焦点了，但是可以去上下层寻找新的焦点');
					if (direction === 'left') {
						//往当前元素的上一层的最右边寻找焦点
						correctDom = domList.filter(item => {
							//找出符合下一步条件的dom元素
							return current.client.y >= item.client.y + item.client.height && current.level === item.level;
						});
						if (correctDom.length) {
							// 寻找符合条件的右下角的元素
							// 判断逻辑，寻找上有层，元素右下角距离上一层box右下角做进的一个dom
							let windowWidth = document.querySelector('body').offsetWidth;
							correctDom = correctDom.sort((a, b) => {
								let aAidth = windowWidth - a.client.x - a.client.width;
								let aHeight = current.client.y - a.client.y - a.client.height;
								let bAidth = windowWidth - b.client.x - b.client.width;
								let bHeight = current.client.y - b.client.y - b.client.height;
								return (
									Math.sqrt(Math.pow(Math.abs(aAidth), 2) + Math.pow(Math.abs(aHeight), 2)) -
									Math.sqrt(Math.pow(Math.abs(bAidth), 2) + Math.pow(Math.abs(bHeight), 2))
								);
							});
							return correctDom[0];
						} else {
							console.error(direction + '不存在符合条件的元素，忽略操作1');
							return null;
						}
					} else if (direction === 'right') {
						// 往当前元素的下一层的最右边寻找焦点
						correctDom = domList.filter(item => {
							//找出符合下一步条件的dom元素
							return (
								current.client.y + current.client.height <= item.client.y && current.level === item.level
							);
						});
						if (correctDom.length) {
							// 寻找符合条件的右下角的元素
							// 判断逻辑，寻找下一层，元素左下角距离上一层box左下角做进的一个dom
							correctDom = correctDom.sort((a, b) => {
								let aAidth = a.client.x;
								let aHeight = a.client.y - current.client.y - current.client.height;
								let bAidth = b.client.x;
								let bHeight = b.client.y - current.client.y - current.client.height;
								return (
									Math.sqrt(Math.pow(Math.abs(aAidth), 2) + Math.pow(Math.abs(aHeight), 2)) -
									Math.sqrt(Math.pow(Math.abs(bAidth), 2) + Math.pow(Math.abs(bHeight), 2))
								);
							});
							return correctDom[0];
						} else {
							console.error(direction + '不存在符合条件的元素，忽略操作2');
							return null;
						}
					}
				} else {
					console.error(direction + '不存在符合条件的元素，忽略操作3');
					return null;
				}
			}
		} else if (direction === 'up' || direction === 'down') {
			let correctDom = [];
			if (direction === 'up') {
				// 方向上边，遍历找到一行中同层级的在当前元素右边的元素
				correctDom = domList.filter(item => {
					//找出符合下一步条件的dom元素
					return current.client.y >= item.client.y + item.client.height;
				});
			} else {
				// 方向下边，遍历找到一行中同层级的在当前元素左边的元素
				correctDom = domList.filter(item => {
					// 找出符合下一步条件的dom元素
					return current.client.y + current.client.height <= item.client.y;
				});
			}
			// 判断如果存在符合条件的元素，才进行焦点转移
			if (correctDom.length) {
				// console.log(direction + '存在符合条件的元素', { ...correctDom });
				//将符合条件的元素进行排序，找到最应该转移的一个dom元素
				correctDom = correctDom.sort((a, b) => {
					if (direction === 'up') {
						// 向上点击的时候，查找元素
						if (a.level === b.level) {
							//同意层级的时候
							return b.client.y + b.client.height - (a.client.y + a.client.height);
						} else {
							return a.level < b.level ? 1 : -1;
						}
					} else {
						// 向下侧点击的时候，查找元素
						if (a.level === b.level) {
							//同意层级的时候
							return a.client.y - b.client.y;
						} else {
							return a.level < b.level ? -1 : 1;
						}
					}
				});
				
				if(direction === 'up'){
					let tempBordery = correctDom[0].client.y+correctDom[0].client.height;
					correctDom = correctDom.filter(item=> {
						if(item.client.y+item.client.height===tempBordery) {
							return true
						} else {
							return false
						}
					})
				} else {
					let tempBordery = correctDom[0].client.y;
					correctDom = correctDom.filter(item=> {
						
						if(item.client.y === tempBordery){
						return true;
						}else{
						return false;
						}
					})
				}
				// console.log(direction + '符合条件的元素，进行最优排序', correctDom.length, [...correctDom]);
				correctDom = correctDom.sort((a, b) => {
					// console.log('排序的时候的方法：', a.client.x, b.client.x);
					//筛选距离当前圆度，重心最近的一个开始转移
					let gravityX = current.client.x + current.client.width / 2;
					let gravityY = direction === 'up' ? current.client.y : current.client.bottom;
					let itemAX = a.client.x + a.client.width / 2;
					let itemAY = direction === 'up' ? a.client.bottom : a.client.y;

					let itemBX = b.client.x + b.client.width / 2;
					let itemBY = direction === 'up' ? b.client.bottom : b.client.y;
					return (
						Math.sqrt(Math.pow(Math.abs(gravityX - itemAX), 2) + Math.pow(Math.abs(gravityY - itemAY), 2)) -
						Math.sqrt(Math.pow(Math.abs(gravityX - itemBX), 2) + Math.pow(Math.abs(gravityY - itemBY), 2))
					);
				});
				return correctDom[0];
			} else {
				console.info(direction + '不存在符合条件的元素，忽略操作');
				return null;
			}
		}
	}

}

/**
 * @desc 判断当前页面是否应该更改焦点光标
 * @param {nextProps:Object} 下一步佳宁要变更的props
 * @param {that:Object} 当前页面的this
 * @param {stateKeys:Object} 要执行查询焦点转移的所有元素
 * @param {change:bollean}
 */
export function shouldComponentCurrUpdate(nextProps, that, stateKeys, change = true) {
	//有节点curr的组件，都在这里进行判断呢，当前节点是否切换了焦点
	if (
		nextProps.routerDomList.length &&
		that.props.routerDomList &&
		nextProps.routerDomList[nextProps.routerDomList.length - 1].domList.length ===
		that.props.routerDomList[that.props.routerDomList.length - 1].domList.length
	) {
		// 节点没有改变的情况下，判断是不是当前的页面
		let nextPropsDom = nextProps.routerDomList[nextProps.routerDomList.length - 1];
		if (nextPropsDom.pageId === that.props.pageId) {
			// 证明是当前页面要修改焦点，开始判断是否需要更新
			// console.log('【切换焦点go】证明是当前页面要修改焦点，开始判断是否需要更新');
			const boo = nextPropsDom.domList.some((item, index) => {
				// ？？？？？ 每次componentWillReceiveProps的时候，nextProps里的路由和当前组件里的props路由完全一样，所以不能判断出什么
				return item.curr !== that.props.routerDomList[that.props.routerDomList.length - 1].domList[index];
			});
			if (boo) {
				let returnRes = false; //记录当前组件是否要切换焦点
				// console.log('【切换焦点res】当前判断完毕，要切换焦点', nextPropsDom);
				function handleCursor(cursorItem, foo) {
					if (cursorItem.cursor && cursorItem.cursor.refs.current) {
						//一个元素一个焦点的情况
						// eslint-disable-next-line no-loop-func
						nextPropsDom.domList.some(nextItem => {
							if (
								cursorItem.cursor.random === nextItem.random &&
								cursorItem.cursor.curr !== nextItem.curr
							) {
								//找到了当前item和更新后的节点的焦点不一致，记录下来
								cursorItem.cursor.curr = nextItem.curr;
								foo = true;
								return true;
							} else {
								return false;
							}
						});
					} else if (cursorItem.cursorList) {
						//一个元素多个焦点的情况
						for (let cursorListKey in cursorItem.cursorList) {
							//有焦点的情况下才参与对比
							if (cursorItem.cursorList[cursorListKey].refs.current) {
								// eslint-disable-next-line no-loop-func
								nextPropsDom.domList.some(nextItem => {
									if (
										cursorItem.cursorList[cursorListKey].random ===
										nextItem.random &&
										cursorItem.cursorList[cursorListKey].curr !== nextItem.curr
									) {
										cursorItem.cursorList[cursorListKey].curr = nextItem.curr;
										foo = true;
										return true;
									} else {
										return false;
									}
								});
							}
						}
					}
				}
				stateKeys.forEach(keyItem => {
					//开始循环查找具体哪个数据要做焦点切换
					let foo = false;
					for (let key in that.state[keyItem]) {
						// 判断当前item，是否要更新成最新的
						handleCursor(that.state[keyItem][key], foo);

						if (!that.state[keyItem][key].cursor && !that.state[keyItem][key].cursorList) {
							// 焦点在数组内层的情况
							for (const k in that.state[keyItem][key]) {
								const element = that.state[keyItem][key][k];
								// 如果是对象 继续循环
								if (typeof element === 'object') {
									// console.log(element);
									for (const k2 in element) {
										handleCursor(element[k2], foo);
									}
								}
							}
						}
						// foo = check ? check : foo;
					}
					if (foo && change) {
						console.log('【切换焦点,有要切换的焦点，开始执行切换');
						//更新当前的dom节点
						let xxx = {};
						if (Object.prototype.toString.call(that.state[keyItem]) === '[object Array]') {
							// 判断当前数据是否是数组
							xxx[keyItem] = [...that.state[keyItem]];
						} else {
							// 如果不是数组，就当初object处理
							xxx[keyItem] = { ...that.state[keyItem] };
						}
						that.setState(xxx);
					}
					if (foo) {
						// 当前组件有要切换的焦点
						returnRes = true;
					}
				});
				return returnRes;
			} else {
				console.log('【切换焦点res】当前判断完毕，不要切换焦点xx');
				return false;
			}
		} else {
			console.log('【切换焦点】不是当前页面，不做curr的变更判断');
			return false;
		}
	} else {
		console.log('【切换焦点】节点变化了，这个不做curr的变更判断');
		return false;
	}
}

/**
 * @desc 键盘点击常量，用到的页面用这里的
 */
export const TvKeyCode = {
	KEY_1: 49, //
	KEY_2: 50, //
	KEY_3: 51, //
	KEY_4: 52, //
	KEY_5: 53, //
	KEY_6: 54, //
	KEY_7: 55, //
	KEY_8: 56, //
	KEY_9: 57, //
	KEY_0: 48, //
	KEY_MINUS: 189, //
	KEY_VOLUMEUP: 447, //
	KEY_VOLUMEDOWN: 448, //
	KEY_MUTE: 449, //d
	KEY_CHANNELUP: 427, //
	KEY_CHANNELDOWN: 428, //
	KEY_PREVIOUS: 412,
	KEY_NEXT: 417, //
	KEY_PAUSE: 19, //
	KEY_RECORD: 416, //
	KEY_PLAY: 415, //
	KEY_STOP: 413, //

	KEY_INFO: 457, //
	KEY_LEFT: 37, // 方向左
	KEY_RIGHT: 39, // 方向右
	KEY_UP: 38, // 方向上
	KEY_DOWN: 40, // 方向下
	KEY_ENTER: 13, // 确认按钮
	KEY_BACK:
		navigator.userAgent.toLocaleLowerCase().indexOf('tv') >= 0 ||
			navigator.userAgent.toLocaleLowerCase().indexOf('tizen') >= 0
			? 10009
			: 8, // 在三星机器上用10009（模拟器可以用esc代替）；在浏览器用8（back按键）
	KEY_RED: 403, //
	KEY_GREEN: 404, //
	KEY_YELLOW: 405, //
	KEY_BLUE: 406, //
	KEY_MENU: 18 //
};
