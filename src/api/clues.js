import { post, get } from '@/utils/req'

/**
  线索显示
 */
export function cluesShow () {
  return get({ url: '/user/clue/show' })
}
// 修改绑定手机：验证码
export const changMobile = data => {
  return post({ url: '/member/retrievepassword', data })
}
export const addReleaseData = data => {
  return post({ url: '/user/clue/add', data })
}
// 线索列表-支线（筛选列表）
export const clueShowhead = () => {
  return get({ url: '/user/clue/showhead' })
}
// 线索列表-主线（线索分页）
export const clueShowlist = page => {
  return get({ url: `/user/clue/showlist`, data: { page } })
}
// 线索列表-支线（旁边内容）
export const clueList = () => {
  return get({ url: `/user/clue/list` })
}
// 线索列表-支线（筛选）
export const clueInquire = (money, classd, time, type, dataS, title, page) => {
  return get({
    url: `/user/clue/inquire`,
    data: {
      money,
      'class': classd,
      time,
      type,
      data: dataS,
      title,
      page
    }
  })
}
// 线索详情
export const clueShopShow = id => {
  return get({ url: `/user/clue/shopshow/${id}` }, null, { code: 900 })
}
// 增值服务下单
export const servicesn = data => {
  return post({ url: '/user/clue/servicesn', data })
}
// 线索补充
export const clueAppend = data => {
  return post({ url: '/user/clue/append', data }, undefined, { code: 200 })
}
// 商户购买线索下单
export const cluepaysn = data => {
  return post({ url: '/user/clue/cluepaysn', data }, undefined, {toast: false})
}
