import {post, get} from '@/utils/req'

export function storeList(data) { //店铺列表
  return post({url: '/storeList', data})
}

export function getCaseInfo(id) { //获取客户合作示例详情
  return get({url: '/case/getCaseInfo/' + id})
}

export function filtrateList() { //店铺筛选数据列表
  return get({url: '/store/filtrateList'})
}
