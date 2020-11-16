import { nextCursorLocation } from '../../utils/pageDom';
import Toast from '../../components/toast/Index.js';
export const ADD_DOM = 'ADD_DOM';
export const DELETE_COMP_DOM = 'DELETE_COMP_DOM';
export const NEXT_CURSOR_DOM = 'NEXT_CURSOR_DOM';
export const SET_CURSOR_DOM = 'SET_CURSOR_DOM';
export const PUSH_ROUTER = 'PUSH_ROUTER';
export const DELETE_ROUTER = 'DELETE_ROUTER';
export const DELETE_PAGE_DOM = 'DELETE_PAGE_DOM';

export const routerDomList = (state = [], action) => {
	switch (action.type) {
		case ADD_DOM:
			//编辑DOM结点，如果有就修改，没有就增加
			let boo = state.some(item => {
				return action.data.pageId === item.pageId;
			});
			if (boo) {
				//有的情况下，就在现有的基础上增加
				state.forEach(item => {
					if (action.data.pageId === item.pageId) {
						item.domList = item.domList.concat(action.data.domList);
					}
				});
			} else {
				state.push({
					pageId: action.data.pageId,
					domList: action.data.domList
				});
			}
			return state;
		case DELETE_COMP_DOM:
			// 删除组件级别的dom节点
			console.log('删除组件级别的dom节点', action);
			state.forEach(item => {
				if (action.data.pageId === item.pageId) {
					item.domList = item.domList.filter(domItem => {
						return domItem.compId !== action.data.compId;
					});
				}
			});
			return state;
		case DELETE_PAGE_DOM:
			// 删除页面级别的dom节点
			console.log('删除页面级别的dom节点', action);
			state.splice(state.length - action.data);
			return [...state];
		case NEXT_CURSOR_DOM:
			// 下一个节点的位置
			if (Toast.have()) {
				console.log('有toast弹窗，忽略当前的焦点操作');
				return state;
			}
			let nextDom = nextCursorLocation(state[state.length - 1].domList, action.data.direction);
			if (nextDom) {
				// console.log('reducer中获取到了下一个最优解', nextDom);
				// 更改下一个节点为选中状态
				state[state.length - 1].domList.forEach(item => {
					if (nextDom.random === item.random) {
						item.curr = true;
					} else {
						item.curr = false;
					}
				});
				return [...state];
			} else {
				// console.log('reducer没有找到下一个可以切换的焦点，不做处理');
				return state;
			}
		case SET_CURSOR_DOM:
			// 设置指定DOM节点的光标
			state[state.length - 1].domList.forEach(item => {
				if (action.data.random === item.random) {
					item.curr = true;
				} else {
					item.curr = false;
				}
			});
			return [...state];
		default:
			return state;
	}
};

export const router = (state = [], action) => {
	switch (action.type) {
		case PUSH_ROUTER:
			console.log('action：增加路由', action);
			//编辑DOM结点，如果有就修改，没有就增加
			state.push({
				name: action.data.name,
				pageId: action.data.pageId,
				params: action.data.params ? action.data.params : ''
			});
			return [...state];
		case DELETE_ROUTER:
			console.log('action：减少哦路由,等于退回上n页', action);
			//编辑DOM结点，如果有就修改，没有就增加
			state.splice(state.length - action.data.index);
			if (action.data.backParams) {
				//如果存在回退数据传递的话，就存入到页面的最后一个里
				state[state.length - 1].backParams = action.data.backParams;
			}
			return [...state];
		default:
			return state;
	}
};
