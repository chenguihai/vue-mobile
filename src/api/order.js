import {post, get} from '@/utils/req'

export function refundList(data) { //订单退款 - 订单退款列表
  return post({url: '/service/order/refundList', data})
}

export function refundStatus(data) { //订单退款
  return post({url: '/service/order/refundStatus', data})
}

export function invoiceList(data) { //订单发票 - 发票列表
  return post({url: '/service/invoice/list', data})
}

export function invoiceStatus(data) { //订单发票 - 发票状态
  return post({url: '/service/invoice/status', data})
}

export function orderList(data) { //我的交易 - 服务订单列表
  return post({url: '/service/order/list', data})
}

export function changePrice(data) { //修改订单价格
  return post({url: '/service/order/changePrice', data})
}

export function clueList(data = '') { //商户线索列表
  return get({url: '/store/clue/list?page=' + data}, null, {code: 900})
}

export function commentList(data) { //服务订单评价
  return post({url: '/service/comment/list',data})
}

// console.log(JSON.parse(JSON.stringify(this.serviceList)));
