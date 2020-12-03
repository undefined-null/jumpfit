import { createStore, combineReducers } from 'redux';
import { routerDomList, router } from '../reducers/routerDom';
import { userInfo } from '../reducers/user';
import { navList } from '../reducers/nav';

const store = createStore(combineReducers({ routerDomList, router, userInfo, navList }));

export default store;
