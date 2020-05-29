import {post, get} from '@/utils/req'

export function caseList(page) { //客户合作示例列表
  return get({url: '/store/case/caseList?page='+page})
}

export function caseAdd(data) { //新增客户合作示例
  return post({url: '/store/case/add', data},null,{code:900})
}

export function caseEdit(id, data) { //编辑客户合作示例
  return post({url: '/store/case/edit/' + id, data},null,{code:900})
}

export function getCaseInfo(id) { //获取客户合作示例详情
  return get({url: '/store/case/getCaseInfo/' + id})
}

export function caseDelete(id) { //删除客户合作示例
  return get({url: '/store/case/delete/' + id})
}

export function changeAdded(data) { //更改客户合作示例上架状态
  return post({url: '/store/case/changeAdded', data})
}

export function getCategory() { //获取基础三级分类列表
  return get({url: '/store/getCategory'})
}

export function getRealm() { //领域列表
  return get({url: '/service/getRealm'})
}

export function storeIndex() { //店铺后台 - 首页
  return get({url: '/storeIndex'}, null, {code: 1000})
}
