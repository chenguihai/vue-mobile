/**
 * @Description: 根据type返回是店铺的类型属于企业或个人
 * @param {type | Number} 店铺信息的 type_id
 * @return: String
 * @Date: 2019-10-26 13:09:55
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
const STORE_TYPE_MAP = new Map([[1, '个人'], [2, '企业']])
export const storeType = type => STORE_TYPE_MAP.get(type)

/**
 * @Description: 同类服务比较文字
 * @param {scroe | Number}
 * @return: String
 * @Date: 2019-10-26 13:50:24
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export const serviceDiffText = score => {
  return score < 0 ? '低' : score === 0 ? '持平' : '高'
}
export const falseToZero = num => {
  return num || 0
}
export const splitTime = time => {
  return time.split(' ')[0]
}

export const abs = score => Math.abs(score)

const MEDIA_LEVEL = new Map([[0, '直营媒体'], [1, '一级代理'], [2, '二级代理'], [3, '其他']])
export const mediaLevel = type => MEDIA_LEVEL.get(type)
