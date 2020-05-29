import {USER_INFO, MSG_T, MSG_S} from '@/utils/tool'
import {imgUrl, devUrl} from '@/utils/commonData'

let ua = navigator.userAgent.toLowerCase()
let userInfo = localStorage.getItem(USER_INFO)
let msg_t = localStorage.getItem(MSG_T)
let msg_s = localStorage.getItem(MSG_S)
userInfo = userInfo ? JSON.parse(userInfo) : null

export default {
  userInfo, // 用户信息
  storeInfo: {
    serviceStatistic: {},
    shopLevel: {},
    customer_services: {},
    shop_category: {},
    vip_level: {}
  },
  isWeixin: ua.indexOf('micromessenger') !== -1,
  uploadApi: '/admin/uploadImage',
  uploadVideoApi: '/admin/uploadVideo',
  uploadImg: devUrl + '/api/api/user/upavatar',
  api_host: devUrl,
  ali_api_host: imgUrl,
  clues: {
    category: [],
    list: []
  },
  serviceManage: {
    cate: [], // 种类
    realm: [], // 领域
    store_cate: [] // 店铺种类
  },
  allNewsNum: 0,
  serviceSpec: {}, // 图库/规格属性
  serviceIntroduce: [], // 详细介绍
  serviceGallery: [], // 图库
  category: [],
  cateEnter: [],
  field: [],
  authInfo: {}, //认证信息
  msg_t,
  msg_s,
}
