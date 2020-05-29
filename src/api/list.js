
import { post,get ,del,put} from '@/utils/req'

// 雇主中心首页
export function userIndex(){
  return get({url:'/user/mobile/index'})
}
export function orderData(){
  return get({url:'/user/mobile/more'})
}

// 我的订单
export function userOrder (created,type,title,page) {
  return get({ url: `/user/order?created=${created}&type=${type}&title=${title}&page=${page}` })
}

// 判断是否开店
export function commonTop(){
  return get({url:'/common/top'})
}
// 消息总数
export function msgcount(type){
  return get({url:`/user/msgcount?type=${type}`})
}
// 交易消息总数
export function msgcountT(){
  return get({url:'/user/msgcount?type=T'})
}
// 系统消息总数
export function msgcountS(){
  return get({url:'/user/msgcount?type=S'})
}
//消息列表 /api/user/msg/${currentPage3}?type=S
export function msg(page,type){
  return get({url:`/user/msg/${page}?type=${type}`})
}
// 全部设为已读
export function msgupdate(){
  return get({url:`/user/msgupdate`})
}
// 设置一条为已读
export function updateOne(id){
  return get({url:`/user/msg/update/${id}`})
}
// 交易消息-删除
export function deleteNews(id){
  return get({url:`/user/msg/delete/${id}`})
}
// 图片
export function homeImage(type){
  return post({url:`/user/homeimage?type=${type}`})
}
// 我的评价
export function evaluate(page){
  return get({url:`/user/evaluate?page=${page}`})
}
// 申请发票
export function applyInvoice(data){
  return post({url:'/service/applyInvoice',data})
}

// 我的发票
export function invoice(page){
  return get({url:`/user/invoice?page=${page}`})
}
// 我的退款
export function refund(){
  return get({url:'/user/refund'})
}
// 取消退款
export function refundSuccess(ordersn){
  return get({url:`/user/refundsuccess?ordersn=${ordersn}`})
}
// 我的线索
export function myClue(page){
  return get({url:`/user/myclue/${page}`})
}
// 我的银行卡
export function userBank(){
  return get({url:'/user/bank'})
}
// 删除用户银行卡
export function bankDelete(id){
  return del({url:`/user/bank/delete/${id}`})
}
// 添加银行卡
export function bankAdd(data){
  return post({url:'/user/bank/add',data})
}
// 银行查询
export function bankCount(){
  return get({url:'/user/bankcount'})
}
// 查看E签宝账户
export function signAccount(){
  return get({url:'/user/sign/account'})
}
// 验证银行E签宝
export function accountExp(){
  return get({url:'/user/account/exp'})
}
// 账户资金查询
export function accountMoney(){
  return get({url:'/user/account'})
}
// 账户资金查询
export function accountList(startTime,endTime,status,page){
  return post({url:`/user/account/list?startTime=${startTime}&endTime=${endTime}&status=${status}&page=${page}`})
}
// 提现页面
export function takeShow(){
  return get({url:'/user/take/show'})
}
// 提现
export function takeMoney(data){
  return post({url:'/user/take/money',data})
}
// 账户余额明细类型
export function accountType(){
  return get({url:'/user/account/type'})
}
// 提现列表记录（包括查询）
export function takeList(startTime,endTime,status,page){
  return post({url:`/user/take/list?startTime=${startTime}&endTime=${endTime}&status=${status}&page=${page}`})
}
// 筛选时间
export function takeTime(){
  return get({url:'/user/take/time'})
}
// 修改昵称
export function modifyName(nick_name){
  return post({url:`/user/modify/name?nick_name=${nick_name}`})
}
// 修改个人信息
export function upInfodataData(data){
  return post({url:'/user/upinfodata',data})
}

// 修改绑定手机：验证码
export function changMobile(data){
  return post({url:'/member/retrievepassword',data})
}
// 修改绑定手机号码第一步：下一步
export function changPhone(data){
  return post({url:'/user/mobile/edit',data})
}
// 修改绑定手机号码第二步：获取验证码
export function changMobileP(data){
  return post({url:'/member/verificationCodes',data})
}
// 修改绑定手机号码第二步：下一步
export function newmobile(data){
  return post({url:'/user/mobile/updata',data})
}
// 修改登录密码
export function newpassword(data){
  return post({url:'/user/password',data})
}
// 查看E签宝账户
export function realName(){
  return get({url:'/user/sign/account'})
}
// 个人实名认证
export function perUseradd(data){
  return post({url:'/user/sign/useradd',data})
}
// 企业实名认证 第一步
export function checkcompany(data){
  return post({url:'/user/sign/checkcompany',data})
}
// 企业实名认证 第二步
export function checkCompanyUser(data){
  return post({url:'/user/sign/checkCompanyUser',data})
}

// 企业实名认证 第三步
export function checkTopay(data){
  return post({url:'/user/sign/topay',data})
}
// 企业实名认证 第四步
export function payAuth(data){
  return post({url:'/user/sign/payAuth',data})
}
// 支行查询省市
export function getBranch(data){
  return post({url:'/user/sign/getbranch',data})
}
// 工具市场列表
export function toolsList(){
  return post({url:'/tools/list'})
}
// 工具市场详情
export function toolsInfo(data){
  return post({url:'/tools/info',data})
}
//工具市场下单
export function toolsOrder(data){
  return post({url:'/tools/order',data})
}
export function upavatar(data){
  return post({url:'/user/upavatar',data})
}

// 子类列表
// 获取大类下面所有类目
export function mainHot(id){
  return get({url:`/category/under/main/${id}`})
}
// 获取大类下面热门的三级类目
export function tertiaryHot(id){
  return get({url:`/category/tertiary/hot/${id}`})
}
// 获取类目下平台热门服务列表
export function serviceHot(first_id,second_id,third_id,page){
  return get({url:`/service/hot/${first_id}/${second_id}/${third_id}?page=${page}`})
}
// 退款详情页
export function refundD(order_sn){
  return get({url:`/user/refund?order_sn=${order_sn}`})
}
// 退款详情页
export function invoiceD(order_sn){
  return get({url:`/user/invoice?order_sn=${order_sn}`})
}
// 刷新Token
export function refreshToken (){
  return put({url:`/member/authorizations/current`})
}



