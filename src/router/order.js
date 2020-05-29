export default [
  { //订单退款
    path: '/orderRefund',
    component: () => import('@/views/order/orderRefund')
  },
  { //订单退款详情
    path: '/order/orderDetail',
    component: () => import('@/views/order/orderDetail')
  },
  { //拒绝退款
    path: '/refusalRefund',
    component: () => import('@/views/order/refusalRefund')
  },
  { //评价订单
    path: '/evaluationOrder',
    component: () => import('@/views/order/evaluationOrder')
  },
  { //服务订单
    path: '/order/serviceOrder',
    component: () => import('@/views/order/serviceOrder')
  },
  { //线索订单
    path: '/order/clueOrder',
    component: () => import('@/views/order/clueOrder')
  },
]
