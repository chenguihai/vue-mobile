import {post, get} from '@/utils/req'

export function getCategory() { //基础类目数据列表
  return get({url: '/skill/getCategory'})
}
export function getRealm() { //基础领域数据列表
  return get({url: '/skill/getRealm'})
}
export function skillAdept(data) { //新增\编辑擅长领域
  return post({url: '/skill/adept',data})
}
export function skillAdd(data) { //类目入驻
  return post({url: '/skill/add',data})
}
export function applyOpen() { //申请开通店铺
  return get({url: '/shop/applyOpen'})
}
