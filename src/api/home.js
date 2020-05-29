import { post,get } from '@/utils/req'

export function mindex () {
  return post({ url: '/mindex' })
}

export function msgupdate (type) {
  return get({ url: `/user/msgcount?type=${type}` })
}

export function cateInfo (data) {
  return post({ url: '/cate/info', data })
}
