import {post, get} from '@/utils/req'

/**
 线索支付
 */
export function payServiceClue(data) {
  return get({url: `user/clue/payserviceclue?order_sn=${data.order_sn}&pay_type=${data.pay_type}`}, null, {
    code: 900
  })
}

/**
 缴纳保证金支付
 */
export function skillPayment(data) {
  return get({url: `skill/payment?order_sn=${data.order_sn}&pay_id=${data.pay_id}`}, null, {code: 900})
}

/**
 服务订单支付
 */
export function paymentService(data) {
  return get({url: `service/payment?order_sn=${data.order_sn}&pay_id=${data.pay_id}`}, null, {code: 900})
}

/**
 缴纳保证金支付状态查询
 */
export function skillCheckStatus(data) {
  return post({url: `skill/checkStatus`, data})
}

/**
 线索查询支付状态
 */
export function cluePayStatus(data) {
  return post({url: `user/cluepay`, data})
}

/**
 查询工具支付状态
 */
export function toolsOrderStatus(data) {
  return post({url: `tools/order/status`, data})
}

/**
 查询服务支付状态
 */
export function serviceOrderStatus(data) {
  return post({url: `service/checkStatus`, data}, undefined, {toast: false})
}

/**
 工具市场支付
 */
export function toolsPay(data) {
  return get({url: `tools/pay?pay_id=${data.pay_id}&order_sn=${data.order_sn}&token=${data.token}`}, null, {
    code: 900
  })
}

/**
 线索购买支付
 */
export function payshopclue(data) {
  return get({url: `user/clue/payshopclue?pay_type=${data.pay_type}&order_sn=${data.order_sn}`}, null, {
    code: 900
  })
}

/**
 工具市场定单详情
 */
export function orderInfo(data) {
  return post({url: `tools/order/info`, data})
}

/**
 保证金定单详情
 */
export function skillOrderInfo(data) {
  return post({url: `skill/orderInfo`, data})
}

/**
 保证金定单详情
 */
export function serviceOrderInfo(data) {
  return post({url: `service/orderInfo`, data})
}

/**
 线索发布
 */
export function cluesOrderDetail(data) {
  return post({url: `user/cluesn`, data})
}
