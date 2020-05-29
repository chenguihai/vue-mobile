import {post, get} from '@/utils/req'

export function useradd(data) { //个人实名认证
  return post({url: '/store/sign/useradd', data})
}

export function checkcompany(data) { //企业实名认证第一步-验证企业信息
  return post({url: '/store/sign/checkcompany', data})
}

export function checkshareholder(data) { //企业实名认证第二部-验证法人信息
  return post({url: '/store/sign/checkshareholder', data})
}

export function topay(data) { //企业实名认证第三部-验证对公账号信息
  return post({url: '/store/sign/topay', data})
}

export function payAuth(data) { //企业实名认证第四步-对公账户打款回填
  return post({url: '/store/sign/payAuth', data})
}

export function status(data = {}) { //查询认证结果
  return post({url: '/store/sign/status', data})
}

export function getbranch(data) { //支行查询省市
  return post({url: '/store/sign/getbranch', data}, null, {code: 1000})
}
