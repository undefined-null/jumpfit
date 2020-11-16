import React from 'react';
import './SongSearch.less';
import { setCursorObj } from '../../utils/pageDom';
import { mapDispatch, TvKeyCode, shouldComponentCurrUpdate } from '../../utils/pageDom';
import { connect } from 'react-redux';

class SongSearch extends React.Component {
	constructor(props) {
		super(props);
		this.compId = this.getRandom();
		this.state = {
			keyBoardType: 'allKeyBoard', //键盘类型，allKeyBoard、numberKeyBoard
			keyWord: '', //输入的内容
			// 全键盘的按钮
			allKeyBoard: [
				{ key: 'A', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'B', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'C', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'D', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'E', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'F', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'G', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'H', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'I', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'J', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'K', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'L', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'M', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'N', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'O', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'P', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'Q', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'R', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'S', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'T', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'U', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'V', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'W', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'X', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'Y', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: 'Z', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '0', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '1', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '2', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '3', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '4', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '5', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '6', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '7', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '8', cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ key: '9', cursor: setCursorObj(this.props.pageId, this.compId, 'c') }
			],
			// 数字键盘的按钮
			numberKeyBoard: [
				{
					type: 'more',
					value: '1',
					more: ['A', 'B'],
					open: false,
					cursor: setCursorObj(this.props.pageId, this.compId, 'c')
				},
				{
					type: 'more',
					value: '2',
					more: ['C', 'D', 'E'],
					open: false,
					cursor: setCursorObj(this.props.pageId, this.compId, 'c')
				},
				{
					type: 'more',
					value: '3',
					more: ['F', 'G', 'H'],
					open: false,
					cursor: setCursorObj(this.props.pageId, this.compId, 'c')
				},
				{
					type: 'more',
					value: '4',
					more: ['I', 'J', 'K'],
					open: false,
					cursor: setCursorObj(this.props.pageId, this.compId, 'c')
				},
				{
					type: 'more',
					value: '5',
					more: ['L', 'M', 'N'],
					open: false,
					cursor: setCursorObj(this.props.pageId, this.compId, 'c')
				},
				{
					type: 'more',
					value: '6',
					more: ['O', 'P', 'Q'],
					open: false,
					cursor: setCursorObj(this.props.pageId, this.compId, 'c')
				},
				{
					type: 'more',
					value: '7',
					more: ['R', 'S', 'T'],
					open: false,
					cursor: setCursorObj(this.props.pageId, this.compId, 'c')
				},
				{
					type: 'more',
					value: '8',
					more: ['U', 'V', 'W'],
					open: false,
					cursor: setCursorObj(this.props.pageId, this.compId, 'c')
				},
				{
					type: 'more',
					value: '9',
					more: ['X', 'Y', 'Z'],
					open: false,
					cursor: setCursorObj(this.props.pageId, this.compId, 'c')
				},
				{ type: 'reset', value: '清空', more: [], cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ type: 'number', value: '0', more: [], cursor: setCursorObj(this.props.pageId, this.compId, 'c') },
				{ type: 'delete', value: '删除', more: [], cursor: setCursorObj(this.props.pageId, this.compId, 'c') }
			],
			numberKeySelected: false, //是否打开了数字键盘的按钮
			numberKeySelectedIndex: 0, //打开了数字键盘的位置
			//游离的按钮
			singleBttton: {
				// [全键盘]清空
				resetButton: {
					cursor: setCursorObj(this.props.pageId, this.compId, 'd')
				},
				// [全键盘]切换成九宫格
				changeNumberButton: {
					cursor: setCursorObj(this.props.pageId, this.compId, 'd')
				},
				// [全键盘]删除按钮
				deleteButton: {
					cursor: setCursorObj(this.props.pageId, this.compId, 'd')
				}
			},
			//游离的按钮2
			changeAllKeyBttton: {
				// [数字键盘]切换成全键盘
				changeAllKeyButton: {
					cursor: setCursorObj(this.props.pageId, this.compId, 'd', true)
				}
			}
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	// 判断是否要移动焦点的时候，用的比较多
	componentWillReceiveProps(nextProps) {
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		// 【焦点】根据新的props判断，是否移动焦点
		if (!this.state.numberKeySelected) {
			//只有数字键盘没有被点击id情况下才会继续使用
			if (this.state.keyBoardType === 'allKeyBoard') {
				//全键盘的时候
				shouldComponentCurrUpdate(nextProps, this, ['allKeyBoard', 'singleBttton']);
			} else {
				//数字键盘的时候
				shouldComponentCurrUpdate(nextProps, this, ['numberKeyBoard', 'changeAllKeyBttton']);
			}
		}
	}
	// 加载完dom之后的声明周期
	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyDown);
		if (this.state.keyBoardType === 'allKeyBoard') {
			//全键盘的时候
			this.props.editeDomList([this.state.allKeyBoard, this.state.singleBttton]);
		} else {
			//数字键盘的时候
			this.props.editeDomList([this.state.numberKeyBoard, this.state.changeAllKeyBttton]);
		}
		if (this.props.searchType === 'name') {
			//歌名点歌的时候，需要将焦点设置成当前（将dom节点收集后，才设置当前节点）
			this.props.setCursorDom(this.state.allKeyBoard[0].cursor.random);
		}
	}
	// 组件将要卸载
	componentWillUnmount() {
		// 卸载的时候，删掉当前组件的全局焦点
		document.removeEventListener('keydown', this.handleKeyDown);
	}
	// 更新完毕
	componentDidUpdate(prevProps, prevState) {
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		// 如果更新后的节点个数，和之前的不一样，就证明整个组件结构发生了变化
		if (
			(prevState.keyBoardType !== this.state.keyBoardType && !this.state.numberKeySelected) ||
			(prevState.numberKeySelected !== this.state.numberKeySelected && !this.state.numberKeySelected)
		) {
			console.log('走更新焦点的逻辑');
			//更新完毕后，删除dom节点
			this.props.deleteCompDom(this.compId);
			// 增加dom节点
			if (this.state.keyBoardType === 'allKeyBoard') {
				//全键盘的时候
				this.props.editeDomList([this.state.allKeyBoard, this.state.singleBttton]);
			} else {
				//数字键盘的时候
				this.props.editeDomList([this.state.numberKeyBoard, this.state.changeAllKeyBttton]);
			}
		}
		if (prevState.numberKeySelected !== this.state.numberKeySelected && this.state.numberKeySelected) {
			console.log('走删除焦点的逻辑');
			// 如果打开了数字键盘，并且选中了数字
			this.props.deleteCompDom(this.compId);
			this.props.editeDomList([]);
		}
	}
	// 监听键盘事件
	handleKeyDown(e) {
		if (this.props.routerDomList[this.props.routerDomList.length - 1].pageId !== this.props.pageId) return;
		if (e.keyCode === TvKeyCode.KEY_ENTER) {
			//点击确认按钮
			if (this.state.keyBoardType === 'allKeyBoard') {
				// 全键盘的时候
				this.state.allKeyBoard.forEach(item => {
					if (item.cursor.curr) {
						//找到了点击的字幕，加到输入框中
						this.setState({
							keyWord: this.state.keyWord + item.key
						});
					}
				});
				for (let key in this.state.singleBttton) {
					if (this.state.singleBttton[key].cursor.curr) {
						//找到了点击的操作按钮
						if (key === 'resetButton') {
							//清空操作
							this.setState({
								keyWord: ''
							});
						} else if (key === 'changeNumberButton') {
							//切换成数字键盘操作
							this.setState({
								keyBoardType: 'numberKeyBoard'
							});
						} else if (key === 'deleteButton') {
							//删除字幕操作
							if (this.state.keyWord.length) {
								this.setState({
									keyWord: this.state.keyWord.substring(0, this.state.keyWord.length - 1)
								});
							}
						}
					}
				}
			} else {
				// 数字键盘
				this.state.numberKeyBoard.forEach((item, index) => {
					if (item.cursor.curr) {
						//找到了点击的字幕，加到输入框中
						// alert('暂时还不能选中');
						if (item.type === 'more') {
							// 打开数字键盘了哦，嘿嘿
							// eslint-disable-next-line react/no-direct-mutation-state
							this.state.numberKeyBoard[index].open = true;
							this.setState({
								numberKeySelected: true,
								numberKeyBoard: this.state.numberKeyBoard,
								numberKeySelectedIndex: index
							});
						} else if (item.type === 'reset') {
							//清空操作
							this.setState({
								keyWord: ''
							});
						} else if (item.type === 'number') {
							//切换成数字键盘操作
							this.setState({
								keyWord: this.state.keyWord + item.value
							});
						} else if (item.type === 'delete') {
							//删除字幕操作
							if (this.state.keyWord.length) {
								this.setState({
									keyWord: this.state.keyWord.substring(0, this.state.keyWord.length - 1)
								});
							}
						}
					}
				});
				// 数字键盘的时候
				for (let key in this.state.changeAllKeyBttton) {
					console.log(key);
					if (this.state.changeAllKeyBttton[key].cursor.curr) {
						//找到了点击的操作按钮
						if (key === 'changeAllKeyButton') {
							//切换成数字键盘操作
							this.setState({
								keyBoardType: 'allKeyBoard'
							});
						}
					}
				}
			}
			//传递搜索值给父组件
			this.props.getChildrenMsg(this.state.keyWord);
		} else if (e.keyCode === TvKeyCode.KEY_LEFT && this.state.numberKeySelected) {
			let value = this.numberKeyOpen()[0].more[0];
			// eslint-disable-next-line react/no-direct-mutation-state
			this.state.numberKeyBoard[this.state.numberKeySelectedIndex].open = false;
			// 选择左边的时候
			this.setState({
				keyWord: this.state.keyWord + value,
				numberKeySelected: false,
				numberKeyBoard: this.state.numberKeyBoard
			});
			this.props.getChildrenMsg(this.state.keyWord);
		} else if (e.keyCode === TvKeyCode.KEY_RIGHT && this.state.numberKeySelected) {
			let value = this.numberKeyOpen()[0].more[1];
			// eslint-disable-next-line react/no-direct-mutation-state
			this.state.numberKeyBoard[this.state.numberKeySelectedIndex].open = false;
			// 选择右边的时候
			this.setState({
				keyWord: this.state.keyWord + value,
				numberKeySelected: false,
				numberKeyBoard: this.state.numberKeyBoard
			});
			this.props.getChildrenMsg(this.state.keyWord);
		} else if (e.keyCode === TvKeyCode.KEY_UP && this.state.numberKeySelected) {
			let value = this.numberKeyOpen()[0].value;
			// eslint-disable-next-line react/no-direct-mutation-state
			this.state.numberKeyBoard[this.state.numberKeySelectedIndex].open = false;
			// 选择上边的时候
			this.setState({
				keyWord: this.state.keyWord + value,
				numberKeySelected: false,
				numberKeyBoard: this.state.numberKeyBoard
			});
			this.props.getChildrenMsg(this.state.keyWord);
		} else if (e.keyCode === TvKeyCode.KEY_DOWN && this.state.numberKeySelected) {
			// 选择下边的时候
			if (this.numberKeyOpen()[0].more.length === 3) {
				let value = this.numberKeyOpen()[0].more[2];
				// eslint-disable-next-line react/no-direct-mutation-state
				this.state.numberKeyBoard[this.state.numberKeySelectedIndex].open = false;
				this.setState({
					keyWord: this.state.keyWord + value,
					numberKeySelected: false,
					numberKeyBoard: this.state.numberKeyBoard
				});
				this.props.getChildrenMsg(this.state.keyWord);
			}
		}
	}
	render() {
		return (
			<div className={'key-board-box flex-ac flex-col'}>
				<div className={'search-input flex-ajc wi'}>{this.state.keyWord}</div>
				{/* 全键盘 */}
				{this.state.keyBoardType === 'allKeyBoard' ? (
					<AllKeyBoard
						allKeyBoard={this.state.allKeyBoard}
						singleBttton={this.state.singleBttton}
					></AllKeyBoard>
				) : (
					<NumberKeyBoard
						numberKeyBoard={this.state.numberKeyBoard}
						singleBttton={this.state.changeAllKeyBttton}
						numberKeyOpen={this.numberKeyOpen()}
						numberKeySelected={this.state.numberKeySelected}
					></NumberKeyBoard>
				)}
			</div>
		);
	}
	//当前数字键盘是否打开，以及打开的具体哪个键
	numberKeyOpen() {
		return this.state.numberKeyBoard.filter(item => {
			return item.open;
		});
	}
}

