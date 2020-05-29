import {post, get} from '@/utils/req'

export function getShopInfo() { //获取店铺资料
  return get({url: '/shop/getShopInfo'}, null, {code: 1000})
}

export function shopAdd(data) { //提交店铺资料
  return post({url: '/shop/add', data}, null, {code: 1000})
}

export function shopEdit(data) { //修改店铺资料
  return post({url: '/shop/edit', data}, null, {code: 1000})
}

export function shopScales() { //获取公司规模列表
  return get({url: '/shop/scales'})
}

export function shopNatures() { //获取公司性质列表
  return get({url: '/shop/natures'})
}

export function shopApplayOpen() { //申请开通店铺
  return get({url: '/shop/applyOpen'})
}

// 媒介资质
export function mediaList() { //媒介资质列表
  return get({url: '/media/list'})
}

export function getInfoById(id) { //获取用户媒介资质详情
  return get({url: '/media/getInfo/' + id})
}

export function mediaEdit(id, data) { //编辑媒介资质
  return post({url: '/media/edit/' + id, data})
}

export function mediaAdd(data) { //新增媒介资质
  return post({url: '/media/add', data})
}

export function mediaDelete(id) { //删除媒介资质
  return get({url: '/media/delete/' + id})
}

// 自传资质
export function selfhonorAdd(data) { //新增自传资质
  return post({url: '/selfhonor/add', data})
}

export function selfhonorEdit(id, data) { //编辑自传资质
  return post({url: '/selfhonor/edit/' + id, data})
}

export function selfhonorDelete(id) { //删除自传资质
  return get({url: '/selfhonor/delete/' + id})
}

export function selfhonorGetInfo(id) { //获取用户自传资质详情
  return get({url: '/selfhonor/getInfo/' + id})
}

export function shopHonortype() { //获取用户自传资质详情
  return get({url: '/shop/honortype'})
}

export function selfhonorList() { //当前用户自传资质列表
  return get({url: '/selfhonor/list'})
}

// 工作经历
export function experienceDelete(id) { //删除工作经历
  return get({url: '/experience/delete/' + id})
}

export function experienceEdit(id, data) { //编辑工作经历
  return post({url: '/experience/edit/' + id, data})
}

export function experienceAdd(data) { //新增工作经历
  return post({url: '/experience/add', data})
}

export function experienceList() { //当前用户工作经验列表
  return get({url: '/experience/list'})
}

export function experienceGetInfo(id) { //获取用户工作经历详情
  return get({url: '/experience/getInfo/' + id})
}

// 隶属媒体
export function companyEdit(id, data) { //编辑隶属媒体公司
  return post({url: '/media/company/edit/' + id, data})
}

export function companyAdd(data) { //新增隶属媒体公司
  return post({url: '/media/company/add', data})
}

export function companyList() { //隶属媒体公司
  return get({url: '/media/company/list'})
}

export function companyDelete(id) { //删除隶属媒体公司
  return get({url: '/media/company/delete/' + id})
}
