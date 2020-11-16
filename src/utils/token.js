// 因为cookie无法使用，所以这里准备用localstorage
import { localStore } from './storage';
// import cookie from 'react-cookies';

const TokenKey = 'token';

export function getToken() {
	// return cookie.load(TokenKey);
	return localStore.get(TokenKey);
}

export function setToken(token) {
	// return cookie.save(TokenKey, token);
	localStore.set(TokenKey, token);
}

export function removeToken() {
	// return cookie.remove(TokenKey);
	localStore.remove(TokenKey);
}
