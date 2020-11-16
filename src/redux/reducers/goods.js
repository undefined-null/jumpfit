export const SET_GODDS_LIST = 'SET_GODDS_LIST';

export const goodsList = (state = [], action) => {
	switch (action.type) {
		case SET_GODDS_LIST:
			return [...action.data];
		default:
			return state;
	}
};
