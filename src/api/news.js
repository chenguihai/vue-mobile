import { get } from '@/utils/req'

// 文章中心 - 新闻资讯首页
export const newsCentre = () => {
  return get({ url: '/newsCentre' }, undefined, { code: 900 })
}

// 文章中心 - 新闻资讯列表
export const newsCentreList = (id, page) => {
  return get({ url: `/newsCentreList/${id}?page=${page}`}, undefined, {code: 900})
}

// 新闻资讯 - 详情
export const newsCentreDetail = id => {
  return get({ url: `/newsCentreDetail/${id}`}, undefined, {code: 900})
}
