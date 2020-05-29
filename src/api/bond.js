import {post, get} from '@/utils/req'

export function skillList() { //未缴纳保证金列表
  return get({url: '/skill/list'})
}

export function deletecate(data) { //删除类目
  return post({url: '/skill/deletecate', data})
}

export function marginOrder(data) { //缴纳保证金
  return post({url: `/skill/marginOrder`, data})
}

export function techRateList() { //技术费率详情
  return get({url: `/skill/techRateList`})
}

export function checkReturnMargin() { //退还保证金状态检测
  return get({url: `/skill/checkReturnMargin`})
}

export function getMargin(data) { //当前保证金缴纳记录列表
  return post({url: `/skill/getMargin`, data})
}

export function bankList() { //退还保证金 银行卡列表
  return get({url: '/skill/bankList'})
}
export function returnMargin(data) { //退还保证金
  return post({url: '/skill/returnMargin',data})
}
