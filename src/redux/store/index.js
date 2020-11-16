import { createStore, combineReducers } from 'redux';
import { routerDomList, router } from '../reducers/routerDom';
import { userInfo } from '../reducers/user';
import { goodsList } from '../reducers/goods';

const store = createStore(combineReducers({ routerDomList, router, userInfo, goodsList }));

export default store;
