import { SET_GODDS_LIST } from '../reducers/goods';

//设置商品列表，在个人中心提前获取，是为了用户进入商品购买的时候，不需要等待了
export const setGoodsList = data => ({
	type: SET_GODDS_LIST,
	data: data
});
