import React, { Component } from 'react';
import './style/Video.less';
import { albumDetailApi,videoApi,videoUpdataApi,sportUpdataApi } from '../server/api';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import { toVideoTime } from '../utils/utils';
import { connect } from 'react-redux';
import Toast from '../components/toast/Index';
import Popup from '../components/affirm/Popup';
import $ from 'jquery';

class Video extends Component {
	constructor(props) {
		super(props);
		//设置模块首页组件的随机标识
		this.videoRandomId = this.getRandom();
		this.timer = null;
		this.state = {
			videoId: '', // 视频ID
			albumId: '', // 专辑ID
			videoInfo: { // 视频信息
				
			},
			videoPlay: false, // 播放状态
			videoTime: '00:00', // 播放时间
			videoDtime: '00:00', // 视频时长
			videoLineWidth: 0, // 进度条宽度
			videoRef: React.createRef(),
			imgPath: '', // 图片根路径
			album: { // 专辑信息
				
			},
			detailList: [ // 详情列表 
			],
			recList: [ // 推荐列表
				
			],
			//是否隐藏初始化页面
			initDataVip: false,
			affirmDelete: false, // 退出弹窗
			affirmInfo: {
				title: '您确定要结束训练吗？',
				affirm: '确定',
				cancel: '继续训练',
			},
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.__timeupdate = this.__timeupdate.bind(this);
		this.__onended = this.__onended.bind(this);
		this.__playing = this.__playing.bind(this);
		this.__waiting = this.__waiting.bind(this);
		this.__loadedmetadata = this.__loadedmetadata.bind(this);
		this.__canplay = this.__canplay.bind(this);
	}

	// 将要加载页面dom
	componentWillMount() {
		console.log('进入播放页面', this.props.params);
		// this.getVideo(this.props.params.video_id)
		// this.getAlbum(this.props.params)
	}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		// 获取导航
		document.addEventListener('keydown', this.handleKeyDown);
		this.props.editeDomList([],'video');
		
		this.getVideo(this.props.params.video_id)
		this.setState({
			detailList: this.props.params.video_list
		})
		// this.getAlbum(this.props.params)
		// 绑定播放器
		this.state.videoRef.current.addEventListener('timeupdate', this.__timeupdate);
		this.state.videoRef.current.addEventListener('ended', this.__onended);
		this.state.videoRef.current.addEventListener('playing', this.__playing);
		this.state.videoRef.current.addEventListener('waiting', this.__waiting);
		this.state.videoRef.current.addEventListener('loadedmetadata', this.__loadedmetadata);
		this.state.videoRef.current.addEventListener('canplay', this.__canplay);
	}
	// 组件将要卸载
	componentWillUnmount() {
		// 卸载的时候，删掉当前组件的全局焦点
		document.removeEventListener('keydown', this.handleKeyDown);
		this.state.videoRef.current.removeEventListener('timeupdate', this.__timeupdate);
		this.state.videoRef.current.removeEventListener('onended', this.__onended);
		this.state.videoRef.current.removeEventListener('playing', this.__playing);
		this.state.videoRef.current.removeEventListener('waiting', this.__waiting);
		this.state.videoRef.current.removeEventListener('loadedmetadata', this.__loadedmetadata);
		this.state.videoRef.current.removeEventListener('canplay', this.__canplay);
	}
	// 判断是否要移动焦点的时候，用的比较多
	componentWillReceiveProps(nextProps) {
		// 【焦点】根据新的props判断，是否移动焦点
		shouldComponentCurrUpdate(nextProps, this, ['navList','myTitleList']);
	}
	// 组件中途有更新dom，更新完成后的操作
	componentDidUpdate(prevProps, prevState) {
		// if (
		// 	this.state.initDataAlbum &&
		// 	(
		// 		// !prevState.initDataModule ||
		// 		!prevState.initDataAlbum
		// 	)
		// ) {
		// 	// 增加dom节点
		// 	console.log('dom')
		// 	this.props.editeDomList([this.state.navList]);
		// 	this.props.editeDomList([this.state.myTitleList]);
		// 	//将dom节点收集后，才设置当前节点
		// 	this.props.setCursorDom(this.state.navList[0].cursor.random);
		// }
		// 滚动元素盒子
		// let currBox = $('.classlist-page')
		// // 当前焦点元素
		// let currDom = $('.classlist-page .curr')
		// // 如果当前页面存在焦点，移动滚动条
		// if(currDom.length > 0 && $('.classlist-page').is(':visible')) {
		// 	currBox.scrollTop(currBox.scrollTop() + currDom.offset().top - 374)
		// 	console.log(currDom.offset().top)
		// }
	}
	//监听键盘事件
	handleKeyDown(e) {
		//判断如果当前页面不再第一个的时候，忽略点击事件
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		//开始判断键盘逻辑
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			// 确认键点击
			if(this.state.affirmDelete) {return}
			if(this.state.videoRef.current.paused) {
				this.state.videoRef.current.play()
			} else{
				this.state.videoRef.current.pause()
				if(this.timer) {
					clearTimeout(this.timer)
				}
				$('.video_title').removeClass('video_title_none')
				$('.progress_bar_box').removeClass('video_title_none')
			}
		}
		// 快退
		if(e.keyCode === 37 && !this.state.affirmDelete) {
			// if(Toast.have()) {return}
			if(!this.state.videoRef.current.currentTime) {
				return
			}
			this.state.videoRef.current.currentTime -= 20
			$('.video_title').removeClass('video_title_none')
			$('.progress_bar_box').removeClass('video_title_none')
			this.state.videoRef.current.pause()
			this.state.videoRef.current.play()
			Toast.plain('快退20秒')
			return false
		}
		// 快进
		if(e.keyCode === 39 && !this.state.affirmDelete) {
			// if(Toast.have()) {return}
			if(!this.state.videoRef.current.currentTime) {
				return
			}
			let svcDtime = this.state.videoRef.current.duration
			let svcCtime = this.state.videoRef.current.currentTime
			if(svcCtime + 20 < svcDtime) {
				this.state.videoRef.current.currentTime += 20
			} else if(svcCtime + 5 < svcDtime){
				this.state.videoRef.current.currentTime += 5
			} else {
				this.state.videoRef.current.currentTime = svcDtime - 0.1
			}
			this.setState({
				videoTime: toVideoTime(this.state.videoRef.current.currentTime),
				videoLineWidth: Math.floor(this.state.videoRef.current.currentTime / this.state.videoRef.current.duration * 100),
				videoPlay: this.state.videoRef.current.paused ? false : true,
			})
			$('.video_title').removeClass('video_title_none')
			$('.progress_bar_box').removeClass('video_title_none')
			this.state.videoRef.current.pause()
			this.state.videoRef.current.play()
			Toast.plain('快进20秒')
			
			return false
		}
		if(e.keyCode === TvKeyCode.KEY_BACK) {
			Toast.destroy()
			if(!this.state.affirmDelete) {
				this.state.videoRef.current.pause()
				if(this.timer) {
					clearTimeout(this.timer)
				}
				$('.video_title').removeClass('video_title_none')
				$('.progress_bar_box').removeClass('video_title_none')
				this.setState({
					affirmDelete: true,
				})
			} else {
				this.setState({
					affirmDelete: false
				});
				this.state.videoRef.current.play()
			}
			return false
		}
	}
	
	// 获取专辑信息
	async getAlbum(params) {
		try {
			let res = await albumDetailApi({
				albumid: params.album_id,
				moduleid: params.module_id,
			})
			this.setState({
				album: res.album,
				detailList: res.contentlist,
				recList: res.recommend,
			})
		} catch(e) {
			console.log(e)
		}
	}
	// 获取视频信息
	async getVideo(id) {
		setTimeout(()=> {
			Toast.changLoading()
		},0)
		try {
			let res = await videoApi({
				contentid: id,
			})
			this.setState({
				videoInfo: res.data,
				imgPath: res.prefix,
			})
		} catch(e) {
			console.log(e)
		}
	}
	
	// 上传播放时长
	async videoUpdata() {
		try {
			let res = await videoUpdataApi({
				contentid: this.state.videoInfo.id,
				played: Math.floor(this.state.videoRef.current.currentTime * 1000),
			})
			if(res) {
				console.log(res)
			}
		} catch(e) {
			console.log(e)
		}
	}
	
	// 更新运动数据
	async sportUpdata() {
		// 判断已有播放时长
		let havetime = 0
		if(this.state.videoInfo.id === this.props.params.video_id) {
			havetime = this.props.params.video_time
		}
		try {
			let res = await sportUpdataApi({
				duration: Math.floor((this.state.videoRef.current.currentTime * 1000) - havetime) <= 0 ? 0 : Math.floor((this.state.videoRef.current.currentTime * 1000) - havetime),
			})
			if(res) {
				console.log(res)
			}
		} catch(e) {
			console.log(e)
		}
	}
	
	// 弹窗取消
	closeAffirm() {
		this.setState({
			affirmDelete: false
		});
		this.state.videoRef.current.play()
	}
	// 弹窗确认
	goBack() {
		// this.setState({
		// 	affirmDelete: false
		// });
		this.videoUpdata()
		this.sportUpdata()
		if(this.props.userInfo.id) {
			this.state.detailList.forEach(item => {
				if(item.id === this.state.videoInfo.id) {
					console.log('item', item)
					item.history = Math.floor(this.state.videoRef.current.currentTime * 1000)
					item.playTime = toVideoTime(item.history / 1000)
					// item.cursor.curr = true
				} else {
					item.history = 0
					// item.cursor.curr = false
				}
			})
		}
		setTimeout(() =>{
			this.props.deleteRouter(1,{
				playStatus: true,
				video_list: this.state.detailList
			});
			this.props.deletePageDom(1);
		},500)
	}
	
	// 获取视频信息
	__loadedmetadata() {
		// console.log('视频时长',this.state.videoRef.current.duration)
		// console.log('视频播放时间',this.state.videoRef.current.currentTime)
		// console.log(this.props.params)
		if(this.props.params.video_time > 0 && this.props.params.video_id === this.state.videoInfo.id) {
			this.state.videoRef.current.currentTime = this.props.params.video_time / 1000
		}
		this.setState({
			videoTime: toVideoTime(this.state.videoRef.current.currentTime),
			videoDtime: toVideoTime(this.state.videoRef.current.duration)
		})
	}
	// 控制播放器进度条
	__timeupdate() {
		this.setState({
			videoTime: toVideoTime(this.state.videoRef.current.currentTime),
			videoLineWidth: Math.floor(this.state.videoRef.current.currentTime / this.state.videoRef.current.duration * 100),
			videoPlay: this.state.videoRef.current.paused ? false : true,
		})
		// if(!this.state.videoRef.current.paused){
		// 	Toast.destroy()
		// }
		// console.log(this.state.videoRef.current.paused)
		// if(!this.timer && !this.state.videoRef.current.paused) {
		// 	this.timer = setTimeout(()=>{
		// 		$('.video_title').addClass('video_title_none');
		// 		$('.progress_bar_box').addClass('video_title_none');
		// 	},2000)
		// }
	}
	// 播放结束
	__onended() {
		console.log('__onended')
		this.state.detailList.forEach((item,index)=>{
			if(item.id === this.state.videoInfo.id) {
				if(index === this.state.detailList.length -1) {
					Toast.plain('已经是最后一集了！',2000)
					this.goBack()
				} else {
					if(this.state.detailList[index+1].playable === 0) {
						if(item.moduleid === 'yangxiu') {
							Toast.plain('请您先购买专辑',2000)
						} else {
							Toast.plain('请您先购买会员',2000)
						}
						setTimeout(()=> {
							this.props.deleteRouter(1);
							this.props.deletePageDom(1);
						},1500)
					} else {
						this.sportUpdata()
						this.getVideo(this.state.detailList[index+1].id)
					}
				}
			}
		})
	}
	// 触发播放
	__playing() {
		console.log('__playing')
		Toast.destroy()
		if(this.timer) {
			clearTimeout(this.timer)
		}
		this.timer = setTimeout(()=>{
			$('.video_title').addClass('video_title_none');
			$('.progress_bar_box').addClass('video_title_none');
		},2000)
	}
	// 触发等待（加载）
	__waiting() {
		console.log('__waiting')
		Toast.changLoading()
	}
	// 触发 能够开始播放但可能因缓冲而需要停止时（加载）
	__canplay() {
		console.log('__canplay')
		// Toast.changLoading()
		Toast.destroy()
	}
	// 页面渲染
	render() {
		return (
			<div className={'video-page ' + this.props.display}>
				<div className={'video_box'}>
					<div className={'video_title line-clamp'}>{this.state.videoInfo.title}</div>
					<video  autoPlay="autoPlay" id="video"
						ref={this.state.videoRef}
						poster={this.state.imgPath +  this.state.videoInfo.cover}
						src={this.state.videoInfo.video} type="video/mp4">
					</video>
					<div className={'progress_bar_box flex-ac'}>
						<div className={'bar_btn mr32'}>
							{this.state.videoPlay ? 
							<img  src={require('../assets/images/playing.png')} alt={'暂停'}></img>
							:
							<img  src={require('../assets/images/play.png')} alt={'播放'}></img>
							}
						</div>
						<div className={'bar_time fs40'}>{this.state.videoTime}</div>
						<div className={'bar_line flex-1 flex'}>
							<div className={'bar_line_play'} style={{width: this.state.videoLineWidth + '%'}}></div>
							<div className={'bar_line_spot'}></div>
						</div>
						<div className={'bar_time fs40'}>{this.state.videoDtime}</div>
					</div>
				</div>
				
				
				{this.state.affirmDelete ? (
					<Popup
						affirmCallback={this.goBack.bind(this)}
						cancelCallback={this.closeAffirm.bind(this)}
						affirmInfo={this.state.affirmInfo}
						pageId={this.props.pageId}
					></Popup>
				) : (
					''
				)}
			</div>
		);
	}

}
//【焦点】需要渲染什么数据
function mapState(state) {
	return {
		routerDomList: state.routerDomList,
		userInfo: state.userInfo
	};
}

export default Video = connect(mapState, mapDispatch)(Video);
