import { post, get } from '@/utils/req'

/**
 * @Description: 店铺筛选数据列表
 * @param {
 * cid	是	int	分类id (搜索页面可不传)
 * first_letter	否	string	首字母，品牌筛选用
 * }
 * @return:
 * @Date: 2019-11-14 17:02:10
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */

export function getScreeningList (cid) {
  return post({ url: '/service/filtrateList', data: { cid } })
}

/**
 * @Description: tab分类
 * @param {
 * cate	array	分类信息
 * hot	array	热门专区
 * }
 * @return:
 * @Date: 2019-11-15 11:43:58
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getIndexClaList (data) {
  return post({ url: '/cate', data })
}

/**
 * @Description: 获取服务列表
 * @param {
 * cid	是	int	分类id (搜索是不传，传keywords)
 * page	否	int	分页参数，url后面携带
 * brand_id	否	int	品牌id，品牌筛选使用
 * price_id	否	int	价格id，价格筛选使用
 * priceMin	否	int	价格区间第一个值
 * priceMax	否	int	价格区间第二个值
 * realm_id	否	int	热门领域id，领域筛选使用
 * region_id	否	int	地区id，地区筛选使用
 * filterArr	否	array	其他规格属性筛选 [{‘id’:1,’filter_Info’:’天’},{‘id’:27,’filter_Info’:’10次/天’}]
 * keywords	否	string	搜索关键字
 * order	否	string	排序字段，（sales,comments,price,update）
 * sort	否	string	排序方式 ，（desc,asc）
 * }
 * @return:
 * @Date: 2019-11-15 15:35:44
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */

export function getServiceList (opts) {
  const data = Object.assign({}, opts)
  if (data.keywords) {
    data.cid = undefined
  }
  return post({ url: '/service/serviceList', data })
}

export function getServiceDetail (sid) {
  return get({ url: `/service/details/${sid}` })
}

/**
 * @Description: 服务详情评价
 * @Date: 2019-11-23 10:34:32
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
// { per_page = 2, page } = {}
// { sid, per_page, page }
export function getServiceComments (data) {
  return post({ url: '/service/serviceComments', data })
}

/**
 * @Description: 服务下单
 * @param {
 * sid	是	integer	服务id
 * spec_json	否	array	规格属性
 * amount	是	numeric	价格
 * number	是	integer	数量
 * service_demand	是	string	需求内容
 * demand_files	否	array	附件url
 * }
 * @Date: 2019-11-23 17:51:54
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */

export function buyService (data) {
  return post({ url: '/service/creatOrders', data, json: true })
}

/**
 * @Description: 订单详情
 * @param {
 * order_sn 订单号
 * args 需要适配路由钩子做出操作时可以注入axios.config}
 * @return:
 * @Date: 2019-11-26 11:21:30
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getOrderDetail (order_sn, args) {
  return post({ url: '/service/orderInfo', data: { order_sn } }, args)
}

/**
 * @Description: 用户信息
 * @param {token}
 * @return:
 * @Date: 2019-11-26 11:29:22
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getUserInfo () {
  return get({ url: '/user', data: { token: localStorage.getItem('token') } })
}

/**
 * @Description: 阶段信息
 * @param {type}
 * @return:
 * @Date: 2019-11-26 11:57:05
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getPhaseInfo (order_sn, args) {
  return post({ url: '/service/fundSettlementInfo', data: { order_sn } }, args)
}

// 获取上传稿件的临时地址
export const viewFiles = (id, way) => {
  return post({ url: '/service/viewFile', data: { id, way } })
}
// 服务商删除文件
export function delFile (id) {
  return post({ url: '/service/deleteFile', data: { id } })
}

/**
 * @Description: 雇主关闭需求
 * @param {
 * 参数名	必选	类型	说明
 * order_sn	是	string	订单号
 * reason_id	是	int	关闭原因id
 * text	否	string	关闭原因，关闭原因为其他时填写}
 * @return:
 * @Date: 2019-11-04 15:31:54
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export const closeService = data => {
  return post({ url: '/service/cancelOrder', data })
}

/**
 * @Description: 提交补充需求
 * @param {
 * require	是	string	补充需求内容
 * require_attach	否	array	附件url地址
 * order_id	是	int	订单表的订单id
 * }
 * @return:
 * @Date: 2019-11-26 15:09:44
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export const submitSupplement = params => {
  return post({
    url: '/service/addSupplement',
    data: params
  })
}
/**
 * @Description: 提交补充需求
 * @param {
 * order_sn	是	string	订单号
 * reason_id	是	string	申请退款原因id
 * text	是	string	问题描述
 * url	否	array	附件链接url
 * }
 * @return:
 * @Date: 2019-11-26 15:09:44
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
// 申请退款
export const applyRefund = data => {
  return post({
    url: '/service/applyRefund',
    data
  })
}
/**
 * @Description: 获取合同
 * @param {
 * order_sn	是	string	订单号
 * }
 * @return:
 * @Date: 2019-11-26 15:09:44
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getContract (order_sn) {
  return get(
    {
      url: `/contract/contract/${order_sn}`
    },
    undefined,
    { code: '200' }
  )
}
/**
 * @Description: 获取合同状态
 * @param {
 * order_sn	是	string	订单号
 * }
 * @return:
 * @Date: 2019-11-26 15:09:44
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getContractStatus (order_sn) {
  return get(
    {
      url: `/contract/stuff/${order_sn}`
    },
    undefined,
    { code: '200', toast: false }
  )
}

/**
 * @Description: 查询是否认证E签宝
 * @param {type}
 * @return:
 * @Date: 2019-11-27 17:52:06
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function isCert () {
  return get({ url: '/contract/account' }, undefined, { toast: false })
}

/**
 * @Description: 查询是否认证E签宝
 * @param {
 * begin_time	是	string	开始时间
 * end_time	是	string	结束时间
 * day_count	是	int	总天数
 * ProjectPhasePrice	是	int	总价格
 * content	是	int	内容
 * ordersn	是	int	服务订单
 * project[0][ProjectPhaseGain]	是	string	阶段说明
 * project[0][ProjectPhaseName]	是	string	阶段名字
 * project[0][ProjectPhasePrice]	是	int	阶段价格
 * project[0][ProjectPhaseDay]	是	int	阶段天数
 * }
 * @return:
 * @Date: 2019-11-27 17:52:06
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function fillContract (data) {
  return post({ url: '/contract/contentstuff', data }, undefined, { code: '200' })
}

/**
 * 合同-签约清除个人签名
 * @param ordersn
 */
