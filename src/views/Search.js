import React, { Component } from 'react';
import './style/Search.less';
import { searchApi, searchHotApi } from '../server/api';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import { connect } from 'react-redux';
import Toast from '../components/toast/Index';
import NoMore from './NoMore.js';
import $ from 'jquery';

class Search extends Component {
	constructor(props) {
		super(props);
		//设置模块首页组件的随机标识
		this.searchRandomId = this.getRandom() + 'search';
		this.searchListRandomId = this.getRandom() + 'search';
		this.state = {
			imgPath: '', // 图片路径
			searchCode: '', // 搜索值
			searchCodeList: [ // 热搜列表
				{
					title: '塑性',
					cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'd')
				}
			],
			searchList: [
			], // 视频列表
			allKeyBoard: [ // 搜索按钮列表
				{ key: 'A', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b', null, { left: 'no' }) },
				{ key: 'B', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'C', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'D', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'E', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'F', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'G', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b', null, { left: 'right' }) },
				{ key: 'H', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'I', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'J', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'K', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'L', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'M', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b', null, { left: 'right' }) },
				{ key: 'N', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'O', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'P', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'Q', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'R', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'S', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b', null, { left: 'right' }) },
				{ key: 'T', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'U', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'V', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'W', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'X', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: 'Y', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b', null, { left: 'right' }) },
				{ key: 'Z', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: '0', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: '1', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: '2', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: '3', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: '4', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b', null, { left: 'right' }) },
				{ key: '5', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: '6', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: '7', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: '8', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') },
				{ key: '9', cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'b') }
			],
			buttonList: [ // 按钮列表
				{
					title: '清空',
					cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'a', null, { left: 'no', up: 'no' })
				},
				{
					title: '退格',
					cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'a', null, { up: 'no' })
				},
				{
					title: '搜索',
					cursor: this.setCursorObj(this.props.pageId, this.searchRandomId, 'c', null, { left: 'no', dowm: 'no' })
				}
			],
			//是否隐藏初始化页面
			initDataSearch: false,
			initDataList: false,
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	// 将要加载页面dom
	componentWillMount() {
		console.log('搜索列表', this.props.params);
		// 获取热搜
		this.getSearchHost()
	}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		// 获取导航
		this.props.editeDomList([]);
		document.addEventListener('keydown', this.handleKeyDown);
	}
	// 组件将要卸载
	componentWillUnmount() {
		// 卸载的时候，删掉当前组件的全局焦点
		document.removeEventListener('keydown', this.handleKeyDown);
	}
	// 判断是否要移动焦点的时候，用的比较多
	componentWillReceiveProps(nextProps) {
		// 【焦点】根据新的props判断，是否移动焦点
		shouldComponentCurrUpdate(nextProps, this, ['allKeyBoard', 'searchCodeList', 'buttonList', 'searchList',]);
	}
	// 组件中途有更新dom，更新完成后的操作
	componentDidUpdate(prevProps, prevState) {
		if (
			this.state.initDataSearch &&
			(
				// !prevState.initDataModule ||
				!prevState.initDataSearch
			)
		) {
			// 增加dom节点
			this.props.editeDomList([this.state.allKeyBoard]);
			this.props.editeDomList([this.state.searchCodeList]);
			this.props.editeDomList([this.state.buttonList]);
			this.props.editeDomList([this.state.searchList]);
			//将dom节点收集后，才设置当前节点
			this.props.setCursorDom(this.state.allKeyBoard[0].cursor.random);
		} else 
		if (this.state.initDataList !== prevState.initDataList) {
			this.props.deleteCompDom(this.searchRandomId);

			this.props.editeDomList([this.state.allKeyBoard]);
			this.props.editeDomList([this.state.searchCodeList]);
			this.props.editeDomList([this.state.buttonList]);
			this.props.editeDomList([this.state.searchList]);
			if (this.state.searchList.length > 0) {
				this.props.setCursorDom(this.state.searchList[0].cursor.random);
			}
			
		} else {
			// 滚动元素盒子
			let lrBox = $('.search-page')
			let lCurr = $('.search-page .search_left .curr')
			if (lCurr.length > 0) {
				lrBox.scrollLeft(0)
				$(".search-page .search_left").css("opacity", "1");
			} else {
				lrBox.scrollLeft(664)

				$(".search-page .search_left").css("opacity", "0");

			}
			// 当前焦点元素
			let currBox = $('.search-page .search_right')
			let currDom = $('.search-page .search_right .curr')
			// 如果当前页面存在焦点，移动滚动条
			if (currDom.length > 0 && $('.search-page').is(':visible')) {
				currBox.scrollTop(currBox.scrollTop() + currDom.offset().top - 374)
			}
			this.props.deleteCompDom(this.searchRandomId);
			this.props.editeDomList([this.state.allKeyBoard]);
			this.props.editeDomList([this.state.searchCodeList]);
			this.props.editeDomList([this.state.buttonList]);
			this.props.editeDomList([this.state.searchList]);
		}
	}
	//监听键盘事件
	handleKeyDown(e) {
		//判断如果当前页面不再第一个的时候，忽略点击事件
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		//开始判断键盘逻辑
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			// 确认键点击
			// 字母点击
			this.state.allKeyBoard.forEach((item) => {
				if (item.cursor.curr) {
					if(this.state.searchCode.length >= 20) {
						Toast.plain('最多输入二十个字母',1000)
						return
					}
					let code = this.state.searchCode + item.key
					this.setState({
						searchCode: code
					})
				}
			})
			// 清空
			this.state.buttonList.forEach((item, index) => {
				if (item.cursor.curr) {
					if (index === 0) {
						// 清空
						this.setState({
							searchCode: ''
						})
						return
					}
					if (index === 1) {
						// 退格
						let code = this.state.searchCode.substring(0, this.state.searchCode.length - 1)
						this.setState({
							searchCode: code
						})
						return
					}

					if (index === 2) {
						// 搜索
						if (this.state.searchCode) {
							this.getSearchList()
						} else {
							Toast.plain('请输入要搜索的内容',2000)
						}
					}
				}
			})
			// 热搜点击
			this.state.searchCodeList.forEach((item, index) => {
				if (item.cursor.curr) {
					this.getSearchList(item.pinyin)
					return
				}
			})
			// 专辑点击
			this.state.searchList.forEach((item, index) => {
				if (item.cursor.curr) {
					this.props.pushRouter({
						name: 'detail',
						pageId: this.getRandom(),
						params: {
							detail_id: item.id,
							module_id: item.moduleid
						}
					});
					return
				}
			})
		}
		if (e.keyCode >= TvKeyCode.KEY_LEFT && e.keyCode <= TvKeyCode.KEY_DOWN) {
			return
		}
	}

	// 获取热搜列表
	async getSearchHost() {
		try {
			let res = await searchHotApi()
			if (res) {
				res.forEach((item, index) => {
					item.cursor = this.setCursorObj(this.props.pageId, this.searchRandomId, 'd');
				})
				this.setState({
					searchCodeList: res,
					initDataSearch: true
				})
			} else {
				this.setState({
					searchCodeList: [],
					initDataSearch: true
				})
			}
		} catch (e) {
			console.log(e)
		}
	}

	// 搜索结果
	async getSearchList(pinyin = '') {
		Toast.changLoading('正在搜索中')
		try {
			pinyin = pinyin.replace(/[^a-zA-Z0-9]/g, "")
			let res = await searchApi({
				pinyin: pinyin ? pinyin : this.state.searchCode
			})
			if (res) {
				res.album.forEach((item, index) => {
					item.cursor = this.setCursorObj(this.props.pageId, this.searchRandomId, 'e');
				})
				this.setState({
					searchList: res.album,
					imgPath: res.prefix,
					searchCode: '',
					initDataList: !this.state.initDataList
				})
				Toast.destroy()
			} else {
				this.setState({
					searchList: [],
					imgPath: '',
					searchCode: '',
					initDataList: !this.state.initDataList
				})
				Toast.destroy()
			}
		} catch (e) {
			Toast.destroy()
			console.log(e)
		}
	}
	// 页面渲染
	render() {
		return (
			<div className={'search-page ' + this.props.display}>
				<div className={'empty_module'}></div>
				<div className={'search_box flex'}>
					<div className={'search_left fs40'}>
						<div className={'search_left_title flex-ac'}>
							<img className={'search_left_img'} src={require('../assets/images/search.png')} alt={'搜索'}></img>
							<div className={'search_left_code ' + (this.state.searchCode ? ' ' : ' search_empty_code')}>
								<div className={'search_left_code_text'}>{this.state.searchCode ? this.state.searchCode : '搜索您想要的专辑名称'}</div>
							</div>
						</div>
						<div className={'search_left_btnbox flex-bt'}>
							<div className={'search_left_btn flex-ajc ' + (this.state.buttonList[0].cursor.curr ? ' curr' : '')} ref={this.state.buttonList[0].cursor.refs}>
								<img className={'search_left_img mr24'} src={require('../assets/images/search_delete.png')} alt={'清空'}></img>
								<div>清空</div>
							</div>
							<div className={'search_left_btn flex-ajc ' + (this.state.buttonList[1].cursor.curr ? ' curr' : '')} ref={this.state.buttonList[1].cursor.refs}>
								<img className={'search_left_img mr24'} src={require('../assets/images/search_back.png')} alt={'退格'}></img>
								<div>退格</div>
							</div>
						</div>
						<div className={'module_box flex-bt flex-wrap font-bold'}>
							{this.state.allKeyBoard.map((item, index) => {
								return (<div className={'module_item_search ' + (item.cursor.curr ? ' curr' : '') + (index > 25 ? ' c9c9c9' : '')} ref={item.cursor.refs} key={'b' + index}>{item.key}</div>)
							})}
						</div>
						<div className={'search_left_btn_search flex-ajc fs36' + (this.state.buttonList[2].cursor.curr ? ' curr' : '')} ref={this.state.buttonList[2].cursor.refs}>搜索</div>
					</div>
					<div className={'search_mid'}>
						<div className="fs46 font-bold mb32">热搜课程</div>
						{this.state.searchCodeList.map((item, index) => {
							return (
								<div className={'search_mid_list fs36 line-clamp mt16 ' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'r' + index}>{item.title}</div>
							)
						})}
					</div>
					<div className={'search_right'}>
						<div className="fs46 mb32 font-bold">搜索结果</div>
						{this.state.searchList.length <= 0 ?
							<div className={'search_right_empty'}>抱歉，未搜索到专辑，我们会努力更新哦！</div>
							:
							<div className={'module_box flex-bt flex-wrap'}>
								{this.state.searchList.map((item, index) => {
									return (<div className={'module_item2 mb40' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'e' + index}>
										<img className={'module_img1'} src={this.state.imgPath + item.cover} alt={item.title}></img>
										<div className={'module_title1 none'}>{item.title}</div>
									</div>)
								})}
								{this.state.searchList.length > 7 ? <NoMore></NoMore> : ''}
							</div>
						}
					</div>
				</div>
			</div>
		);
	}

}
//【焦点】需要渲染什么数据
function mapState(state) {
	return {
		routerDomList: state.routerDomList
	};
}

export default Search = connect(mapState, mapDispatch)(Search);
