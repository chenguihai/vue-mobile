import {post, get} from '@/utils/req'

export function serviceList(data) { //服务列表
  return post({url: '/service/list', data})
}

export function serviceShelf(data) { //服务上架
  return post({url: '/service/shelf', data})
}

export function serviceDelete(data) { //服务删除
  return post({url: '/service/delete', data})
}

export function serviceLabel(data) { //设置标签
  return post({url: '/service/label', data})
}

export function serviceShowAdd() { //服务添加-基本信息添加页面
  return post({url: '/service/showadd'})
}

export function serviceAdd(data) { //服务添加-基本信息保存
  return post({url: '/service/add', data}, null, {code: 900})
}

export function serviceEdit(data) { //服务编辑-基本信息保存/详细介绍/图库/规格属性保存
  return post({url: '/service/edit', data})
}

export function categoryAdd(data) { //新增店铺分类
  return post({url: '/store/category/add', data}, null, {code: 900})
}

export function categoryList(data) { //获取店铺分类列表接口
  return post({url: '/store/category/list', data}, null, {code: 900})
}

export function serviceBrand(data) { //服务添加-品牌数据列表
  return post({url: '/service/brand', data})
}

export function showEdit(data) { //服务编辑-基本信息编辑页面
  return post({url: '/service/showedit', data})
}

// console.log(JSON.parse(JSON.stringify(data)));
// this.$router.push({path:'/'})
