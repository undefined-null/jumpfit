import { SET_USER_INFO, REMOVE_USER_INFO } from '../reducers/user';

// 设置用户信息，一般登录，或者有token的时候用
export const setUserInfo = data => ({
	type: SET_USER_INFO,
	data: data
});

// 删除用户的信息，一般退出登录的时候用
export const removeUserInfo = data => ({
	type: REMOVE_USER_INFO,
	data: data
});
