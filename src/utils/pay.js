/**
 * 支付相关服务
 */

const util = require('./util.js');
const api = require('../api/api.js');

/**
 * 判断用户是否登录
 */
export const payOrder = (orderId) => {
  return new Promise(function (resolve, reject) {
    util.request(api.PayPrepayId, {
      orderId: orderId
    }).then((res) => {
      if (res.data.code === 200) {
        const payParam = res.data
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            resolve(res)
          },
          'fail': function (res) {
            reject(res)
          },
          'complete': function (res) {
            reject(res)
          }
        })
      } else {
        reject(res)
      }
    })
  })
}
