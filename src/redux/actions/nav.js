import { SET_NAV_LIST } from '../reducers/nav';

//设置商品列表，在个人中心提前获取，是为了用户进入商品购买的时候，不需要等待了
export const setNavList = data => ({
	type: SET_NAV_LIST,
	data: data
});
