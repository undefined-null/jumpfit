import React from 'react';
import './style/Init.less';
// 唱吧初始化页面，每次打开都会有
function Init() {
	return (
		<div className={'init-page flex-ajc flex-col'}>
			<img className={'logo'} alt="logo" src={require('../assets/images/logo.png')}></img>
		</div>
	);
}
export default Init;
