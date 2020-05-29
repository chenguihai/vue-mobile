export default [
  { //我的保证金
    path: '/myBond',
    component: () => import('@/views/bond/myBond')
  },
  { //补缴保证金
    path: '/payBond',
    component: () => import('@/views/bond/payBond')
  },
  { //退回保证金
    path: '/returnBond',
    component: () => import('@/views/bond/returnBond')
  },
  { //技术费率详情
    path: '/rateDetails',
    component: () => import('@/views/bond/rateDetails')
  },
  {  //缴纳保证金
    path: '/deposit',
    component: () => import('@/views/bond/deposit')
  }
]
