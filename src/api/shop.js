import { post, get } from '@/utils/req'

/**
 * @Description: 店铺筛选数据列表
 * @param {
 * sid	是	int	店铺id
 * }
 * @return:
 * @Date: 2019-11-14 17:02:10
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getStoreInfo (sid) {
  return get({ url: `/store/storeInfo/${sid}` })
}
/**
 * @Description: 获取店铺服务
 * @param {
 * store_id	是	int	店铺id
 * store_class	否	int	店铺分类筛选id
 * orderby	否	string	服务排序字段（’sales’,’comments’,’price’,’new’）
 * sort	否	string	服务排序降序或者升序（’desc’,’asc’）
 * }
 * @return:
 * @Date: 2019-12-06 16:47:55
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getStoreService (data) {
  return post({ url: `/store/serviceList`, data })
}
/**
 * @Description: 获取店铺分类列表
 * @param
 * @return:
 * @Date: 2019-12-06 16:47:55
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getStoreClaList () {
  return get({ url: `/store/filtrateList` })
}
/**
 * @Description: 获取店铺档案
 * @param
 * @return:
 * @Date: 2019-12-06 16:47:55
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getStoreArchive (storeId) {
  return get({ url: `/store/archive/${storeId}`, data: { equipment: 'wap' } })
}
/**
 * @Description: 获取店铺合作
 * @param
 * @return:
 * @Date: 2019-12-06 16:47:55
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getStoreCase (storeId, data) {
  return get({ url: `/case/list/${storeId}`, data })
}
/**
 * @Description: 获取店铺评价
 * @param
 * @return:
 * @Date: 2019-12-06 16:47:55
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function getStoreComments (storeId, data) {
  return post({ url: `/store/storeComments/${storeId}`, data })
}
