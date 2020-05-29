export default [
  {
    path: '/newbieTask',
    component: () => import('@/views/auth/newbieTask')
  },
  {
    path: '/skillManage',
    component: () => import('@/views/auth/skillManage')
  },
  {
    path: '/viewCategory',
    component: () => import('@/views/auth/viewCategory')
  },
  {
    path: '/selectCategory',
    component: () => import('@/views/auth/selectCategory')
  },
  {
    path: '/agreement',
    component: () => import('@/views/auth/agreement')
  },
  {
    path: '/noticeEntry',
    component: () => import('@/views/auth/noticeEntry')
  },
  { //添加
    path: '/addField',
    component: () => import('@/views/auth/addField')
  },
  {//服务入驻协议
    path: '/serviceSettle',
    component: () => import('@/views/auth/serviceSettle')
  },
  {//了解诚信保证金
    path: '/bond',
    component: () => import('@/views/auth/bond')
  },
  {//了解技术费率
    path: '/skillRate',
    component: () => import('@/views/auth/skillRate')
  }
]
