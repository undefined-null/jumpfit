import { CHANGE_SONG_NUM } from '../reducers/index';

// 已选歌曲修改已选个数
export const changeSongNum = num => ({
	type: CHANGE_SONG_NUM,
	data: num
});
