export const SET_NAV_LIST = 'SET_NAV_LIST';

export const navList = (state = [], action) => {
	switch (action.type) {
		case SET_NAV_LIST:
			return [...action.data];
		default:
			return state;
	}
};
