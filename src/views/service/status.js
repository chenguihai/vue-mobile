/*
正常订单流程
order_status  1待托管,2待接单,3待签署,4工作中,5待验收,6待评价,7已成交
*/
const _STATUS_LIST = new Map([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]])

/*
正常流程UI
ui_status  1待托管,2待接单,3待签署,4工作中,5待验收,6待评价,7已成交
*/
const _UI_STATUS_LIST = new Map([
  [1, '待托管'],
  [2, '待接单'],
  [3, '待签署'],
  [4, '工作中'],
  [5, '待验收'],
  [6, '待评价'],
  [7, '已成交']
])

/*
pay_status 0未付款，1已付款，2已退款
*/
/**
 * @Description: 正常流程UI反馈
 * @param {order_status | 订单状态,
 *  pay_status | 付款状态,
 *  apply | 是否发起退款,
 *  refund | 退款状态}
 * @return:
 * @Date: 2019-10-31 12:11:48
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function stateForUI (order_status, pay_status, apply, refund) {
  const res = { status: null, ready: false, _code: _STATUS_LIST.get(order_status) }
  if (order_status === 1) {
    // 提交需求 直接走
    res.ready = true
  } else if (![8, 9].includes(order_status)) {
    // 托管赏金 判断付款
    switch (pay_status) {
      case 2:
        // 已退款 直接走异常流程
        return errorStateForUI(order_status, pay_status, 1, 1)
      case 1:
        // 已付款
        res.ready = true
        break
      default:
        // 未付款
        res.ready = false
        break
    }
    // 待验收 待评价
    if ([5, 6].includes(order_status)) {
      res.ready = false
    }
  } else {
    // 8,9 走异常
    return errorStateForUI(order_status, pay_status, apply, refund)
  }
  res.status = _UI_STATUS_LIST.get(res._code)
  return res
}

/*
异常订单流程
order_status  8已冻结 9未成交
*/
const ERROR_STATUS_LIST = new Map([[8, 1], [9, 1]])

/*
异常流程UI
ui_status  1提交需求 2托管赏金 6已退款 7已冻结 8未成交
*/
const ERROR_UI_STATUS_LIST = new Map([[1, '待接单'], [2, '待托管'], [6, '已退款'], [7, '已冻结'], [8, '未成交']])

/**
 * @Description: 异常流程UI反馈
 * @param {order_status | 订单状态,
 *  pay_status | 付款状态,
 *  apply | 是否发起退款
 *  refund | 退款状态}
 * @return:
 * @Date: 2019-10-31 12:12:28
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
/*
isRefund	是否申请退款 0 1
refundStatus	申请退款状态 没有申请是null 0待处理,1已退款,2已拒绝,3已取消
*/
export function errorStateForUI (order_status, pay_status, apply, refund) {
  const res = { status: null, ready: false, _code: ERROR_STATUS_LIST.get(order_status) }
  // 托管赏金 判断付款
  switch (pay_status) {
    case 2:
      // 已退款 直接走
      res._code = 6
      res.ready = true
      break
    case 1:
      /*
      已付款 是否发起退款申请
      是  未退款
      否  直接已关闭
      */
      if (apply === 1) {
        // 如果申请退款 就看退款状态
        // 已退款
        res.ready = refund === 1
        res._code = res.ready ? 6 : 7
      } else {
        // 没有申请退款
        res.ready = true
        res._code = 8
      }
      break
    default:
      // 未付款  直接已关闭
      res.ready = true
      res._code = 8
      break
  }
  res.status = ERROR_UI_STATUS_LIST.get(res._code)
  return res
}

export const STATUS_RENDER = [
  { code: 1, name: '提交需求', inactiveName: '提交需求', timeProp: 'created_at' },
  { code: 2, name: '托管赏金', inactiveName: '托管赏金', timeProp: 'pay_time' },
  { code: 3, name: '工作中', inactiveName: '凌客工作', timeProp: 'work_at' },
  { code: 4, name: '验收付款', inactiveName: '验收付款', timeProp: 'accept_at' },
  { code: 5, name: '已评价', inactiveName: '评价', timeProp: 'finish_time' }
]
export const ERROR_RENDER = [
  { code: 1, name: '提交需求', inactiveName: '提交需求', timeProp: 'created_at' },
  { code: 2, name: '托管赏金', inactiveName: '托管赏金', timeProp: 'pay_time' },
  { code: 6, name: '已退款', inactiveName: '已退款', timeProp: 'refund_at' }
]
export const CLOSE_RENDER = [
  { code: 1, name: '提交需求', inactiveName: '提交需求', timeProp: 'created_at' },
  { code: 8, name: '已关闭', inactiveName: '已关闭', timeProp: 'updated_at' }
]
