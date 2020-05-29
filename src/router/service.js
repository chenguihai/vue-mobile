export default [
  {
    path: '/serviceList', // 服务列表
    component: () => import('@/views/service/list')
  },
  {
    path: '/serviceClaList', // 分类
    component: () => import('@/views/service/claList')
  },
  {
    path: '/serviceDetail/:id', // 服务详情
    component: () => import('@/views/service/detail')
  },
  {
    path: '/commentDetail', // 此服务评价
    component: () => import('@/views/service/commentDetail')
  },
  {
    path: '/serviceSearch', // 搜索
    component: () => import('@/views/service/search')
  },
  {
    path: '/serviceOrder', // 订单
    component: () => import('@/views/service/order'),
    meta: { requireAuth: true }
  },
  {
    path: '/serviceDemand', // 需求
    component: () => import('@/views/service/demand'),
    meta: { requireAuth: true }
  },
  {
    path: '/serviceStage', // 阶段
    component: () => import('@/views/service/stage'),
    meta: { requireAuth: true }
  },
  {
    path: '/serviceRefund', // 退款
    component: () => import('@/views/service/refund'),
    meta: { requireAuth: true }
  },
  {
    path: '/serviceAdditional', // 补充需求
    component: () => import('@/views/service/additional'),
    meta: { requireAuth: true }
  },
  {
    path: '/serviceComment', // 评价
    component: () => import('@/views/service/comment'),
    meta: { requireAuth: true }
  },
  {
    path: '/serviceClose', // 关闭需求
    component: () => import('@/views/service/close'),
    meta: { requireAuth: true }
  },
  {
    path: '/serviceExplain', // 解释
    component: () => import('@/views/service/explain'),
    meta: { requireAuth: true }
  },
  {
    path: '/serviceContract', // 合同
    component: () => import('@/views/service/contract'),
    meta: { requireAuth: true }
  },
  {
    path: '/serviceMsign', // 手绘签名
    component: () => import('@/views/service/msign'),
    meta: { requireAuth: false }
  },
  {
    path: '/serviceStage', // 验收付款
    component: () => import('@/views/service/stage'),
    meta: { requireAuth: true }
  }
]