export function eSignUserRemove (data) {
  return post(
    {
      url: `/contract/eSignUserRemove`,
      data
    },
    undefined,
    { code: '200', toast: true }
  )
}
/**
 * 合同-签约存放个人签名
 * @param eSignUser
 */
export function eSignUser (data) {
  return post(
    {
      url: `/contract/eSignUser`,
      data
    },
    undefined,
    { code: 1000, toast: false }
  )
}
/**
 * 合同-请求签名的token
 * @param contractQrCode
 */
export function contractQrCode (data) {
  return post(
    {
      url: `/contract/qrCode`,
      data
    },
    undefined,
    { code: '200', toast: false }
  )
}
/**
 * 合同-签约查看个人签名
 * @param ordersn
 */
export function eSignUserGet (ordersn) {
  return post(
    {
      url: `/contract/eSignUserGet`,
      data: { ordersn }
    },
    undefined,
    { code: '200' }
  )
}

/**
 * 合同-签约发送短信
 * @param null
 */
export function eSignUserCode () {
  return get(
    {
      url: `/contract/eSignUserCode`
    },
    undefined,
    { code: '200' }
  )
}

/**
 * 合同-签约
 * @param data
 */
export function contractSign (data) {
  return post(
    {
      url: `/contract/sign`,
      data
    },
    undefined,
    { code: '200' }
  )
}

/*
企业个人判别
*/
export function getCAndP () {
  return get({ url: '/user/sign/account' })
}

/**
 * @Description: 支付结算阶段
 * @param {
 *      order_sn	是	string	订单号
 *      verification_key	是	string	发短信时返回的key值
 *      verification_code	是	int	验证码
 *      stage_id	是	int	本次结算阶段id
 *    }
 * @return:
 * @Date: 2019-11-02 21:10:48
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function payPhase (data) {
  return post({
    url: '/service/fundSettlement',
    data
  })
}

// 资金结算短信验证码
export function sendPhaseCode (mobile) {
  return post({
    url: '/service/sendSettlementCode',
    data: { mobile }
  })
}
// 申请验收
export function applyPay (order_sn) {
  return post({ url: '/service/applyPayment', data: { order_sn } })
}

/**
 * @Description: 评价服务
 * @param {
 * 参数名	必选	类型	说明
 * order_sn	是	string	订单号
 * type	是	int	1:雇主评价 2：服务商评价
 * attitude	否	int	服务态度
 * speed	否	int	工作速度
 * quality	否	int	完成质量
 * evaluate	是	int	1是好评 2是中评 3是差评
 * text	是	string	评价内容
 * }
 * @return:
 * @Date: 2019-11-03 21:04:06
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function sendComments (data) {
  return post({
    url: '/service/comments',
    data
  })
}

/**
 * @Description: 提交解释
 * @param {
 * 参数名	必选	类型	说明
 * order_sn	是	string	订单号
 * explain	是	string	解释内容
 * }
 * @return:
 * @Date: 2019-11-03 21:55:28
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function sendExplain (data) {
  return post({
    url: '/service/explain',
    data
  })
}

// 接收订单
export function acceptOrder (data) {
  return post({ url: '/service/signBill', data })

}
//搜索热词1服务，2店铺，3线索，4任务，5其他
export function hotWordList (type){
  return get ({
    url: `/searchKeyword/index?type=`+type,
  });
};
// 搜索查询
export function searchSuggest (type,keyword,num){
  return get ({
    url: `/search/suggest?type=${type}&keyword=${keyword}&num=${num}` ,
  });
};

