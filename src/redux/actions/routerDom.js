import {
	ADD_DOM,
	DELETE_COMP_DOM,
	NEXT_CURSOR_DOM,
	SET_CURSOR_DOM,
	PUSH_ROUTER,
	DELETE_ROUTER,
	DELETE_PAGE_DOM
} from '../reducers/routerDom';

//增加页面结点
export const addDom = (pageId, domList) => ({
	type: ADD_DOM,
	data: { pageId: pageId, domList: domList }
});

//删除组件级别的dom
export const deleteCompDom = (pageId, compId) => ({
	type: DELETE_COMP_DOM,
	data: { pageId: pageId, compId: compId }
});

//删除页面级别的dom
export const deletePageDom = index => ({
	type: DELETE_PAGE_DOM,
	data: index
});

//下一个dom节点的光标
export const nextCursorDom = direction => ({
	type: NEXT_CURSOR_DOM,
	data: { direction: direction }
});

//设置指定dom节点的光标
export const setCursorDom = random => ({
	type: SET_CURSOR_DOM,
	data: { random: random }
});

//路由增加一个页面
export const pushRouter = data => ({
	type: PUSH_ROUTER,
	data: data
});
//路由减少一个页面
export const deleteRouter = (index, backParams = '') => ({
	type: DELETE_ROUTER,
	data: {
		index: index,
		backParams: backParams
	}
});
