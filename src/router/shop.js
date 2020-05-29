export default [
  { //店铺列表
    path: '/shopList',
    component: () => import('@/views/shop/shopList')
  },
  {//店铺详情
    path: '/shopDetail/:id',
    component: () => import('@/views/shop/shopDetail')
  },
  {//资质详情
    path: '/qualifyDetail',
    component: () => import('@/views/shop/qualifyDetail')
  },
  {//自传资质详情
    path: '/certificateDetail',
    component: () => import('@/views/shop/certificateDetail')
  },
  {//客服示例
    path: '/customerExample',
    component: () => import('@/views/shop/customerExample')
  },
  {//案例详情
    path: '/caseDetail',
    component: () => import('@/views/shop/caseDetail')
  },
]
