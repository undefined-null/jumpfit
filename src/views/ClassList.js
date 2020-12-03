import React, { Component } from 'react';
import './style/ClassList.less';
import { classListApi } from '../server/api';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../utils/pageDom';
import { connect } from 'react-redux';
import Toast from '../components/toast/Index';
import $ from 'jquery';

class ClassList extends Component {
	constructor(props) {
		super(props);
		//设置模块首页组件的随机标识
		this.classRandomId = this.getRandom();
		this.state = {
			imgPath: '', // 图片路径
			classTitle: '分类标题', // 分类标题
			albumList: [
				{
					title: 'xiangq',
					cover: '/codoon/payNO.png',
					cursor: this.setCursorObj(this.props.pageId, this.classRandomId, 'c',null,{left:'no'})
				}
			], // 视频列表
			//是否隐藏初始化页面
			initDataAlbum: false,
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	// 将要加载页面dom
	componentWillMount() {
		console.log('带着class_id', this.props.params);
		// 获取导航
		this.getClassList(this.props.params.category_id,this.props.params.module_id)
	}
	// 组件第一次渲染完成，此时dom节点已经生成
	componentDidMount() {
		// 获取导航
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
		shouldComponentCurrUpdate(nextProps, this, ['albumList']);
	}
	// 组件中途有更新dom，更新完成后的操作
	componentDidUpdate(prevProps, prevState) {
		if (
			this.state.initDataAlbum &&
			(
				// !prevState.initDataModule ||
				!prevState.initDataAlbum
			)
		) {
			// 增加dom节点
			console.log('dom')
			this.props.editeDomList([this.state.albumList]);
			//将dom节点收集后，才设置当前节点
			this.props.setCursorDom(this.state.albumList[0].cursor.random);
		}
		// 滚动元素盒子
		let currBox = $('.classlist-page')
		// 当前焦点元素
		let currDom = $('.classlist-page .curr')
		// 如果当前页面存在焦点，移动滚动条
		if(currDom.length > 0 && $('.classlist-page').is(':visible')) {
			currBox.scrollTop(currBox.scrollTop() + currDom.offset().top - 374)
			console.log(currDom.offset().top)
		}
	}
	//监听键盘事件
	handleKeyDown(e) {
		//判断如果当前页面不再第一个的时候，忽略点击事件
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		//开始判断键盘逻辑
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			// 确认键点击
			console.log('模块列表')
			this.state.albumList.forEach((item,index)=> {
				console.log(item)
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
	}
	
	// 获取模块列表
	async getClassList(cid,mid) {
		try {
			let res = await classListApi({
				categoryid:cid,
				moduleid:mid
			})
			if(!res) {
				this.props.deleteRouter(1);
				Toast.plain('该分类下暂无专辑。',2000)
				return
			}
			res.albumlist.forEach((item,index)=>{
				if((index) % 3 === 0) {
					item.cursor = this.setCursorObj(this.props.pageId, this.classRandomId, 'c', null,{left: 'right'});
				} else if((index+1) % 3 === 0) {
					item.cursor = this.setCursorObj(this.props.pageId, this.classRandomId, 'c', null,{right: 'left'});
				} else {
					item.cursor = this.setCursorObj(this.props.pageId, this.classRandomId, 'c');
				}
			})
			console.log(res)
			this.setState({
				albumList: res.albumlist,
				classTitle: res.category.title,
				imgPath: res.prefix,
				initDataAlbum: true
			})
		} catch(e) {
			console.log(e)
		}
	}
	// 页面渲染
	render() {
		return (
			<div className={'classlist-page ' + this.props.display}>
				<div className={'empty_module'}></div>
				<div className={'module_title0'}>{this.state.classTitle}</div>
				<div className={'module_box flex-bt flex-wrap'}>
					{this.state.albumList.map((item,index)=>{
						return(<div className={'mt40 module_item3 ' + (item.cursor.curr ? ' curr' : '')} ref={item.cursor.refs} key={'d' + index}>
							<img className={'module_img1'} src={this.state.imgPath + item.cover} alt={item.title}></img>
							<img className={'module_img2'} src={require('../assets/images/paid' + (item.paid === 1 ? 1 : 0) + (item.moduleid === 'yangxiu' ? 0 : '') + '.png')} alt={'费用'}></img>
							<div className={'module_title1'}>{item.title}</div>
						</div>)
					})}
					<div className={'empty_module module_item3'}></div>
					<div className={'empty_module module_item3'}></div>
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

export default ClassList = connect(mapState, mapDispatch)(ClassList);