// 全键盘
function AllKeyBoard(props) {
	return (
		<>
			<div className={'key-value-box'}>
				{props.allKeyBoard.map((item, index) => {
					return (
						<div
							className={'key-value flex-ajc fl' + (item.cursor.curr ? ' curr' : '')}
							key={index}
							ref={item.cursor.refs}
						>
							{item.key}
						</div>
					);
				})}
			</div>
			{/* 键盘切换和删清 */}
			<div className={'key-board-change flex-ac flex-bt wi'}>
				<div
					ref={props.singleBttton.resetButton.cursor.refs}
					className={'change-button flex-ajc' + (props.singleBttton.resetButton.cursor.curr ? ' curr' : '')}
				>
					<div className={'in-border-xx flex-ajc'}>清空</div>
				</div>
				<div
					ref={props.singleBttton.changeNumberButton.cursor.refs}
					className={
						'change-button flex-ajc' + (props.singleBttton.changeNumberButton.cursor.curr ? ' curr' : '')
					}
				>
					<div className={'in-border-xx flex-ajc'}>九宫格</div>
				</div>
				<div
					ref={props.singleBttton.deleteButton.cursor.refs}
					className={'change-button flex-ajc' + (props.singleBttton.deleteButton.cursor.curr ? ' curr' : '')}
				>
					<div className={'in-border-xx flex-ajc'}>删除</div>
				</div>
			</div>
		</>
	);
}

