export const CHANGE_SONG_NUM = 'CHANGE_SONG_NUM';

// 放置已选歌曲数据信息
export const selectSong = (state = { songNum: 0 }, action) => {
	switch (action.type) {
		case CHANGE_SONG_NUM:
			state.songNum = action.data;
			return { ...state };
		default:
			return state;
	}
};
