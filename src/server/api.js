// import axiosIns from './axiosIns'
import axiosIns from '../utils/request';
/* 测试服务器根域名
 * REACT_APP_API=http://api.dig88.cn/jumpfit/public/
 */
// 导航
export const homeModuleApi = data => axiosIns.get(`home/module`, data);
// 板块
export const homeIndexApi = data => axiosIns.get(`home/index`, data);
// 分类
export const classHomeApi = data => axiosIns.get(`home/categories`, data);
// 分类列表
export const classListApi = data => axiosIns.get(`home/list`, data);
// 专辑详情
export const albumDetailApi = data => axiosIns.get(`home/detail`, data);
// 视频详情
export const videoApi = data => axiosIns.get(`home/video`, data);
// 记录播放时长
export const videoUpdataApi = data => axiosIns.get(`history/update`, data);
// 运动数据更新
export const sportUpdataApi = data => axiosIns.get(`sport/totalSport`, data);
// 播放记录
export const historyApi = data => axiosIns.get(`history/list`, data);
// 收藏/取消收藏
export const collectApi = data => axiosIns.get(`collect/update`, data);
// 收藏列表
export const collectListApi = data => axiosIns.get(`collect/list`, data);
// 搜索
export const searchApi = data => axiosIns.get(`search/index`, data);
// 热搜列表
export const searchHotApi = data => axiosIns.get(`search/hotBot`, data);


// 用户登录二维码
export const userCodeApi = data => axiosIns.get(`user/login`, data);
// 用户登出
export const userOutApi = data => axiosIns.get(`user/logout`, data);
// 用户登录检查
export const userStatusApi = data => axiosIns.get(`user/status`, data);
// 用户运动数据
export const sportApi = data => axiosIns.get(`sport/index`, data);
// 会员卡
export const vipCardApi = data => axiosIns.get(`member/index`, data);
// 用户会员卡
export const userVipApi = data => axiosIns.get(`member/memberShip`, data);
// 会员卡详情
export const cardDetailApi = data => axiosIns.get(`member/detail`, data);
// 专辑购买
export const albumBuyApi = data => axiosIns.get(`member/memberAlbum`, data);
// 会员卡购买/专辑购买
export const buyApi = data => axiosIns.get(`transaction/create`, data);
// 会员卡购买/专辑购买 检测
export const buyStatusApi = data => axiosIns.get(`transaction/status`, data);


// 获取文件内容
export const getLinkData = ({ link, data }) => axiosIns.get(link, data);
export const postLinkData = ({ link, data }) => axiosIns.post(link, data);

// account_id: 700000002
// avatar: ""
// is_vip: 0
// nickname: "18911851150"
// phone: "18911851150"
// token: "06050ac0248d8b0e50619dcb23d20d71"
// vip_expiry_date: ""
// weixin_openid: ""