// 数字键盘
function NumberKeyBoard(props) {
	// let openValue = props.numberKeyOpen.length && props.numberKeyOpen[0].index
	return (
		<>
			<div className={'number-value-box'}>
				<div className={'he'}>
					{props.numberKeyBoard.map((item, index) => {
						return (
							<div
								className={
									'key-value-button fl' +
									(item.cursor.curr &&
									!showOpenKey(props.numberKeyOpen, index).isCurr &&
									!props.numberKeySelected
										? ' curr'
										: '') +
									(showOpenKey(props.numberKeyOpen, index).isCurr ? ' currs' : '')
								}
								key={index}
								ref={item.cursor.refs}
							>
								<div
									className={
										'key-value flex-ajc flex-col wi he' +
										(item.type === 'reset' || item.type === 'delete' ? ' font36' : '')
									}
								>
									<div>
										{showOpenKey(props.numberKeyOpen, index).keyValue
											? showOpenKey(props.numberKeyOpen, index).keyValue
											: item.value}
									</div>
									{item.type === 'more' && !showOpenKey(props.numberKeyOpen, index).isCurr ? (
										<div className={'small-key'}>{item.more.join(' ')}</div>
									) : (
										''
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
			{/* 键盘切换和删清 */}
			<div className={'key-board-change flex-ac flex-bt wi'}>
				<div
					className={
						'change-button flex-ajc wi' + (props.singleBttton.changeAllKeyButton.cursor.curr ? ' curr' : '')
					}
					ref={props.singleBttton.changeAllKeyButton.cursor.refs}
				>
					<div className={'in-border-xx flex-ajc'}>切换为26键输入</div>
				</div>
			</div>
		</>
	);
	// 判断如果出现数字选择的时候的展示内容
	function showOpenKey(openKey, index) {
		let res = {
			isCurr: false,
			keyValue: ''
		};
		if (openKey.length) {
			openKey = openKey[0];
			if (index === 1) {
				//上方的按钮显示
				res.isCurr = true;
				res.keyValue = openKey.value;
			} else if (index === 3) {
				// 左侧的按钮显示
				res.isCurr = true;
				res.keyValue = openKey.more[0];
			} else if (index === 5) {
				// 右侧的按钮显示
				res.isCurr = true;
				res.keyValue = openKey.more[1];
			} else if (index === 7) {
				if (openKey.more.length === 3 && openKey.more[2]) {
					res.isCurr = true;
					res.keyValue = openKey.more[2];
				}
			}
		}
		// console.log('showOpenKey', openKey, index, res);
		return res;
	}
}

//【焦点】需要渲染什么数据
function mapState(state) {
	return {
		routerDomList: state.routerDomList
	};
}
export default connect(mapState, mapDispatch)(SongSearch);
