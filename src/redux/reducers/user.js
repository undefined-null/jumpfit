export const SET_USER_INFO = 'SET_USER_INFO';
export const REMOVE_USER_INFO = 'REMOVE_USER_INFO';

export const userInfo = (state = {}, action) => {
	switch (action.type) {
		case SET_USER_INFO:
			return { ...state, ...action.data };
		case REMOVE_USER_INFO:
			return {};
		default:
			return state;
	}
};
